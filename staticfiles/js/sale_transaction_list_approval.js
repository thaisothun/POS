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
        const response = await fetch(`/sale/sale-transaction/sale-transaction-list/filtter-date/approval/`, {
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
                const rowHTML = `<tr><td>${new Date(item.transaction_date).toLocaleString('en-us',option).replace(' at ', ', ')}</td><td>${item.store__name}</td><td>${item.invoice_number}</td><td>${item.user}</td><td>${item.full_name}</td><td>${item.total_amount}</td><td>${item.promotion_code__name}</td><td>${item.discount}</td><td>${item.net_amount}</td><td>${item.payment_method}</td><td>${item.status}</td><td style="white-space: nowrap;"><a title="Approved Delete ${item.invoice_number}" href="javascript:void(0)" id="print" onclick="show_div('wrapper_delete_item','${item.invoice_number}')"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M564-80 394-250l56-56 114 114 226-226 56 56L564-80ZM120-320l194-520h94l194 520h-92l-46-132H254l-46 132h-88Zm162-208h156l-76-216h-4l-76 216Z"/></svg></a>
                                <a title="Rejected Delete ${item.invoice_number}" id="delete" href="javascript:void(0)" onclick="show_div_invoice('wrapper_delete_reject','${item.invoice_number}')"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="m336-280 144-144 144 144 56-56-144-144 144-144-56-56-144 144-144-144-56 56 144 144-144 144 56 56ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg></a>
                                </tr>`;
                table_content.insertAdjacentHTML("beforeend", rowHTML);       
            }) 
            
        } catch (error) {
        console.error('Fetch error:', error);}
}

date_from.addEventListener('change', ()=>{
    const current_date = new Date(`${current_year}-${current_month}-${current_day}`);
    if (new Date(date_from.value) > current_date){
        Swal.fire({
            title: "Sale Transaction Filter",
            text: "Selected date can not after current date",
            icon: "error"
            });
            window.addEventListener('click', ()=>{
                    location.reload()
                } )
    } else{
        sale_transaction_filter_date()
    }
})

date_to.addEventListener('change', ()=>{
    const from_date_selected = new Date(date_from.value)
    if (new Date(date_to.value) < from_date_selected){
        Swal.fire({
            title: "Sale Transaction Filter",
            text: "Selected date can not before from date",
            icon: "error"
            });
            window.addEventListener('click', ()=>{
                    location.reload()
                } )
    } else{
    sale_transaction_filter_date()}
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
            const response = await fetch('/sale/sale-transaction/sale-transaction-list/sort/approval/', {
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
                const rowHTML = `<tr><td>${new Date(item.transaction_date).toLocaleString('en-us',option).replace(' at ', ', ')}</td><td>${item.store__name}</td><td>${item.invoice_number}</td><td>${item.user}</td><td>${item.full_name}</td><td>${item.total_amount}</td><td>${item.promotion_code__name}</td><td>${item.discount}</td><td>${item.net_amount}</td><td>${item.payment_method}</td><td>${item.status}</td><td style="white-space: nowrap;"><a title="Approved Delete ${item.invoice_number}" href="javascript:void(0)" id="print" onclick="show_div('wrapper_delete_item','${item.invoice_number}')"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M564-80 394-250l56-56 114 114 226-226 56 56L564-80ZM120-320l194-520h94l194 520h-92l-46-132H254l-46 132h-88Zm162-208h156l-76-216h-4l-76 216Z"/></svg></a>
                                <a title="Rejected Delete ${item.invoice_number}" id="delete" href="javascript:void(0)" onclick="show_div_invoice('wrapper_delete_reject','${item.invoice_number}')"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="m336-280 144-144 144 144 56-56-144-144 144-144-56-56-144 144-144-144-56 56 144 144-144 144 56 56ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg></a>
                                </tr>`;
                table_content.insertAdjacentHTML("beforeend", rowHTML); 
            })
                    
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
            const response = await fetch('/sale/sale-transaction/sale-transaction-list/search/approval/', {
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
                const rowHTML = `<tr><td>${new Date(item.transaction_date).toLocaleString('en-us',option).replace(' at ', ', ')}</td><td>${item.store__name}</td><td>${item.invoice_number}</td><td>${item.user}</td><td>${item.full_name}</td><td>${item.total_amount}</td><td>${item.promotion_code__name}</td><td>${item.discount}</td><td>${item.net_amount}</td><td>${item.payment_method}</td><td>${item.status}</td><td style="white-space: nowrap;"><a title="Approved Delete ${item.invoice_number}" href="javascript:void(0)" id="print" onclick="show_div('wrapper_delete_item','${item.invoice_number}')"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M564-80 394-250l56-56 114 114 226-226 56 56L564-80ZM120-320l194-520h94l194 520h-92l-46-132H254l-46 132h-88Zm162-208h156l-76-216h-4l-76 216Z"/></svg></a>
                                <a title="Rejected Delete ${item.invoice_number}" id="delete" href="javascript:void(0)" onclick="show_div_invoice('wrapper_delete_reject','${item.invoice_number}')"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="m336-280 144-144 144 144 56-56-144-144 144-144-56-56-144 144-144-144-56 56 144 144-144 144 56 56ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg></a>
                                </tr>`;
                table_content.insertAdjacentHTML("beforeend", rowHTML);
            })
                    
        } catch (error) {
            console.error('Fetch error:', error);
        }
    }
}

