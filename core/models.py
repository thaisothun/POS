from django.db import models
from django.conf import settings
from django.contrib.auth.models import User, Group
from django.db.models.signals import post_save
from django.utils.text import slugify
import re
import uuid
from barcode import Code128
from barcode.writer import SVGWriter
from io import BytesIO
from django.core.files import File
from django.db.models import Sum
from decimal import Decimal
from django.db.models.functions import Lower
from django.utils import timezone


def logo_path(insteance,filename):
    ext = filename.split('.')[-1]
    new_filename = f'{insteance.name}.{ext}'
    return f'Logo/{new_filename}'

def barcode_path(insteance,filename):
    ext = filename.split('.')[-1]
    new_filename = f'{insteance.id}.{ext}'
    return f'Barcode/{new_filename}'

def user_profile_path(instance, filename):
    ext = filename.split('.')[-1]
    new_filename = f'{instance.user}.{ext}'
    return f'Profiles/{new_filename}'

def inventory_photo_path(instance, filename):
    ext = filename.split('.')[-1]
    new_filename = f'{instance.id}.{ext}'
    return f'Inventory_Photo/{new_filename}'

def store_selecte_default():
    store = Store.objects.get(is_selected = True)
    return store.id

class SelectedStore(models.Manager):
    def get_queryset(self):        
        return super().get_queryset().filter(store__is_selected=True)

class Store(models.Model):
    name = models.CharField(max_length=100, unique=True)
    code = models.CharField(max_length=3, unique=True)
    phone = models.CharField(max_length=10)
    address = models.CharField(max_length=255)
    logo = models.ImageField(upload_to=logo_path, null=True, blank=True)
    sale_target = models.DecimalField(max_digits=10, decimal_places=2, default=20000)
    created_on = models.DateTimeField(default=timezone.now())
    is_selected = models.BooleanField(default=False)
    
    class Meta:
        ordering = ['name']
        constraints = [
            models.UniqueConstraint(
                Lower('name'),
                Lower('code'), 
                name='unique_case_insensitive_name5'
            )]
        
    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        self.name = self.name.lower()
        self.code = self.code.upper()
        super().save(*args, **kwargs)             

class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    top_ten_filter = models.CharField(choices=[('Yes','Yes'),('No','No')], default='Yes')
    slug = models.SlugField(max_length=255)
    class Meta:
        ordering = ['name']
        constraints = [
            models.UniqueConstraint(
                Lower('name'), 
                name='unique_case_insensitive_name1'
            )
        ]

    def __str__(self):
        return self.name
    
    def save(self, *args, **kwargs):      
        self.name = (self.name).lower()
        self.slug = slugify(self.name)
        super().save(*args, **kwargs)
    
class Unit(models.Model):
    name = models.CharField(max_length=100, unique=True)
    class Meta:
        ordering = ['name']     
        constraints = [
            models.UniqueConstraint(
                Lower('name'), 
                name='unique_case_insensitive_name2'
            )
        ] 

    def save(self, *args, **kwargs):
        self.name = (self.name).lower()
        super().save(*args, **kwargs)
    
    def __str__(self):
        return self.name

class Inventory(models.Model):
    id = models.CharField(max_length=10, primary_key=True)
    name = models.CharField(max_length=50)
    store = models.ForeignKey(Store, on_delete=models.PROTECT)
    slug = models.SlugField(max_length=255, blank=True, null=True, default='will_be_auto_generated' )
    category = models.ForeignKey(Category,on_delete=models.CASCADE, related_name='category')
    description = models.TextField(blank=True, null=True)
    photo = models.ImageField(upload_to=inventory_photo_path, blank=True, null=True,default='Inventory_Photo/no_photo.png')
    unit = models.ForeignKey(Unit, on_delete=models.SET_NULL, null=True, related_name='unit')
    size = models.CharField(choices=[('S','S'),('M','M'),('L','L'),('XL','XL'),('Other','Other')])
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    cost = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    quantity = models.IntegerField(default=0)
    barcode_number = models.CharField(max_length=13, unique=True, blank=True)
    barcode_image = models.ImageField(upload_to=barcode_path, blank=True)
    reorder_alert = models.IntegerField(default=5)
    update_on = models.DateTimeField(auto_now=True)
    status = models.CharField(choices=[('Active','Active'),('Inactive','Inactive')], default='Active')
    objects = SelectedStore()
    class Meta:
        ordering = ['name']
        constraints = [
            models.UniqueConstraint(
                fields=['name', 'store'], 
                name='unique_code_store_inventory'
            )
        ] 

    def __str__(self):
        return self.name
    
    def save(self, *args, **kwargs):
        self.slug = slugify(self.name)
        self.name = (self.name).lower()
        
        if not self.id: 
            if int(Inventory.objects.all().order_by('id').count())>0:
                data_last_id = Inventory.objects.all().order_by('id').last().id
                last_id = re.split(r'(\d+)', str(data_last_id))
                id = int(last_id[1]) + 1
                self.id = f'{self.store.code}-I{id}'
                self.status = 'Active'
                
            else:
                id = 10000
                self.id = f'{self.store.code}-I{id}'

        if not self.barcode_number:
            self.barcode_number = str(uuid.uuid4().int)[:13]
            code = Code128(self.barcode_number, writer=SVGWriter())
            buffer = BytesIO()
            code.write(buffer, options={
                'module_width': 0.5,
                'module_height': 15.0,
                'text' : True,
                'font_size': 8,
                'text_distance': 3.0, 
            })
            self.barcode_image.save(f'{self.barcode_number}.svg', File(buffer), save=False)
            
        super().save(*args, **kwargs)
        
