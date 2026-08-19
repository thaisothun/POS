from django.utils import timezone
from datetime import date
from .models import Inventory, Category, Unit, Customer, PromotionCode, Sale, SaleItem, Store, InventoryAdjustment, ExpanseItem
from datetime import timedelta
from django.db.models.functions import TruncDay, TruncMonth
from django.db.models.functions import Coalesce
from django.db.models import Sum, Value
from django.db.models import ExpressionWrapper, DecimalField, F
from decimal import Decimal
from itertools import chain

def get_daily_data(start_date, end_date, model):
    data_day = []
    i = start_date.day
    number_day = end_date.day
    while i <= number_day:
        data = model.objects.filter(status='Paid').filter(deleted_at__isnull=True).filter(transaction_date__year=end_date.year, transaction_date__month=end_date.month,transaction_date__day=i).aggregate(total=Coalesce(Sum('net_amount'), Value(0), output_field=DecimalField())) or 0
        if data['total'] == None:
            data_day.append({
               'day' : i,
               'total' : 0
            }) 
        else: 
            data_day.append({
           'day' : i,
           'total' : float(data['total'])})                
        i+=1                
    total = model.objects.filter(status='Paid').filter(deleted_at__isnull=True).filter(transaction_date__date__range=(start_date, end_date)).aggregate(total=Coalesce(Sum('net_amount'), Value(0), output_field=DecimalField())) or 0       
    return data_day, total

def get_trend_daily(day, model):
    end_date = timezone.now() - timedelta(days=1)
    start_date = end_date - timedelta(days=day) 
    data_day = []
    i = 1
    number_day = 7
    while i <= number_day:
        data = model.objects.filter(status='Paid').filter(deleted_at__isnull=True).filter(transaction_date__date = timezone.now() - timedelta(days=i)).aggregate(total=Coalesce(Sum('net_amount'), Value(0), output_field=DecimalField())) or 0
        if data['total'] == None:
            data_day.append({
               'day' : i,
               'total' : 0
            }) 
        else: 
            data_day.append({
           'day' : i,
           'total' : float(data['total'])})                
        i+=1                
    total = model.objects.filter(status='Paid').filter(deleted_at__isnull=True).filter(transaction_date__date__range=(start_date, end_date)).aggregate(total=Coalesce(Sum('net_amount'), Value(0), output_field=DecimalField())) or 0       
    return data_day, total

def get_weekly_data(start_date, end_date, model):
    data_week = []
    i = 1
    j=0
    number_day = end_date.day
    while j < number_day:     
        if start_date + timedelta(days=7) < end_date:
            data = model.objects.filter(status='Paid').filter(deleted_at__isnull=True).filter(transaction_date__date__range=(start_date, start_date + timedelta(days=7))).aggregate(total=Coalesce(Sum('net_amount'), Value(0), output_field=DecimalField())) 
            if data['total'] == None:
                data_week.append({
                    'week' : f'Week {i}',
                    'total' : 0
            }) 
            else: 
                data_week.append({
                    'week' : f'Week {i}',
                    'total' : float(data['total'])})            
            i+=1
            start_date = start_date + timedelta(days=7)
        else:
            data = model.objects.filter(status='Paid').filter(deleted_at__isnull=True).filter(transaction_date__date__range=(start_date, end_date)).aggregate(total=Coalesce(Sum('net_amount'), Value(0), output_field=DecimalField()))
            if data['total'] == None:
                data_week.append({
                    'week' : f'Week {i}',
                    'total' : 0
            }) 
            else: 
                data_week.append({
                    'week' : f'Week {i}',
                    'total' : float(data['total'])})            
            i+=1
        j+=7

    total = model.objects.filter(status='Paid').filter(deleted_at__isnull=True).filter(transaction_date__date__range=(start_date, end_date)).aggregate(total=Coalesce(Sum('net_amount'), Value(0), output_field=DecimalField()))       

    return data_week, total

