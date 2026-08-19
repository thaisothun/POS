from .models import Inventory, Category, Unit, Customer, InventoryAdjustment, Sale, Supplier, Purcase, ExpanseItem, ExpanseCategory, PromotionCode, UserProfile, Store
from django import forms
from django.contrib.auth.models import User, Group
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm, PasswordChangeForm

class InventoryForm(forms.ModelForm):
    class Meta:
        model = Inventory
        fields = ['name','store','category','description','photo','unit','size','price','cost','barcode_number','reorder_alert']

class CategoryForm(forms.ModelForm):
    class Meta:
        model = Category
        fields = ['name','top_ten_filter']

class UnitForm(forms.ModelForm):
    class Meta:
        model = Unit
        fields = ['name']

class CustomerForm(forms.ModelForm):
    class Meta:
        model = Customer
        fields = ['store','first_name','last_name','gender','address','phone_number1','phone_number2','e_mail','membership','note']

class InventoryAdjustmentForm(forms.ModelForm):
    class Meta:
        model = InventoryAdjustment
        fields = ['name','quantity','description','adjustment_type']

class SaleForm(forms.ModelForm):
    customer = forms.CharField(required=False)
    
    class Meta:
        model = Sale
        fields = ['customer','discount','promotion_code','payment_method','instruction','status','store','user']

    def clean_customer(self):
        data = self.cleaned_data.get('customer')
        if data == '':
            return None
        else:
            try:
                return Customer.objects.get(id=data)
            except:
                raise forms.ValidationError("Customer not found.")

class SupplierForm(forms.ModelForm):
    class Meta:
        model = Supplier
        fields = ['store','first_name','last_name','gender','address','phone_number1','phone_number2','e_mail','membership','note']        

class PurchaseForm(forms.ModelForm):
    customer = forms.CharField(required=False)
    class Meta:
        model = Purcase
        fields = ['customer','discount','promotion_code','payment_method','instruction','status','store','user']

    def clean_customer(self):
        data = self.cleaned_data.get('customer')
        print(data)
        if data == '':
            return None
        else:
            try:
                return Supplier.objects.get(id=data)
            except :
                raise forms.ValidationError("Supplier not found.")
        
class ExpanseForm(forms.ModelForm):
    class Meta:
        model = ExpanseItem
        fields = ['description','category','amount','store', 'reference_photo']

class ExpanseCategoryForm(forms.ModelForm):
    class Meta:
        model = ExpanseCategory
        fields = ['id','name']

class PromotionCodeForm(forms.ModelForm):
    class Meta:
        model = PromotionCode
        fields = ['name','amount_discount','max_uses','max_uses_per_user','start_date','end_date','store']
        widgets = {
            'start_date': forms.DateInput(attrs={
                'type': 'date', 
            }),
            'end_date': forms.DateInput(attrs={
                'type': 'date', 
            }),
        }

class UserForm(UserCreationForm):    
    class Meta:
        model = User
        fields = ['username','first_name','last_name','email', 'password1','password2']

class UserProfileForm(forms.ModelForm):
    class Meta:
        model = UserProfile
        fields = ['store','image_profile','gender', 'date_of_brith','phone_number', 'address', 'group','status']
        widgets = {
            'date_of_brith': forms.DateInput(
                attrs={
                    'type': 'date',
                })
            }

class UserUpdateForm(forms.ModelForm):
    class Meta:
        model = User
        fields = ['username','first_name','last_name','email']

class LoginForm(AuthenticationForm):
    username = forms.CharField(widget=forms.TextInput(attrs={'placeholder': 'Username','autocomplete': 'off'}))
    password = forms.CharField(widget=forms.PasswordInput(attrs={'placeholder': 'Password','autocomplete': 'off'}))

class StoreForm(forms.ModelForm):
    class Meta:
        model = Store
        fields = ['name','code','phone','address','logo','sale_target']

class CustomPasswordChangeForm(PasswordChangeForm):
    old_password = forms.CharField(widget=forms.PasswordInput(attrs={'placeholder': 'Old Password','autocomplete': 'off'}))
    new_password1 = forms.CharField(widget=forms.PasswordInput(attrs={'placeholder': 'New Password','autocomplete': 'off'}))
    new_password2 = forms.CharField(widget=forms.PasswordInput(attrs={'placeholder': 'Confirm Password','autocomplete': 'off'}))