class InventoryAdjustment(models.Model):
    name = models.ForeignKey(Inventory,  on_delete=models.CASCADE, related_name='inventory_adjustment')
    store = models.ForeignKey(Store, on_delete=models.PROTECT)
    adjustment_type= models.CharField(choices=[('Out','Out'),('In','In')], default='Out')
    type = models.CharField(choices=[('Sale','Sale'),('Purchase','Purchase'),('Adjustment','Adjustment')], default='Sale')
    quantity = models.IntegerField(default=0)
    description = models.CharField(max_length=255)
    balance = models.DecimalField(max_digits=10, decimal_places=2)
    transaction_date = models.DateTimeField(auto_now_add=True)
    objects = SelectedStore()
    class Meta:
        ordering = ['id']

    def __str__(self):
        return f'{self.name}'
    
    def save(self, *args, **kwargs):
        item = Inventory.objects.get(id=self.name.id) or 0
        if self.adjustment_type == 'In':
            self.balance = Decimal(item.quantity) + self.quantity
        else:
            self.balance = Decimal(item.quantity) - self.quantity
        item.quantity = self.balance
        item.save()
        super().save(*args, **kwargs)

class Customer(models.Model):
    id = models.CharField(max_length=10, primary_key=True)
    store = models.ForeignKey(Store, on_delete=models.PROTECT)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    gender = models.CharField(choices=[('Male','Male'),('Female','Female')])
    address = models.CharField(max_length=200, blank=True, null=True)
    phone_number1 = models.CharField(unique=True)
    phone_number2 = models.CharField(blank=True, null=True)
    e_mail = models.EmailField(blank=True, null=True)
    membership = models.CharField(choices=[('normal','Normal'),('vip','VIP')])
    note = models.TextField(blank=True, null=True)
    created_on =  models.DateTimeField(default=timezone.now())
    status = models.CharField(choices=[('Active','Active'),('Inactive','Inactive')], default='Active')
    
    class Meta:
        ordering = ['id']

    def __str__(self):
        return f'{self.first_name} {self.last_name}'
    
    def save(self, *args, **kwargs):
        self.slug = slugify(f'{self.first_name} {self.last_name}')
        self.first_name = self.first_name.lower()
        self.last_name = self.last_name.lower()
        if not self.id: 
            if int(Customer.objects.all().order_by('id').count())>0:
                data_last_id = Customer.objects.all().order_by('id').last().id
                last_id = re.split(r'(\d+)', str(data_last_id))
                id = int(last_id[1]) + 1
                self.id = f'{self.store.code}-C{id}'
                
            else:
                id = 10000
                self.id = f'{self.store.code}-C{id}'                    
        super().save(*args, **kwargs)

class CustomerCredit(models.Model):
    name = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name='credit_balance')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.CharField(max_length=255)
    balance = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['id']

    def __str__(self):
        return f'{self.name}'
    
    def save(self, *args, **kwargs):
        last_balance = CustomerCredit.objects.all().filter(name=self.name).order_by('created_at').last() or 0
        self.balance = Decimal(last_balance.balance) + self.amount
        super().save(*args, **kwargs)