def get_monthly_data(start_date, end_date, model):
    data_monthly = []
    month_list = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    number_month = end_date.month
    current_year = end_date.year
    i=1
    while i <= number_month:
        if start_date.month + 1 < number_month:
            data = model.objects.filter(status='Paid').filter(deleted_at__isnull=True).filter(transaction_date__year=current_year, transaction_date__month=i).aggregate(total=Coalesce(Sum('net_amount'), Value(0), output_field=DecimalField()))
            if data['total'] == None:
                data_monthly.append({
                    'month' : i,
                    'total' : 0
                })
            else:
                data_monthly.append({
                    'month' : month_list[i-1],
                    'total' : float(data['total'])
                })
        else:
            start_date = start_date.replace(month=i)
            data = model.objects.filter(status='Paid').filter(deleted_at__isnull=True).filter(transaction_date__date__range=(start_date, end_date)).aggregate(total=Coalesce(Sum('net_amount'), Value(0), output_field=DecimalField())) 
            if data['total'] == None:
                data_monthly.append({
                    'month' : i,
                    'total' : 0
                })
            else:
                data_monthly.append({
                    'month' : month_list[i-1],
                    'total' : float(data['total'])
                })
        i+=1        
    
    total = model.objects.filter(status='Paid').filter(deleted_at__isnull=True).filter(transaction_date__date__range=(start_date, end_date)).aggregate(total=Coalesce(Sum('net_amount'), Value(0), output_field=DecimalField()))       

    return data_monthly, total

def get_top_ten_data(start_date, end_date):
    items = InventoryAdjustment.objects.exclude(name__category__top_ten_filter='No').filter(type='Sale').filter(adjustment_type='Out').filter(transaction_date__date__range=(start_date,end_date)).values('name').annotate(total=Sum('quantity')).order_by('-total')[:10]
    id_list = []
    quantity = []
    for item in items:
        id_list.append(item['name'])
        quantity.append(item['total'])
    top_ten_items=[]
    for id in id_list:
        top_ten_items.append(list(Inventory.objects.values('name','photo','unit__name').filter(id=id)))
    i=0
    for lists in top_ten_items:
        for item in lists:
            item['quantity'] = quantity[i]
            item['range'] = i+1
            i+=1
    new_top_ten_items = list(chain.from_iterable(top_ten_items))    
    return new_top_ten_items

def get_top_ten_customer(start_date, end_date):
    customers = Sale.objects.filter(deleted_at__isnull=True).filter(transaction_date__date__range=(start_date, end_date)).filter(status='Paid').values('customer').annotate(total=Sum('total_amount')).exclude(customer=None).order_by('-total')[:10]
    top_ten_customer = list(customers.values('customer__first_name','customer__last_name','total'))
    i=1
    for item in top_ten_customer:
        item['range'] = i
        i+=1
    return top_ten_customer

def get_profit(start_date,end_date):
    sale_profit = Sale.objects.filter(deleted_at__isnull=True).filter(transaction_date__date__range=(start_date, end_date)).filter(status='Paid').annotate(total_sale=ExpressionWrapper(F('items_sale__unit_price')*F('items_sale__quantity'), output_field=DecimalField()), discount_amount = ExpressionWrapper(F('discount'),output_field=DecimalField()), promotion_amount = ExpressionWrapper(F('promotion_code__amount_discount'),output_field=DecimalField()), total_cost=ExpressionWrapper(F('items_sale__cost')*F('items_sale__quantity'), output_field=DecimalField())).annotate(net_profit=ExpressionWrapper(F('total_sale')*(1 - F('discount') / 100.0) - F('total_cost') - F('promotion_code__amount_discount'), output_field=DecimalField()))
    expanse = ExpanseItem.objects.filter(status='Paid').filter(transaction_date__date__range=(start_date, end_date)).aggregate(total_expanse=Sum('amount', default=0))
    if sale_profit:
        total = sale_profit.aggregate(sale=Sum(F('total_sale')), cost=Sum(F('total_cost')), discount=Sum(F('discount_amount')), promotion=Sum(F('promotion_amount')), profit = Sum(F('net_profit')))
        profit_data = {
            'sale' : total['sale'],
            'cost' : total['cost'],
            'discount' : total['discount'],
            'promotion' : total['promotion'],
            'profit' : total['profit'] - Decimal(expanse['total_expanse'])
        }
    else:
        profit_data = 0
    
    return profit_data