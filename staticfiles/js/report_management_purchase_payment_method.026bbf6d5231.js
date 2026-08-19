const option = {
  year: 'numeric', 
  month: 'long', 
  day: 'numeric', 
  hour: 'numeric', 
  minute: 'numeric',   
};

const formatter = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
});

const now = new Date()
const current_day = String(now.getDate()).padStart(2, '0');
const current_month = String(now.getMonth() + 1).padStart(2, '0');
const current_year = now.getFullYear()
const start_date = document.getElementById('start_date')
const end_date = document.getElementById('end_date')
start_date.value = `${current_year}-${current_month}-01`
end_date.value = `${current_year}-${current_month}-${current_day}`

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

start_date.addEventListener('change', ()=>{
    console.log('ok')
    const current_date = new Date(`${current_year}-${current_month}-${current_day}`);
    if (new Date(start_date.value) > current_date){
        Swal.fire({
            title: "Purchase Report By Payment Method",
            text: "Selected date can not after current date!",
            icon: "error"
            });
            window.addEventListener('click', ()=>{
                    location.reload()
                } )
    }})

end_date.addEventListener('change', ()=>{
    const from_date_selected = new Date(start_date.value)
    if (new Date(end_date.value) < from_date_selected){
        Swal.fire({
            title: "Purchase Report By Payment Method",
            text: "Selected date can not before start date!",
            icon: "error"
            });
            window.addEventListener('click', ()=>{
                    location.reload()
                } )
    }})

async function sale_transaction_report(start_date, end_date, path){
    const payment_method = document.getElementById('selection').children[1].value
    if(!payment_method){
         Swal.fire({
            title: "Purchase Report By Payment Method",
            text: "Payment method can not be blanked!",
            icon: "error"
            });
            return
        }
    document.getElementById('from_date').innerHTML = start_date.value
    document.getElementById('to_date').innerHTML = end_date.value
    data_send = {start_date : start_date.value, end_date : end_date.value, payment_method:payment_method}
    try {
        const response = await fetch(path, {
        method: 'POST',
        headers: {
            'X-CSRFToken': getCookie('csrftoken') // Embedded directly in a Django template
            },
        body: JSON.stringify(data_send)
        });
        if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            const table_content = document.getElementById('table_content')
            if (data['message']){
                Swal.fire({
                title: "Purchase Report By Payment Mehtod",
                text: data['message'],
                icon: "error"
                });
                table_content.replaceChildren()
                return
            } else{
            table_content.replaceChildren()
            data['store'].forEach(store=>{
                data['sale_transactions'].forEach(item=>{  
                if(item.store__name == store){
                const rowHTML = `<tr><td>${new Date(item.transaction_date).toLocaleString('en-us',option).replace(' at ', ', ')}</td><td>${item.store__name}</td><td>${item.invoice_number}</td><td>${item.user__username}</td><td>${item.full_name}</td><td>${item.total_amount}</td><td>${item.promotion_code__name}</td><td>${item.discount}</td><td>${item.net_amount}</td><td>${item.payment_method}</td><td>${item.status}</td><tr>`
                table_content.insertAdjacentHTML("beforeend", rowHTML)}
                })
                data['sub_total'].forEach(item=>{
                    if (item.store__name == store){
                    const rowHTML1 = `<tr><td></td><td></td><td></td><td></td><td>Total</td><td>${formatter.format(item.total_sale)}</td><td>${formatter.format(item.total_promotion_code)}</td><td>${formatter.format(item.total_discount)}</td><td>${formatter.format(item.total_net_sale)}</td><td></td><td></td><tr>`    
                    table_content.lastElementChild.insertAdjacentHTML("afterend", rowHTML1)}
                })
            })
            }
        } catch (error) {
        console.error('Fetch error:', error);}
}

async function sale_transaction_report_excel(start_date, end_date, path){
    const payment_method = document.getElementById('selection').children[1].value
    const table_content = document.getElementById('table_content')
    if (!table_content || table_content.rows.length == 0){
        Swal.fire({
            title: "Purchase Report By Payment Mehtod",
            text: "Please click generate report first!",
            icon: "error"
            });
            return
        }
    if(!payment_method){
        Swal.fire({
            title: "Purchase Report By Payment Mehtod",
            text: "Payment method can not be blanked!",
            icon: "error"
            });
            return
        }
    data_send = {start_date : start_date.value, end_date : end_date.value, payment_method:payment_method}
    document.getElementById('from_date').innerHTML = start_date.value
    document.getElementById('to_date').innerHTML = end_date.value
    try {
        const response = await fetch(path, {
        method: 'POST',
        headers: {
            'X-CSRFToken': getCookie('csrftoken') // Embedded directly in a Django template
            },
        body: JSON.stringify(data_send)
        });
        if (!response.ok) throw new Error('Network response was not ok');
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `purchase_report_by_payment_method_${now.toLocaleString()}.xlsx`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        } catch (error) {
        console.error('Fetch error:', error);}
}

document.getElementById('generate').addEventListener('click', ()=>{
    sale_transaction_report(start_date, end_date, '/report_management/generate-report/purchase-by-payment-method/generate/')})

document.getElementById('excel').addEventListener('click', ()=>{
    sale_transaction_report_excel(start_date, end_date, '/report_management/generate-report/purchase-by-payment-method/excel/')})