class Supplier(models.Model):
    id = models.CharField(max_length=10, primary_key=True)
    store = models.ForeignKey(Store, on_delete=models.PROTECT)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    gender = models.CharField(choices=[('Male','Male'),('Female','Female')])
    address = models.CharField(max_length=200, blank=True, null=True)
    phone_number1 = models.CharField(unique=True)
    phone_number2 = models.CharField(blank=True, null=True)
    e_mail = models.EmailField(blank=True, null=True)
    membership = models.CharField(choices=[('normal','Normal'),('vip','VIP')], default='normal')
    note = models.TextField(blank=True, null=True)
    created_on =  models.DateTimeField(default=timezone.now())
    status = models.CharField(choices=[('Active','Active'),('Inactive','Inactive')], default='Active')
    
    class Meta:
        ordering = ['id']

    def __str__(self):
        return f'{self.first_name} {self.last_name}'
    
    def save(self, *args, **kwargs):
        self.slug = slugify(f'{self.first_name} {self.last_name}')
        self.first_name = self.first_name.lower()
        self.last_name = self.last_name.lower()
        if not self.id: 
            if int(Supplier.objects.all().order_by('id').count())>0:
                data_last_id = Supplier.objects.all().order_by('id').last().id
                last_id = re.split(r'(\d+)', str(data_last_id))
                id = int(last_id[1]) + 1
                self.id = f'{self.store.code}-T{id}'
                
            else:
                id = 10000
                self.id = f'{self.store.code}-T{id}'                    
        super().save(*args, **kwargs)

class SupplierDebit(models.Model):
    name = models.ForeignKey(Supplier, on_delete=models.CASCADE, related_name='credit_balance')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.CharField(max_length=255)
    balance = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    class Meta:
        ordering = ['id']

    def __str__(self):
        return f'{self.name}'
    
    def save(self, *args, **kwargs):
        last_balance = SupplierDebit.objects.all().filter(name=self.name).order_by('created_at').last() or 0
        self.balance = Decimal(last_balance.balance) + self.amount
        super().save(*args, **kwargs)

class PromotionCode(models.Model):
    name = models.CharField(max_length=100)
    store = models.ForeignKey(Store, on_delete=models.PROTECT)
    amount_discount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    max_uses = models.PositiveIntegerField(null=True, blank=True, help_text="Total times this code can be used.")
    max_uses_per_user = models.PositiveIntegerField(null=True, blank=True, help_text="Times a single user can use this code.")
    start_date = models.DateTimeField(null=True, blank=True)
    end_date = models.DateTimeField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    objects = SelectedStore()
    def is_valid(self, customer=None):
        if not self.is_active:
            return False
        now = timezone.now()
        if self.name == 'no code':
            return True
        if self.start_date and now < self.start_date:
            return False
        if self.end_date and now > self.end_date:
            return False
        if self.max_uses and self.usages.count() >= self.max_uses:
            return False
        if customer and self.max_uses_per_user:
            customer_uses = self.usages.filter(customer=customer).count()
            if customer_uses >= self.max_uses_per_user:
                return False
        return True
    
    class Meta:
        ordering = ['name']
        constraints = [
            models.UniqueConstraint(
                fields=['name', 'store'], 
                name='unique_code_store'
            )
        ] 

    def __str__(self):
        return self.name
    
    def save(self, *args, **kwargs):
        self.name = self.name.lower()
        super().save(*args, **kwargs)