const search = document.getElementById('search_box')
search.addEventListener('input', (event)=>{
    sale_transaction('transaction_date')
})

const form_delete_invoice = document.querySelector('#form_delete_invoice')
form_delete_invoice.addEventListener('submit', async function(e){
    e.preventDefault();
    const item_id = document.getElementById('product_id')
    id = item_id.innerHTML
    try {
        const response = await fetch(`/sale/sale-transaction/sale-transaction-list/delete/approval/${id}/`, {
        method: 'POST',
        headers: {
            'X-CSRFToken': getCookie('csrftoken') // Embedded directly in a Django template
            },
        body: id
        });
        if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            if (data.message_sucess){
                Swal.fire({
                    title: "Delete Invoice",
                    text: data.message_sucess,
                    icon: "success"
                    });
                show_div('wrapper_delete_item')
                window.addEventListener('click', ()=>{
                    location.reload()
                } )
            }
            if (data.message_error){
                Swal.fire({
                    title: "Delete Invoice",
                    text: data.message_error,
                    icon: "error"
                    });
                show_div('wrapper_delete_item')
                window.addEventListener('click', ()=>{
                    location.reload()
                } )
            }
        } catch (error) {
        console.error('Fetch error:', error);}
    })

const form_delete_invoice_reject = document.querySelector('#form_delete_invoice_reject')
form_delete_invoice_reject.addEventListener('submit', async function(e){
    e.preventDefault();
    const item_id = document.getElementById('invoice_id')
    id = item_id.innerHTML
    try {
        const response = await fetch(`/sale/sale-transaction/sale-transaction-list/delete/reject/${id}/`, {
        method: 'POST',
        headers: {
            'X-CSRFToken': getCookie('csrftoken') // Embedded directly in a Django template
            },
        body: id
        });
        if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            if (data.message_sucess){
                Swal.fire({
                    title: "Delete Invoice",
                    text: data.message_sucess,
                    icon: "success"
                    });
                show_div('wrapper_delete_item')
                window.addEventListener('click', ()=>{
                    location.reload()
                } )
            }
            if (data.message_error){
                Swal.fire({
                    title: "Delete Invoice",
                    text: data.message_error,
                    icon: "error"
                    });
                show_div('wrapper_delete_item')
                window.addEventListener('click', ()=>{
                    location.reload()
                } )
            }
        } catch (error) {
        console.error('Fetch error:', error);}
    })