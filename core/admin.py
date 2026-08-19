from django.contrib import admin
from .models import Inventory, Store, Category, Unit, Customer, PromotionCode, Sale, SaleItem, Purcase, PurchaseItem, UserProfile, CustomerCredit, InventoryAdjustment, Supplier, ExpanseCategory, ExpanseItem, PromotionCodeUsage

admin.site.register(Store)
admin.site.register(Category)
admin.site.register(Unit)
admin.site.register(PromotionCode)
admin.site.register(UserProfile)
admin.site.register(CustomerCredit)
admin.site.register(ExpanseCategory)
admin.site.register(ExpanseItem)
admin.site.register(PromotionCodeUsage)

@admin.register(Inventory)
class InventoryAdmin(admin.ModelAdmin):
    readonly_fields = ('id', 'slug','quantity','barcode_image')

@admin.register(Supplier)
class InventoryAdmin(admin.ModelAdmin):
    readonly_fields = ('id',)

@admin.register(Customer)
class InventoryAdmin(admin.ModelAdmin):
    readonly_fields = ('id',)

@admin.register(Sale)
class InventoryAdmin(admin.ModelAdmin):
    readonly_fields = ('id', 'invoice_number', 'transaction_date','total_amount','net_amount' )

@admin.register(Purcase)
class InventoryAdmin(admin.ModelAdmin):
    readonly_fields = ('id', 'invoice_number', 'transaction_date','total_amount','net_amount' )

@admin.register(SaleItem)
class InventoryAdmin(admin.ModelAdmin):
    readonly_fields = ('total_price', )

@admin.register(PurchaseItem)
class InventoryAdmin(admin.ModelAdmin):
    readonly_fields = ('total_price', )

@admin.register(InventoryAdjustment)
class InventoryAdmin(admin.ModelAdmin):
    readonly_fields = ('name', )