class Sale(models.Model):
    id = models.CharField(max_length=10, primary_key=True)
    store = models.ForeignKey(Store, on_delete=models.PROTECT)
    invoice_number = models.CharField(max_length=50)
    transaction_date = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT, null=True, blank=True)
    customer = models.ForeignKey(Customer, on_delete=models.SET_NULL, null=True, blank=True, related_name='customer_sale')
    total_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    discount = models.DecimalField(max_digits=10, decimal_places=0, default=0)
    promotion_code = models.ForeignKey(PromotionCode, on_delete=models.PROTECT)
    net_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    payment_method = models.CharField(max_length=50, choices=[('Cash', 'Cash'),('Bank Transfer', 'Bank Transfer'),('Cash On Delivery','Cash On Delivery')])
    status = models.CharField(choices=[('Pending','Pending'),('Paid','Paid'),('Pending Delete','Pending Delete'),('Deleted','Deleted')], default='Paid')
    deleted_at = models.DateTimeField(null=True, blank=True)
    instruction = models.CharField(blank=True, null=True,max_length=100)
    objects = SelectedStore()
    class Meta:
        ordering = ['invoice_number']
        get_latest_by = ['transaction_date']

    def save(self, *args, **kwargs):
        if not self.id: 
            if int(Sale.objects.all().order_by('id').count())>0:
                data_last_id = Sale.objects.all().order_by('transaction_date').last()
                last_id = re.split(r'(\d+)', str(data_last_id))
                id = int(last_id[1]) + 1
                self.id = f'{self.store.code}-S{id}'
                self.invoice_number = f'S{id}'
            else:
                id = 10000
                self.id = f'{self.store.code}-S{id}'
                self.invoice_number = f'S{id}'
        self.total_amount = self.items_sale.aggregate(total=Sum('total_price'))['total'] or 0
        
        if self.payment_method == 'Cash On Delivery':
            self.status = 'Pending'

        self.net_amount = self.total_amount - (self.total_amount*Decimal(self.discount))/Decimal(100) - int(self.promotion_code.amount_discount)
        super().save(*args, **kwargs)

    def delete_custom(self):
        self.deleted_at = timezone.now()
        self.status = "Deleted"
        self.save()
        sale_item = SaleItem.objects.filter(sale=self.id)
        for item in sale_item:
            item.delete_custom()
            InventoryAdjustment.objects.create(name=Inventory.objects.get(id=item.item_id), adjustment_type = 'In', quantity = item.quantity, store=item.item.store, description = f'adjustment sale item {item.item_id} delete sale id {item.sale}')
        
    def __str__(self):
        return str(self.id)

class SaleItem(models.Model):
    sale = models.ForeignKey(Sale, on_delete=models.DO_NOTHING, related_name='items_sale')
    item = models.ForeignKey(Inventory, on_delete=models.PROTECT)
    quantity = models.PositiveIntegerField(default=1)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    cost = models.DecimalField(max_digits=10, decimal_places=2,default=0)
    total_price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    deleted_at = models.DateTimeField(null=True, blank=True)
    class Meta:
        ordering = ['sale']

    def save(self, *args, **kwargs):
        self.total_price = self.unit_price * self.quantity
        super().save(*args, **kwargs)
        Sale.save(self.sale)
        
    def delete_custom(self,*args, **kwargs ):
        self.deleted_at = timezone.now()
        self.save()

    def __str__(self):
        return str(self.sale)

class PromotionCodeUsage(models.Model):
    promotion = models.ForeignKey(PromotionCode, on_delete=models.PROTECT, related_name='usages')
    customer = models.ForeignKey(Customer, on_delete=models.SET_NULL, null=True, blank=True)
    sale_id = models.ForeignKey(Sale, on_delete=models.PROTECT, related_name='sale')
    discount_amount = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)

class Purcase(models.Model):
    id = models.CharField(max_length=10, primary_key=True)
    store = models.ForeignKey(Store, on_delete=models.PROTECT)
    invoice_number = models.CharField(max_length=50)
    transaction_date = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL,on_delete=models.PROTECT,  null=True, blank=True)
    customer = models.ForeignKey(Supplier, on_delete=models.SET_NULL, null=True, blank=True, related_name='customer_purchase')
    total_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    discount = models.IntegerField(default=0)
    promotion_code = models.ForeignKey(PromotionCode, on_delete=models.PROTECT)
    net_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    status = models.CharField(choices=[('Pending','Pending'),('Paid','Paid'),('Pending Delete','Pending Delete'),('Deleted','Deleted')], default='Paid')
    payment_method = models.CharField(max_length=50, choices=[('Cash', 'Cash'),('Bank Transfer', 'Bank Transfer'),('Cash On Delivery','Cash On Delivery')])
    deleted_at = models.DateTimeField(null=True, blank=True)
    instruction = models.CharField(blank=True, null=True,max_length=100)
    objects = SelectedStore()
    class Meta:
        ordering = ['invoice_number']
        get_latest_by = ['transaction_date']

    def save(self, *args, **kwargs):
        if not self.id: 
            if int(Purcase.objects.all().order_by('id').count())>0:
                data_last_id = Purcase.objects.all().order_by('transaction_date').last()
                last_id = re.split(r'(\d+)', str(data_last_id))
                id = int(last_id[1]) + 1
                self.id = f'{self.store.code}-P{id}'
                self.invoice_number = f'P{id}'
            else:
                id = 10000
                self.id = f'{self.store.code}-P{id}'
                self.invoice_number = f'P{id}'
        self.total_amount = self.items_purchase.aggregate(total=Sum('total_price'))['total'] or 0
        
        if self.payment_method == 'Cash On Delivery':
            self.status = 'Pending'
            
        self.net_amount = self.total_amount - (self.total_amount*Decimal(self.discount))/Decimal(100) - int(self.promotion_code.amount_discount)
        try:
            super().save(*args, **kwargs)
        except:
            pass

    def delete_custom(self):
        self.deleted_at = timezone.now()
        self.status = "Deleted"
        self.save()
        sale_item = PurchaseItem.objects.filter(purchase=self.id)
        for item in sale_item:
            item.delete_custom()
            InventoryAdjustment.objects.create(name=Inventory.objects.get(id=item.item_id), adjustment_type = 'Out', quantity = item.quantity, store=item.item.store, description = f'adjustment purchase item {item.item_id} delete purchase id {item.purchase}')
        
    def __str__(self):
        return str(self.invoice_number)

