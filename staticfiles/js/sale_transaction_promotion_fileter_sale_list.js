localStorage.removeItem('cart');
const option = {
  year: 'numeric', 
  month: 'long', 
  day: 'numeric', 
  hour: 'numeric', 
  minute: 'numeric',   
};

const now = new Date()
const current_day = String(now.getDate()).padStart(2, '0');
const current_month = String(now.getMonth() + 1).padStart(2, '0');
const current_year = now.getFullYear()
const date_from = document.getElementById('date_from')
const date_to = document.getElementById('date_to')
date_from.value = `${current_year}-${current_month}-01`
date_to.value = `${current_year}-${current_month}-${current_day}`

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

async function sale_transaction_filter_date(){
    data_send = {date_from : date_from.value, date_to : date_to.value}
    try {
        const response = await fetch(`/sale/sale-transaction/sale-transaction-list/filtter-date/`, {
        method: 'POST',
        headers: {
            'X-CSRFToken': getCookie('csrftoken') // Embedded directly in a Django template
            },
        body: JSON.stringify(data_send)
        });
        if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            const table_content = document.getElementById('table_content')
            table_content.replaceChildren()     
            data.forEach(item=>{  
                const rowHTML = `<tr><td>${new Date(item.transaction_date).toLocaleString('en-us',option).replace(' at ', ', ')}</td><td>${item.store__name}</td><td>${item.invoice_number}</td><td>${item.user}</td><td>${item.full_name}</td><td>${item.total_amount}</td><td>${item.promotion_code__name}</td><td>${item.discount}</td><td>${item.net_amount}</td><td>${item.payment_method}</td><td>${item.status}</td>`
                table_content.insertAdjacentHTML("beforeend", rowHTML);}) 
        } catch (error) {
        console.error('Fetch error:', error);}
}

date_from.addEventListener('change', ()=>{
    const current_date = new Date(`${current_year}-${current_month}-${current_day}`);
    if (new Date(date_from.value) > current_date){
        Swal.fire({
            title: "Sale Transaction Filter",
            text: "Selected date must be before.",
            icon: "error"
            }); window.addEventListener('click', ()=>{location.reload()})
    } else{sale_transaction_filter_date()}
})

date_to.addEventListener('change', ()=>{
    const from_date_selected = new Date(date_from.value)
    if (new Date(date_to.value) < from_date_selected){
        Swal.fire({
            title: "Sale Transaction Filter",
            text: "Selected date must be after.",
            icon: "error"
            }); window.addEventListener('click', ()=>{location.reload()})
    } else{sale_transaction_filter_date()}
})

async function sale_transaction(data) {
    const search = document.getElementById('search_box')
    if (search.value == ''){
        const status = document.getElementById(data)
        status.classList.toggle('active')
        var ab = 0
        if (status.className==`${data} active`){
            ab = 1  }
        const data_send = {sortby: data, status: ab, date_from : date_from.value, date_to : date_to.value}
        try {
            const response = await fetch('/sale/sale-transaction/sale-transaction-list/sort/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken') // Embedded directly in a Django template
                },
            body: JSON.stringify(data_send)
            });
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            const table_content = document.getElementById('table_content')
            table_content.replaceChildren()     
            data.forEach(item=>{
                const rowHTML = `<tr><td>${new Date(item.transaction_date).toLocaleString('en-us',option).replace(' at ', ', ')}</td><td>${item.store__name}</td><td>${item.invoice_number}</td><td>${item.user}</td><td>${item.full_name}</td><td>${item.total_amount}</td><td>${item.promotion_code__name}</td><td>${item.discount}</td><td>${item.net_amount}</td><td>${item.payment_method}</td><td>${item.status}</td>`
                table_content.insertAdjacentHTML("beforeend", rowHTML);})         
        } catch (error) {
            console.error('Fetch error:', error);
        }
    } if (search.value){
        const status = document.getElementById(data)
        status.classList.toggle('active')
        var ab = 0
        if (status.className==`${data} active`){
            ab = 1  }
        const data_send = {search_text: search.value, status: ab, sortby: data,date_from : date_from.value, date_to : date_to.value}
        try {
            const response = await fetch('/sale/sale-transaction/sale-transaction-list/search/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken') // Embedded directly in a Django template
                },
            body: JSON.stringify(data_send)
            });
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            const table_content = document.getElementById('table_content')
            table_content.replaceChildren()     
            data.forEach(item=>{
                const rowHTML = `<tr><td>${new Date(item.transaction_date).toLocaleString('en-us',option).replace(' at ', ', ')}</td><td>${item.store__name}</td><td>${item.invoice_number}</td><td>${item.user}</td><td>${item.full_name}</td><td>${item.total_amount}</td><td>${item.promotion_code__name}</td><td>${item.discount}</td><td>${item.net_amount}</td><td>${item.payment_method}</td><td>${item.status}</td>`
                table_content.insertAdjacentHTML("beforeend", rowHTML);})        
        } catch (error) {
            console.error('Fetch error:', error);
        }
    }
}

const search = document.getElementById('search_box')
search.addEventListener('input', (event)=>{
    sale_transaction('transaction_date')
})