class PurchaseItem(models.Model):
    purchase = models.ForeignKey(Purcase, on_delete=models.CASCADE, related_name='items_purchase')
    item = models.ForeignKey(Inventory, on_delete=models.PROTECT)
    quantity = models.PositiveIntegerField()
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    deleted_at = models.DateTimeField(null=True, blank=True)
    class Meta:
        ordering = ['purchase']
    
    def save(self, *args, **kwargs):
        self.total_price = self.unit_price * self.quantity
        super().save(*args, **kwargs)
        Purcase.save(self.purchase)
            
    def delete_custom(self,*args, **kwargs ):
        self.deleted_at = timezone.now()
        self.save()

    def __str__(self):
        return str(self.purchase)

class UserProfile(models.Model):
    user = models.OneToOneField(User,on_delete=models.CASCADE, related_name='userprofile')
    store = models.ForeignKey(Store, on_delete=models.PROTECT, related_name='store')
    image_profile = models.ImageField(upload_to=user_profile_path, blank=True, null=True)
    gender = models.CharField(choices=[('Male','Male'),('Female','Female')])
    date_of_brith = models.DateField(blank=True, null=True)
    phone_number = models.CharField(max_length=10, blank=True, null=True)
    address = models.CharField(max_length=200, blank=True, null=True)
    created_on = models.DateTimeField(default=timezone.now())
    deleted_at = models.DateTimeField(null=True, blank=True)
    status = models.CharField(choices=[('Active','Active'),('Inactive','Inactive'),('Block','Block')], default='Active')
    group = models.ForeignKey(Group, on_delete=models.PROTECT, related_name='group')
    number_attempts = models.IntegerField(max_length=1, default=0)
    password_change_date = models.DateField(auto_now_add=True)
    objects = SelectedStore()
    all_objects = models.Manager()
    
    def __str__(self):
        return f'{self.user}'
    
    def delete_custom(self,*args, **kwargs ):
        self.deleted_at = timezone.now()
        self.status = 'Inactive'
        self.save()

class ExpanseCategory(models.Model):
    name = models.CharField(max_length=100)
    class Meta:
        ordering = ['name']
        constraints = [
            models.UniqueConstraint(
                Lower('name'), 
                name='unique_case_insensitive_name3'
            )
        ]

    def __str__(self):
        return f'{self.name}'
    
    def save(self, *args, **kwargs):
        self.name = self.name.lower()
        super().save(*args, **kwargs)

def referemce_photo_path(insteance,filename):
    ext = filename.split('.')[-1]
    new_filename = f'{insteance.description}.{ext}'
    return f'Reference Expanse/{new_filename}'

class ExpanseItem(models.Model):
    description = models.CharField(max_length=255)
    store = models.ForeignKey(Store, on_delete=models.PROTECT)
    category = models.ForeignKey(ExpanseCategory, on_delete=models.PROTECT, related_name='expanse_category')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    transaction_date = models.DateTimeField(auto_now_add=True)
    reference_photo = models.ImageField(upload_to=referemce_photo_path, blank=True, null=True)
    status = models.CharField(choices=[('Paid','Paid'),('Deleted','Deleted')], default='Paid')
    deleted_at = models.DateTimeField(null=True, blank=True)
    objects = SelectedStore()
    
    def __str__(self):
        return f'{self.description}'
    
    def delete(self,*args, **kwargs ):
        self.deleted_at = timezone.now()
        self.save()
