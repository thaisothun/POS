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
                if(item.status == "Pending"){
                    const rowHTML = `<tr><td>${new Date(item.transaction_date).toLocaleString('en-us',option).replace(' at ', ', ')}</td><td>${item.store__name}</td><td>${item.invoice_number}</td><td>${item.user}</td><td>${item.full_name}</td><td>${item.total_amount}</td><td>${item.promotion_code__name}</td><td>${item.discount}</td><td>${item.net_amount}</td><td>${item.payment_method}</td><td>${item.status}</td><td style="white-space: nowrap;"><a title="Print ${item.invoice_number}" href="javascript:void(0)" id="print" onclick="send_get_data('${item.id}')"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#434343"><path d="M640-640v-120H320v120h-80v-200h480v200h-80Zm-480 80h640-640Zm560 100q17 0 28.5-11.5T760-500q0-17-11.5-28.5T720-540q-17 0-28.5 11.5T680-500q0 17 11.5 28.5T720-460Zm-80 260v-160H320v160h320Zm80 80H240v-160H80v-240q0-51 35-85.5t85-34.5h560q51 0 85.5 34.5T880-520v240H720v160Zm80-240v-160q0-17-11.5-28.5T760-560H200q-17 0-28.5 11.5T160-520v160h80v-80h480v80h80Z"/></svg></a>
                    <a title="Edit/Paid ${item.invoice_number}" href="javascript:void(0)" id="paid" onclick=" get_sale_transaction('wrapper_paid_invoice','${item.id}')" ><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M444-200h70v-50q50-9 86-39t36-89q0-42-24-77t-96-61q-60-20-83-35t-23-41q0-26 18.5-41t53.5-15q32 0 50 15.5t26 38.5l64-26q-11-35-40.5-61T516-710v-50h-70v50q-50 11-78 44t-28 74q0 47 27.5 76t86.5 50q63 23 87.5 41t24.5 47q0 33-23.5 48.5T486-314q-33 0-58.5-20.5T390-396l-66 26q14 48 43.5 77.5T444-252v52Zm36 120q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg></a>
                    <a title="Delete ${item.invoice_number}" href="javascript:void(0)" id="delete" onclick="show_div('wrapper_delete_item','${item.invoice_number}')" ><svg xmlns="http://www.w3.org/2000/svg" height="28px" viewBox="0 -960 960 960" width="28px" fill="black"><path d="m366-299.33 114-115.34 114.67 115.34 50-50.67-114-115.33 114-115.34-50-50.66L480-516 366-631.33l-50.67 50.66L430-465.33 315.33-350 366-299.33ZM267.33-120q-27 0-46.83-19.83-19.83-19.84-19.83-46.84V-740H160v-66.67h192V-840h256v33.33h192V-740h-40.67v553.33q0 27-19.83 46.84Q719.67-120 692.67-120H267.33Zm425.34-620H267.33v553.33h425.34V-740Zm-425.34 0v553.33V-740Z"/></svg></a></td></tr>`;
                    table_content.insertAdjacentHTML("beforeend", rowHTML);} 
                else{ 
                    const rowHTML = `<tr><td>${new Date(item.transaction_date).toLocaleString('en-us',option).replace(' at ', ', ')}</td><td>${item.store__name}</td><td>${item.invoice_number}</td><td>${item.user}</td><td>${item.full_name}</td><td>${item.total_amount}</td><td>${item.promotion_code__name}</td><td>${item.discount}</td><td>${item.net_amount}</td><td>${item.payment_method}</td><td>${item.status}</td><td><a title="Print ${item.invoice_number}" href="javascript:void(0)" id="print" onclick="send_get_data('${item.id}')"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#434343"><path d="M640-640v-120H320v120h-80v-200h480v200h-80Zm-480 80h640-640Zm560 100q17 0 28.5-11.5T760-500q0-17-11.5-28.5T720-540q-17 0-28.5 11.5T680-500q0 17 11.5 28.5T720-460Zm-80 260v-160H320v160h320Zm80 80H240v-160H80v-240q0-51 35-85.5t85-34.5h560q51 0 85.5 34.5T880-520v240H720v160Zm80-240v-160q0-17-11.5-28.5T760-560H200q-17 0-28.5 11.5T160-520v160h80v-80h480v80h80Z"/></svg></a><a title="Delete ${item.invoice_number}" href="javascript:void(0)" id="delete" onclick="show_div('wrapper_delete_item','${item.invoice_number}')" ><svg xmlns="http://www.w3.org/2000/svg" height="28px" viewBox="0 -960 960 960" width="28px" fill="black"><path d="m366-299.33 114-115.34 114.67 115.34 50-50.67-114-115.33 114-115.34-50-50.66L480-516 366-631.33l-50.67 50.66L430-465.33 315.33-350 366-299.33ZM267.33-120q-27 0-46.83-19.83-19.83-19.84-19.83-46.84V-740H160v-66.67h192V-840h256v33.33h192V-740h-40.67v553.33q0 27-19.83 46.84Q719.67-120 692.67-120H267.33Zm425.34-620H267.33v553.33h425.34V-740Zm-425.34 0v553.33V-740Z"/></svg></a></td></tr>`;
                    table_content.insertAdjacentHTML("beforeend", rowHTML); 
                    }    
            }) 
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
                if(item.status == "Pending"){
                    const rowHTML = `<tr><td>${new Date(item.transaction_date).toLocaleString('en-us',option).replace(' at ', ', ')}</td><td>${item.store__name}</td><td>${item.invoice_number}</td><td>${item.user}</td><td>${item.full_name}</td><td>${item.total_amount}</td><td>${item.promotion_code__name}</td><td>${item.discount}</td><td>${item.net_amount}</td><td>${item.payment_method}</td><td>${item.status}</td><td style="white-space: nowrap;"><a title="Print ${item.invoice_number}" href="javascript:void(0)" id="print" onclick="send_get_data('${item.id}')"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#434343"><path d="M640-640v-120H320v120h-80v-200h480v200h-80Zm-480 80h640-640Zm560 100q17 0 28.5-11.5T760-500q0-17-11.5-28.5T720-540q-17 0-28.5 11.5T680-500q0 17 11.5 28.5T720-460Zm-80 260v-160H320v160h320Zm80 80H240v-160H80v-240q0-51 35-85.5t85-34.5h560q51 0 85.5 34.5T880-520v240H720v160Zm80-240v-160q0-17-11.5-28.5T760-560H200q-17 0-28.5 11.5T160-520v160h80v-80h480v80h80Z"/></svg></a>
                    <a title="Edit/Paid ${item.invoice_number}" href="javascript:void(0)" id="paid" onclick=" get_sale_transaction('wrapper_paid_invoice','${item.id}')" ><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M444-200h70v-50q50-9 86-39t36-89q0-42-24-77t-96-61q-60-20-83-35t-23-41q0-26 18.5-41t53.5-15q32 0 50 15.5t26 38.5l64-26q-11-35-40.5-61T516-710v-50h-70v50q-50 11-78 44t-28 74q0 47 27.5 76t86.5 50q63 23 87.5 41t24.5 47q0 33-23.5 48.5T486-314q-33 0-58.5-20.5T390-396l-66 26q14 48 43.5 77.5T444-252v52Zm36 120q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg></a>
                    <a title="Delete ${item.invoice_number}" href="javascript:void(0)" id="delete" onclick="show_div('wrapper_delete_item','${item.invoice_number}')" ><svg xmlns="http://www.w3.org/2000/svg" height="28px" viewBox="0 -960 960 960" width="28px" fill="black"><path d="m366-299.33 114-115.34 114.67 115.34 50-50.67-114-115.33 114-115.34-50-50.66L480-516 366-631.33l-50.67 50.66L430-465.33 315.33-350 366-299.33ZM267.33-120q-27 0-46.83-19.83-19.83-19.84-19.83-46.84V-740H160v-66.67h192V-840h256v33.33h192V-740h-40.67v553.33q0 27-19.83 46.84Q719.67-120 692.67-120H267.33Zm425.34-620H267.33v553.33h425.34V-740Zm-425.34 0v553.33V-740Z"/></svg></a></td></tr>`;
                    table_content.insertAdjacentHTML("beforeend", rowHTML);} 
                else{ 
                    const rowHTML = `<tr><td>${new Date(item.transaction_date).toLocaleString('en-us',option).replace(' at ', ', ')}</td><td>${item.store__name}</td><td>${item.invoice_number}</td><td>${item.user}</td><td>${item.full_name}</td><td>${item.total_amount}</td><td>${item.promotion_code__name}</td><td>${item.discount}</td><td>${item.net_amount}</td><td>${item.payment_method}</td><td>${item.status}</td><td><a title="Print ${item.invoice_number}" href="javascript:void(0)" id="print" onclick="send_get_data('${item.id}')"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#434343"><path d="M640-640v-120H320v120h-80v-200h480v200h-80Zm-480 80h640-640Zm560 100q17 0 28.5-11.5T760-500q0-17-11.5-28.5T720-540q-17 0-28.5 11.5T680-500q0 17 11.5 28.5T720-460Zm-80 260v-160H320v160h320Zm80 80H240v-160H80v-240q0-51 35-85.5t85-34.5h560q51 0 85.5 34.5T880-520v240H720v160Zm80-240v-160q0-17-11.5-28.5T760-560H200q-17 0-28.5 11.5T160-520v160h80v-80h480v80h80Z"/></svg></a><a title="Delete ${item.invoice_number}" href="javascript:void(0)" id="delete" onclick="show_div('wrapper_delete_item','${item.invoice_number}')" ><svg xmlns="http://www.w3.org/2000/svg" height="28px" viewBox="0 -960 960 960" width="28px" fill="black"><path d="m366-299.33 114-115.34 114.67 115.34 50-50.67-114-115.33 114-115.34-50-50.66L480-516 366-631.33l-50.67 50.66L430-465.33 315.33-350 366-299.33ZM267.33-120q-27 0-46.83-19.83-19.83-19.84-19.83-46.84V-740H160v-66.67h192V-840h256v33.33h192V-740h-40.67v553.33q0 27-19.83 46.84Q719.67-120 692.67-120H267.33Zm425.34-620H267.33v553.33h425.34V-740Zm-425.34 0v553.33V-740Z"/></svg></a></td></tr>`;
                    table_content.insertAdjacentHTML("beforeend", rowHTML); 
                    }     
                
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
                if(item.status == "Pending"){
                    const rowHTML = `<tr><td>${new Date(item.transaction_date).toLocaleString('en-us',option).replace(' at ', ', ')}</td><td>${item.store__name}</td><td>${item.invoice_number}</td><td>${item.user}</td><td>${item.full_name}</td><td>${item.total_amount}</td><td>${item.promotion_code__name}</td><td>${item.discount}</td><td>${item.net_amount}</td><td>${item.payment_method}</td><td>${item.status}</td><td style="white-space: nowrap;"><a title="Print ${item.invoice_number}" href="javascript:void(0)" id="print" onclick="send_get_data('${item.id}')"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#434343"><path d="M640-640v-120H320v120h-80v-200h480v200h-80Zm-480 80h640-640Zm560 100q17 0 28.5-11.5T760-500q0-17-11.5-28.5T720-540q-17 0-28.5 11.5T680-500q0 17 11.5 28.5T720-460Zm-80 260v-160H320v160h320Zm80 80H240v-160H80v-240q0-51 35-85.5t85-34.5h560q51 0 85.5 34.5T880-520v240H720v160Zm80-240v-160q0-17-11.5-28.5T760-560H200q-17 0-28.5 11.5T160-520v160h80v-80h480v80h80Z"/></svg></a>
                    <a title="Edit/Paid ${item.invoice_number}" href="javascript:void(0)" id="paid" onclick=" get_sale_transaction('wrapper_paid_invoice','${item.id}')" ><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M444-200h70v-50q50-9 86-39t36-89q0-42-24-77t-96-61q-60-20-83-35t-23-41q0-26 18.5-41t53.5-15q32 0 50 15.5t26 38.5l64-26q-11-35-40.5-61T516-710v-50h-70v50q-50 11-78 44t-28 74q0 47 27.5 76t86.5 50q63 23 87.5 41t24.5 47q0 33-23.5 48.5T486-314q-33 0-58.5-20.5T390-396l-66 26q14 48 43.5 77.5T444-252v52Zm36 120q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg></a>
                    <a title="Delete ${item.invoice_number}" href="javascript:void(0)" id="delete" onclick="show_div('wrapper_delete_item','${item.invoice_number}')" ><svg xmlns="http://www.w3.org/2000/svg" height="28px" viewBox="0 -960 960 960" width="28px" fill="black"><path d="m366-299.33 114-115.34 114.67 115.34 50-50.67-114-115.33 114-115.34-50-50.66L480-516 366-631.33l-50.67 50.66L430-465.33 315.33-350 366-299.33ZM267.33-120q-27 0-46.83-19.83-19.83-19.84-19.83-46.84V-740H160v-66.67h192V-840h256v33.33h192V-740h-40.67v553.33q0 27-19.83 46.84Q719.67-120 692.67-120H267.33Zm425.34-620H267.33v553.33h425.34V-740Zm-425.34 0v553.33V-740Z"/></svg></a></td></tr>`;
                    table_content.insertAdjacentHTML("beforeend", rowHTML);} 
                else{ 
                    const rowHTML = `<tr><td>${new Date(item.transaction_date).toLocaleString('en-us',option).replace(' at ', ', ')}</td><td>${item.store__name}</td><td>${item.invoice_number}</td><td>${item.user}</td><td>${item.full_name}</td><td>${item.total_amount}</td><td>${item.promotion_code__name}</td><td>${item.discount}</td><td>${item.net_amount}</td><td>${item.payment_method}</td><td>${item.status}</td><td><a title="Print ${item.invoice_number}" href="javascript:void(0)" id="print" onclick="send_get_data('${item.id}')"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#434343"><path d="M640-640v-120H320v120h-80v-200h480v200h-80Zm-480 80h640-640Zm560 100q17 0 28.5-11.5T760-500q0-17-11.5-28.5T720-540q-17 0-28.5 11.5T680-500q0 17 11.5 28.5T720-460Zm-80 260v-160H320v160h320Zm80 80H240v-160H80v-240q0-51 35-85.5t85-34.5h560q51 0 85.5 34.5T880-520v240H720v160Zm80-240v-160q0-17-11.5-28.5T760-560H200q-17 0-28.5 11.5T160-520v160h80v-80h480v80h80Z"/></svg></a><a title="Delete ${item.invoice_number}" href="javascript:void(0)" id="delete" onclick="show_div('wrapper_delete_item','${item.invoice_number}')" ><svg xmlns="http://www.w3.org/2000/svg" height="28px" viewBox="0 -960 960 960" width="28px" fill="black"><path d="m366-299.33 114-115.34 114.67 115.34 50-50.67-114-115.33 114-115.34-50-50.66L480-516 366-631.33l-50.67 50.66L430-465.33 315.33-350 366-299.33ZM267.33-120q-27 0-46.83-19.83-19.83-19.84-19.83-46.84V-740H160v-66.67h192V-840h256v33.33h192V-740h-40.67v553.33q0 27-19.83 46.84Q719.67-120 692.67-120H267.33Zm425.34-620H267.33v553.33h425.34V-740Zm-425.34 0v553.33V-740Z"/></svg></a></td></tr>`;
                    table_content.insertAdjacentHTML("beforeend", rowHTML); 
                    }    
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

async function send_get_data(id) {
    const sale_receipt_div = document.getElementById('print_sale_receipt')
    sale_receipt_div.classList.toggle('show')
    const data_send = {id : id}
        try {
        const response = await fetch('/sale/sale-transaction/print-receipt/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken') // Embedded directly in a Django template
            },
        body: JSON.stringify(data_send)
        });
        
        if (!response.ok) throw new Error('Network response was not ok');
        
        const data = await response.json();
        data.sale_id.forEach((item)=>{
            document.getElementById('sale_receipt_id').innerHTML = `No. ${item.invoice_number}`
            document.getElementById('sale_receipt_date').innerHTML = new Date(item.transaction_date).toLocaleString('en-us',option).replace(' at ', ', ')
            document.getElementById('sale_receipt_store_logo').src = `/media/${item.store__logo}`
            document.getElementById('sale_receipt_store').innerHTML = item.store__name
            document.getElementById('sale_receipt_store_address').innerHTML = item.store__address
            document.getElementById('sale_receipt_customer').innerHTML = `${item?.customer__first_name} ${item?.customer__last_name}`
            document.getElementById('sale_receipt_customer_address').innerHTML = item?.customer__address
            if (item.customer__phone_number1){
            document.getElementById('sale_receipt_customer_phone').innerHTML = item.customer__phone_number1.match(/.{1,3}/g).join(' ')} else{document.getElementById('sale_receipt_customer_phone').innerHTML = ''}
            document.getElementById('sub_total_receipt').innerHTML = item.total_amount
            document.getElementById('promotion_code_amount_receipt').innerHTML = item.promotion_code__amount_discount
            document.getElementById('discount_amount_receipt').innerHTML = (item.discount * item.total_amount)/100
            document.getElementById('net_amount_receipt').innerHTML = item.net_amount
            document.getElementById('payment_method_receipt').innerHTML = item.payment_method
            document.getElementById('sale_receipt_instruction').innerHTML = item.instruction
        })
        const sale_receipt_item_print = document.getElementById('sale_receipt_print')
        sale_receipt_item_print.replaceChildren()
        data.sale_item.forEach((item)=>{
            rowHtml = `<tr><td style="padding: 0.5rem; border-bottom: none;">${item.quantity}</td><td style="padding: 0.5rem; border-bottom: none;">${item.item__name}</td><td style="padding: 0.5rem; border-bottom: none;">${item.unit_price}</td><td style="padding: 0.5rem; border-bottom: none;">${item.total_price}</td></tr>`
            sale_receipt_item_print.insertAdjacentHTML("beforeend", rowHtml);    
        })

        } catch (error) {
        console.error('Fetch error:', error);}
}

function print_sale_receipt() {
    window.print()
    const sale_receipt_div = document.getElementById('print_sale_receipt')
    sale_receipt_div.classList.toggle('show')
}
                    
const form_delete_invoice = document.querySelector('#form_delete_invoice')
form_delete_invoice.addEventListener('submit', async function(e){
    e.preventDefault();
    const item_id = document.getElementById('product_id')
    id = item_id.innerHTML
    try {
        const response = await fetch(`/sale/sale-transaction/sale-transaction-list/delete/${id}/`, {
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

async function payment_filter(payment_method){
    const data_send = {payment_method: payment_method, date_from : date_from.value, date_to : date_to.value}
    try {
    const response = await fetch(`/sale/sale-transaction/sale-transaction-list/filter/payment-method/`, {
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
                if(item.status == "Pending"){
                    const rowHTML = `<tr><td>${new Date(item.transaction_date).toLocaleString('en-us',option).replace(' at ', ', ')}</td><td>${item.store__name}</td><td>${item.invoice_number}</td><td>${item.user}</td><td>${item.full_name}</td><td>${item.total_amount}</td><td>${item.promotion_code__name}</td><td>${item.discount}</td><td>${item.net_amount}</td><td>${item.payment_method}</td><td>${item.status}</td><td style="white-space: nowrap;"><a title="Print ${item.invoice_number}" href="javascript:void(0)" id="print" onclick="send_get_data('${item.id}')"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#434343"><path d="M640-640v-120H320v120h-80v-200h480v200h-80Zm-480 80h640-640Zm560 100q17 0 28.5-11.5T760-500q0-17-11.5-28.5T720-540q-17 0-28.5 11.5T680-500q0 17 11.5 28.5T720-460Zm-80 260v-160H320v160h320Zm80 80H240v-160H80v-240q0-51 35-85.5t85-34.5h560q51 0 85.5 34.5T880-520v240H720v160Zm80-240v-160q0-17-11.5-28.5T760-560H200q-17 0-28.5 11.5T160-520v160h80v-80h480v80h80Z"/></svg></a>
                    <a title="Edit/Paid ${item.invoice_number}" href="javascript:void(0)" id="paid" onclick=" get_sale_transaction('wrapper_paid_invoice','${item.id}','1')" ><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M444-200h70v-50q50-9 86-39t36-89q0-42-24-77t-96-61q-60-20-83-35t-23-41q0-26 18.5-41t53.5-15q32 0 50 15.5t26 38.5l64-26q-11-35-40.5-61T516-710v-50h-70v50q-50 11-78 44t-28 74q0 47 27.5 76t86.5 50q63 23 87.5 41t24.5 47q0 33-23.5 48.5T486-314q-33 0-58.5-20.5T390-396l-66 26q14 48 43.5 77.5T444-252v52Zm36 120q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg></a>
                    <a title="Delete ${item.invoice_number}" href="javascript:void(0)" id="delete" onclick="show_div('wrapper_delete_item','${item.invoice_number}')" ><svg xmlns="http://www.w3.org/2000/svg" height="28px" viewBox="0 -960 960 960" width="28px" fill="black"><path d="m366-299.33 114-115.34 114.67 115.34 50-50.67-114-115.33 114-115.34-50-50.66L480-516 366-631.33l-50.67 50.66L430-465.33 315.33-350 366-299.33ZM267.33-120q-27 0-46.83-19.83-19.83-19.84-19.83-46.84V-740H160v-66.67h192V-840h256v33.33h192V-740h-40.67v553.33q0 27-19.83 46.84Q719.67-120 692.67-120H267.33Zm425.34-620H267.33v553.33h425.34V-740Zm-425.34 0v553.33V-740Z"/></svg></a></td></tr>`;
                    table_content.insertAdjacentHTML("beforeend", rowHTML);} 
                else{ 
                    const rowHTML = `<tr><td>${new Date(item.transaction_date).toLocaleString('en-us',option).replace(' at ', ', ')}</td><td>${item.store__name}</td><td>${item.invoice_number}</td><td>${item.user}</td><td>${item.full_name}</td><td>${item.total_amount}</td><td>${item.promotion_code__name}</td><td>${item.discount}</td><td>${item.net_amount}</td><td>${item.payment_method}</td><td>${item.status}</td><td><a title="Print ${item.invoice_number}" href="javascript:void(0)" id="print" onclick="send_get_data('${item.id}')"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#434343"><path d="M640-640v-120H320v120h-80v-200h480v200h-80Zm-480 80h640-640Zm560 100q17 0 28.5-11.5T760-500q0-17-11.5-28.5T720-540q-17 0-28.5 11.5T680-500q0 17 11.5 28.5T720-460Zm-80 260v-160H320v160h320Zm80 80H240v-160H80v-240q0-51 35-85.5t85-34.5h560q51 0 85.5 34.5T880-520v240H720v160Zm80-240v-160q0-17-11.5-28.5T760-560H200q-17 0-28.5 11.5T160-520v160h80v-80h480v80h80Z"/></svg></a><a title="Delete ${item.invoice_number}" href="javascript:void(0)" id="delete" onclick="show_div('wrapper_delete_item','${item.invoice_number}')" ><svg xmlns="http://www.w3.org/2000/svg" height="28px" viewBox="0 -960 960 960" width="28px" fill="black"><path d="m366-299.33 114-115.34 114.67 115.34 50-50.67-114-115.33 114-115.34-50-50.66L480-516 366-631.33l-50.67 50.66L430-465.33 315.33-350 366-299.33ZM267.33-120q-27 0-46.83-19.83-19.83-19.84-19.83-46.84V-740H160v-66.67h192V-840h256v33.33h192V-740h-40.67v553.33q0 27-19.83 46.84Q719.67-120 692.67-120H267.33Zm425.34-620H267.33v553.33h425.34V-740Zm-425.34 0v553.33V-740Z"/></svg></a></td></tr>`;
                    table_content.insertAdjacentHTML("beforeend", rowHTML); 
                    }       
            })

    } catch (error) {
        console.error('Fetch error:', error);}       
}

async function get_sale_transaction(div, id, payment_method_condition){
    show_div(div)
    try {
        const response = await fetch(`/sale/sale-transaction/sale-transaction-list/invoice/get/${id}/`, {
        method: 'POST',
        headers: {
            'X-CSRFToken': getCookie('csrftoken') // Embedded directly in a Django template
            },
        body : id
        });
        if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            data['sale_transaction'].forEach((item)=>{
            document.getElementById('invoice_number_edit').innerHTML = item.invoice_number
            document.getElementById('invoice_number_id_edit').innerHTML = item.id
            document.getElementById('customer_name').innerHTML = `Customer : ${item.customer__first_name} ${item.customer__last_name}`
            document.getElementById('promotion_code_edit').children[1].value = item.promotion_code
            document.getElementById('discount_edit').children[1].value = item.discount
            document.getElementById('payment_method_edit').children[1].value = item.payment_method
            document.getElementById('sub_total_edit').innerHTML = item.total_amount
            document.getElementById('promotion_code_amount_edit').innerHTML = item.promotion_code__amount_discount
            document.getElementById('discount_amount_edit').innerHTML = (item.total_amount * item.discount)/100
            document.getElementById('net_amount_edit').innerHTML = item.net_amount
            document.getElementById('payment_method_condition').value = payment_method_condition
                })
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const existingItem = cart.find(item => item.item_id === id);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
        data['sale_item'].forEach((item)=>{
            cart.push({ item_id: item.item__id, name: item.item__name, unit_price: item.unit_price, quantity: item.quantity, photo : item.item__photo_url});
            })
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        const item_cart = document.getElementById('cart_item')
            item_cart.replaceChildren()
            cart.forEach((item)=>{
                rowHtml_cart_item = `<tr><td><img style="width: 52px; height: 52px;" src='${item.photo}'</td><td>${item.name}</td><td><input id="${item.item_id}" style="width: 70px;" type="number" value="${item.unit_price}" onclick="modify_price('${item.item_id}')"></td><td onclick="decrease_item('${item.item_id}')"><svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#000000"><path d="M232-444v-72h496v72H232Z"/></svg></td><td style=" text-align: center;">${item.quantity}</td><td onclick="increase_item('${item.item_id}')"><svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#000000"><path d="M444-444H240v-72h204v-204h72v204h204v72H516v204h-72v-204Z"/></svg></td><td onclick="remove_item('${item.item_id}')"><svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#000000"><path d="M312-144q-29.7 0-50.85-21.15Q240-186.3 240-216v-480h-48v-72h192v-48h192v48h192v72h-48v479.57Q720-186 698.85-165T648-144H312Zm336-552H312v480h336v-480ZM384-288h72v-336h-72v336Zm120 0h72v-336h-72v336ZM312-696v480-480Z"/></svg></td></tr>`
                item_cart.insertAdjacentHTML("beforeend", rowHtml_cart_item);
            })
        } catch (error) {
        console.error('Fetch error:', error);}
}

function decrease_item(id){
    let cart = JSON.parse(localStorage.getItem('cart'))
    const existingItem = cart.find(item => item.item_id === id);
    if (existingItem) {
            if (existingItem.quantity>1)
            existingItem.quantity -= 1;
        }else{
            existingItem.quantity = 1
        }
    localStorage.setItem('cart', JSON.stringify(cart));
        const item_cart = document.getElementById('cart_item')
        item_cart.replaceChildren()
        cart.forEach((item)=>{
            rowHtml_cart_item = `<tr><td><img style="width: 52px; height: 52px;" src='${item.photo}'</td><td>${item.name}</td><td><input id="${item.item_id}" style="width: 70px;" type="number" value="${item.unit_price}" onclick="modify_price('${item.item_id}')"></td><td onclick="decrease_item('${item.item_id}')"><svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#000000"><path d="M232-444v-72h496v72H232Z"/></svg></td><td style=" text-align: center;">${item.quantity}</td><td onclick="increase_item('${item.item_id}')"><svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#000000"><path d="M444-444H240v-72h204v-204h72v204h204v72H516v204h-72v-204Z"/></svg></td><td onclick="remove_item('${item.item_id}')"><svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#000000"><path d="M312-144q-29.7 0-50.85-21.15Q240-186.3 240-216v-480h-48v-72h192v-48h192v48h192v72h-48v479.57Q720-186 698.85-165T648-144H312Zm336-552H312v480h336v-480ZM384-288h72v-336h-72v336Zm120 0h72v-336h-72v336ZM312-696v480-480Z"/></svg></td></tr>`
            item_cart.insertAdjacentHTML("beforeend", rowHtml_cart_item);
        })
        total()
        discount_amount()
        net_total()
       
}

function increase_item(id){
    let cart = JSON.parse(localStorage.getItem('cart'))
    const existingItem = cart.find(item => item.item_id === id);
    if (existingItem) {
        existingItem.quantity =  existingItem.quantity + 1;
        }
    localStorage.setItem('cart', JSON.stringify(cart));
        const item_cart = document.getElementById('cart_item')
        item_cart.replaceChildren()
        cart.forEach((item)=>{
            rowHtml_cart_item = `<tr><td><img style="width: 52px; height: 52px;" src='${item.photo}'</td><td>${item.name}</td><td><input id="${item.item_id}" style="width: 70px;" type="number" value="${item.unit_price}" onclick="modify_price('${item.item_id}')"></td><td onclick="decrease_item('${item.item_id}')"><svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#000000"><path d="M232-444v-72h496v72H232Z"/></svg></td><td style=" text-align: center;">${item.quantity}</td><td onclick="increase_item('${item.item_id}')"><svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#000000"><path d="M444-444H240v-72h204v-204h72v204h204v72H516v204h-72v-204Z"/></svg></td><td onclick="remove_item('${item.item_id}')"><svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#000000"><path d="M312-144q-29.7 0-50.85-21.15Q240-186.3 240-216v-480h-48v-72h192v-48h192v48h192v72h-48v479.57Q720-186 698.85-165T648-144H312Zm336-552H312v480h336v-480ZM384-288h72v-336h-72v336Zm120 0h72v-336h-72v336ZM312-696v480-480Z"/></svg></td></tr>`
            item_cart.insertAdjacentHTML("beforeend", rowHtml_cart_item);
        })
        total()
        discount_amount()
        net_total()
}

function remove_item(id){
    let cart = JSON.parse(localStorage.getItem('cart'))
    cart = cart.filter(item => item.item_id !== id);
    localStorage.setItem('cart', JSON.stringify(cart));
    const item_cart = document.getElementById('cart_item')
        item_cart.replaceChildren()
        cart.forEach((item)=>{
            rowHtml_cart_item = `<tr><td><img style="width: 52px; height: 52px;" src='${item.photo}'</td><td>${item.name}</td><td><input id="${item.item_id}" style="width: 70px;" type="number" value="${item.unit_price}" onclick="modify_price('${item.item_id}')"></td><td onclick="decrease_item('${item.item_id}')"><svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#000000"><path d="M232-444v-72h496v72H232Z"/></svg></td><td style=" text-align: center;">${item.quantity}</td><td onclick="increase_item('${item.item_id}')"><svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#000000"><path d="M444-444H240v-72h204v-204h72v204h204v72H516v204h-72v-204Z"/></svg></td><td onclick="remove_item('${item.item_id}')"><svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#000000"><path d="M312-144q-29.7 0-50.85-21.15Q240-186.3 240-216v-480h-48v-72h192v-48h192v48h192v72h-48v479.57Q720-186 698.85-165T648-144H312Zm336-552H312v480h336v-480ZM384-288h72v-336h-72v336Zm120 0h72v-336h-72v336ZM312-696v480-480Z"/></svg></td></tr>`
            item_cart.insertAdjacentHTML("beforeend", rowHtml_cart_item);
        })
        total()
        discount_amount()
        net_total()
}

function total(){
    let cart = JSON.parse(localStorage.getItem('cart'))
    const totalAmount = cart.reduce((accumulator, item) => {
    return accumulator + (parseFloat(item.unit_price) * parseInt(item.quantity));
    }, 0);
    const sub_total = document.getElementById('sub_total_edit')
    sub_total.innerHTML = totalAmount.toFixed(2)
}

function discount_amount(){
    const discount_ele = document.getElementById('discount_amount_edit')
    const sub_total = document.getElementById('sub_total_edit').innerHTML
    const discount_amount = (sub_total * document.getElementById('discount_edit').children[1].value)/100
    discount_ele.innerHTML = discount_amount.toFixed(2)
    net_total()
}

function net_total(){
    const sub_total = document.getElementById('sub_total_edit')
    const promotion_code_amount = document.getElementById('promotion_code_amount_edit')
    const discount_ele = document.getElementById('discount_amount_edit')
    const net_total = sub_total.innerHTML - promotion_code_amount.innerHTML - discount_ele.innerHTML
    const net_total_ele = document.getElementById('net_amount_edit')
    net_total_ele.innerHTML = net_total.toFixed(2)
}

const discount = document.getElementById('discount_edit')
discount.children[1].addEventListener('focusout', ()=>{
    discount_amount()})

const promotion_code = document.getElementById('promotion_code_edit')
promotion_code.children[1].addEventListener('change', (item)=>{
    data_send = {id : promotion_code.children[1].value}
    async function send_get_data() {
        try {
            const response = await fetch('/sale/sale-transaction/get-promotion-code/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken') // Embedded directly in a Django template
                },
            body: JSON.stringify(data_send)
            });
            
            if (!response.ok) throw new Error('Network response was not ok');
            
            const data = await response.json();
            data.forEach((item)=>{
                const promotion_code_amount = document.getElementById('promotion_code_amount_edit')
                promotion_code_amount.innerHTML = item.amount_discount
            }) 
            discount_amount()
            net_total()
            } catch (error) {
            console.error('Fetch error:', error);}
        } 
        send_get_data()  
    })

function modify_price(item_id){
    const input_modify_price = document.getElementById(item_id)
    input_modify_price.addEventListener('focusout', ()=>{
        
        let cart = JSON.parse(localStorage.getItem('cart'))
    const existingItem = cart.find(item => item.item_id === item_id);
    if (existingItem) {
        existingItem.unit_price = Number(input_modify_price.value).toFixed(2);
        }
    localStorage.setItem('cart', JSON.stringify(cart));
    console.log(cart)    
    const item_cart = document.getElementById('cart_item')
        item_cart.replaceChildren()
        cart.forEach((item)=>{
            rowHtml_cart_item = `<tr><td><img style="width: 52px; height: 52px;" src='${item.photo}'</td><td>${item.name}</td><td><input id="${item.item_id}" style="width: 70px;" type="number" value="${item.unit_price}" onclick="modify_price('${item.item_id}')"></td><td onclick="decrease_item('${item.item_id}')"><svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#000000"><path d="M232-444v-72h496v72H232Z"/></svg></td><td style=" text-align: center;">${item.quantity}</td><td onclick="increase_item('${item.item_id}')"><svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#000000"><path d="M444-444H240v-72h204v-204h72v204h204v72H516v204h-72v-204Z"/></svg></td><td onclick="remove_item('${item.item_id}')"><svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#000000"><path d="M312-144q-29.7 0-50.85-21.15Q240-186.3 240-216v-480h-48v-72h192v-48h192v48h192v72h-48v479.57Q720-186 698.85-165T648-144H312Zm336-552H312v480h336v-480ZM384-288h72v-336h-72v336Zm120 0h72v-336h-72v336ZM312-696v480-480Z"/></svg></td></tr>`
            item_cart.insertAdjacentHTML("beforeend", rowHtml_cart_item);
        })
        const item_div = document.querySelectorAll('.item-card')
        const cart_el = document.getElementById('cart_save_item')
        cart_el.value = JSON.stringify(cart)
        total()
        discount_amount()
        net_total()
    })
        
}

const item_div = document.querySelectorAll('.item-card')
item_div.forEach((item)=>{
    item.addEventListener('click', (e)=>{
        let price = item.getElementsByTagName('p')[0].innerHTML
        let id = item.getElementsByTagName('p')[1].innerHTML
        let name = item.getElementsByTagName('p')[2].innerHTML
        let cost = item.getElementsByTagName('p')[3].innerHTML
        let photo = item.getElementsByTagName('img')[0].src
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const existingItem = cart.find(item => item.item_id === id);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
        cart.push({ item_id: id, name: name, unit_price: price, quantity: 1, photo : photo, cost : cost });
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        const item_cart = document.getElementById('cart_item')
        item_cart.replaceChildren()
        cart.forEach((item)=>{
            rowHtml_cart_item = `<tr><td><img style="width: 52px; height: 52px;" src='${item.photo}'</td><td>${item.name}</td><td><input id="${item.item_id}" style="width: 70px;" type="number" value="${item.unit_price}" onclick="modify_price('${item.item_id}')"></td><td onclick="decrease_item('${item.item_id}')"><svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#000000"><path d="M232-444v-72h496v72H232Z"/></svg></td><td style=" text-align: center;">${item.quantity}</td><td onclick="increase_item('${item.item_id}')"><svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#000000"><path d="M444-444H240v-72h204v-204h72v204h204v72H516v204h-72v-204Z"/></svg></td><td onclick="remove_item('${item.item_id}')"><svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#000000"><path d="M312-144q-29.7 0-50.85-21.15Q240-186.3 240-216v-480h-48v-72h192v-48h192v48h192v72h-48v479.57Q720-186 698.85-165T648-144H312Zm336-552H312v480h336v-480ZM384-288h72v-336h-72v336Zm120 0h72v-336h-72v336ZM312-696v480-480Z"/></svg></td></tr>`
            item_cart.insertAdjacentHTML("beforeend", rowHtml_cart_item);
        })
        const item_div = document.querySelectorAll('.item-card')
        const cart_el = document.getElementById('cart_save_item')
        cart_el.value = JSON.stringify(cart)
        total()
        discount_amount()
        net_total()
        show_div('wrapper_paid_invoice_add')
    })
    
})

const category_div = document.querySelectorAll('.category')
category_div.forEach((item)=>{
    item.addEventListener('click', (e)=>{
        const search_box1 = document.getElementById('search_box')
        search_box1.value = ""
        active_class = document.querySelectorAll('.active')
        active_class.forEach((item)=>{
            item.classList.remove('active')
        })
        item.classList.add('active')
        data_send = {category : item.children[0].innerHTML}
        
        async function send_get_data() {
        try {
            const response = await fetch('/sale/sale-transaction/get-item-category/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken') // Embedded directly in a Django template
                },
            body: JSON.stringify(data_send)
            });
            
            if (!response.ok) throw new Error('Network response was not ok');
            
            const data = await response.json();
            const item_content = document.getElementById('wrapper_item-card')
            item_content.replaceChildren()     
            data.forEach(item=>{
                rowHtml_item =  `<div class="item-card id="item-card">
                            <div class="content">
                                <p style="position: absolute; padding: 0.5rem; font-size: 1rem; font-weight: 600; ">${item.price}</p>
                                <div style="width: 120px; height: 120px; object-fit: cover;"><img style="width: 100%; height: 100%; border-top-left-radius:10px; border-top-right-radius: 10px;" src="/media/${item.photo}" alt="photo item"></div>    
                            <div style="padding: 0.5rem;">
                            <p>${item.id}</p>
                            <p>${item.name}</p>
                            <p style="display: none;">${item.cost}</p>
                            </div>
                            </div>
                            </div>`
                item_content.insertAdjacentHTML("beforeend", rowHtml_item);
            })
            const item_div = document.querySelectorAll('.item-card')
            item_div.forEach((item)=>{
                item.addEventListener('click', (e)=>{
                    let price = item.getElementsByTagName('p')[0].innerHTML
                    let id = item.getElementsByTagName('p')[1].innerHTML
                    let name = item.getElementsByTagName('p')[2].innerHTML
                    let cost = item.getElementsByTagName('p')[3].innerHTML
                    let photo = item.getElementsByTagName('img')[0].src
                    let cart = JSON.parse(localStorage.getItem('cart')) || [];
                    const existingItem = cart.find(item => item.item_id === id);
                    if (existingItem) {
                        existingItem.quantity += 1;
                    } else {
                    cart.push({ item_id: id, name: name, unit_price: price, quantity: 1, photo : photo, cost : cost });
                    }
                    localStorage.setItem('cart', JSON.stringify(cart));
                    const item_cart = document.getElementById('cart_item')
                    item_cart.replaceChildren()
                    cart.forEach((item)=>{
                        rowHtml_cart_item = `<tr><td><img style="width: 52px; height: 52px;" src='${item.photo}'</td><td>${item.name}</td><td><input id="${item.item_id}" style="width: 70px;" type="number" value="${item.unit_price}" onclick="modify_price('${item.item_id}')"></td><td onclick="decrease_item('${item.item_id}')"><svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#000000"><path d="M232-444v-72h496v72H232Z"/></svg></td><td style=" text-align: center;">${item.quantity}</td><td onclick="increase_item('${item.item_id}')"><svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#000000"><path d="M444-444H240v-72h204v-204h72v204h204v72H516v204h-72v-204Z"/></svg></td><td onclick="remove_item('${item.item_id}')"><svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#000000"><path d="M312-144q-29.7 0-50.85-21.15Q240-186.3 240-216v-480h-48v-72h192v-48h192v48h192v72h-48v479.57Q720-186 698.85-165T648-144H312Zm336-552H312v480h336v-480ZM384-288h72v-336h-72v336Zm120 0h72v-336h-72v336ZM312-696v480-480Z"/></svg></td></tr>`
                        item_cart.insertAdjacentHTML("beforeend", rowHtml_cart_item);
                    })
                    const item_div = document.querySelectorAll('.item-card')
                    const cart_el = document.getElementById('cart_save_item')
                    cart_el.value = JSON.stringify(cart)
                    total()
                    discount_amount()
                    net_total()
    })    
})
                    
        } catch (error) {
            console.error('Fetch error:', error);}
        }
        send_get_data()
        

    })
})

const search_box = document.getElementById('search_box_item')
search_box.addEventListener('input', ()=>{
const class_active = document.querySelectorAll('.active')
class_active.forEach((item)=>{
    data_send = {search_text : search_box.value, category : item.children[0].innerHTML}
    async function send_get_data() {
        try {
            const response = await fetch('/sale/sale-transaction/search/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken') // Embedded directly in a Django template
                },
            body: JSON.stringify(data_send)
            });
            
            if (!response.ok) throw new Error('Network response was not ok');
            
            const data = await response.json();
            const item_content = document.getElementById('wrapper_item-card')
            item_content.replaceChildren()     
            data.forEach(item=>{
                rowHtml_item =  `<div class="item-card id="item-card">
                            <div class="content">
                                <p style="position: absolute; padding: 0.5rem; font-size: 1rem; font-weight: 600; ">${item.price}</p>
                                <div style="width: 120px; height: 120px; object-fit: cover;"><img style="width: 100%; height: 100%; border-top-left-radius:10px; border-top-right-radius: 10px;" src="/media/${item.photo}" alt="photo item"></div>    
                            <div style="padding: 0.5rem;">
                            <p>${item.id}</p>
                            <p>${item.name}</p>
                            <p style="display: none;">${item.cost}</p>
                            </div>
                            </div>
                            </div>`
                item_content.insertAdjacentHTML("beforeend", rowHtml_item);
            })
            const item_div = document.querySelectorAll('.item-card')
            item_div.forEach((item)=>{
                item.addEventListener('click', (e)=>{
                    console.log(item)
                    let price = item.getElementsByTagName('p')[0].innerHTML
                    let id = item.getElementsByTagName('p')[1].innerHTML
                    let name = item.getElementsByTagName('p')[2].innerHTML
                    let cost = item.getElementsByTagName('p')[3].innerHTML
                    let photo = item.getElementsByTagName('img')[0].src
                    let cart = JSON.parse(localStorage.getItem('cart')) || [];
                    const existingItem = cart.find(item => item.item_id === id);
                    if (existingItem) {
                        existingItem.quantity += 1;
                    } else {
                    cart.push({ item_id: id, name: name, unit_price: price, quantity: 1, photo : photo, cost : cost });
                    }
                    localStorage.setItem('cart', JSON.stringify(cart));
                    const item_cart = document.getElementById('cart_item')
                    item_cart.replaceChildren()
                    cart.forEach((item)=>{
                        rowHtml_cart_item = `<tr><td><img style="width: 52px; height: 52px;" src='${item.photo}'</td><td>${item.name}</td><td><input id="${item.item_id}" style="width: 70px;" type="number" value="${item.unit_price}" onclick="modify_price('${item.item_id}')"></td><td onclick="decrease_item('${item.item_id}')"><svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#000000"><path d="M232-444v-72h496v72H232Z"/></svg></td><td style=" text-align: center;">${item.quantity}</td><td onclick="increase_item('${item.item_id}')"><svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#000000"><path d="M444-444H240v-72h204v-204h72v204h204v72H516v204h-72v-204Z"/></svg></td><td onclick="remove_item('${item.item_id}')"><svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#000000"><path d="M312-144q-29.7 0-50.85-21.15Q240-186.3 240-216v-480h-48v-72h192v-48h192v48h192v72h-48v479.57Q720-186 698.85-165T648-144H312Zm336-552H312v480h336v-480ZM384-288h72v-336h-72v336Zm120 0h72v-336h-72v336ZM312-696v480-480Z"/></svg></td></tr>`
                        item_cart.insertAdjacentHTML("beforeend", rowHtml_cart_item);
                    })
                    const item_div = document.querySelectorAll('.item-card')
                    const cart_el = document.getElementById('cart_save_item')
                    cart_el.value = JSON.stringify(cart)
                    total()
                    discount_amount()
                    net_total()
    })
    
})

            } catch (error) {
            

            console.error('Fetch error:', error);}
        }
        send_get_data()
})
    
})

async function save_sale_transaction(){
    let cart = JSON.parse(localStorage.getItem('cart'))
    const promotion_code = document.getElementById('promotion_code_edit').children[1].value
    const discount = document.getElementById('discount_edit').children[1].value
    const payment_method = document.getElementById('payment_method_edit').children[1].value
    const invoice_number = document.getElementById('invoice_number_edit').innerHTML
    const invoice_number_id = document.getElementById('invoice_number_id_edit').innerHTML
    const data_send = {cart : cart, promotion_code :promotion_code, discount:discount, payment_method: payment_method, invoice_number:invoice_number, invoice_number_id : invoice_number_id}
    document.getElementById('loader_container').classList.remove('hide')
    try {
        const response = await fetch('/sale/sale-transaction/sale-transaction-list/invoice/save/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken') // Embedded directly in a Django template
            },
        body: JSON.stringify(data_send)
        });
        
        if (!response.ok) throw new Error('Network response was not ok');
        
        const data = await response.json();
        if (data.message_sucess){
                Swal.fire({
                    title: "Modify Invoice",
                    text: data.message_sucess,
                    icon: "success"
                    });
                    show_div_clear_cart('wrapper_paid_invoice')
                window.addEventListener('click', ()=>{
                    if(document.getElementById('payment_method_condition').value==1){
                        payment_filter('Cash On Delivery')    
                    } else{
                        location.reload()
                    }
                } )
            }
            if (data.message_error){
                Swal.fire({
                    title: "Modify Invoice",
                    text: data.message_error,
                    icon: "error"
                    });
            }
    
    } catch (error) {     
        console.error('Fetch error:', error);}
    
    finally{
        document.getElementById('loader_container').classList.add('hide')
    }      
}

async function paid_sale_transaction() {
    const payment_method = document.getElementById('payment_method_edit')
    if(payment_method.children[1].value == 'Cash On Delivery'){
        Swal.fire({
                    title: "Paid Invoice",
                    text: 'Please select payment method under Cash or Bank Transer',
                    icon: "error"
                    });            
    } else{
        let cart = JSON.parse(localStorage.getItem('cart'))
    const promotion_code = document.getElementById('promotion_code_edit').children[1].value
    const discount = document.getElementById('discount_edit').children[1].value
    const payment_method = document.getElementById('payment_method_edit').children[1].value
    const invoice_number = document.getElementById('invoice_number_edit').innerHTML
    const invoice_number_id = document.getElementById('invoice_number_id_edit').innerHTML
    const data_send = {cart : cart, promotion_code :promotion_code, discount:discount, payment_method: payment_method, invoice_number:invoice_number, invoice_number_id : invoice_number_id}
    document.getElementById('loader_container').classList.remove('hide')
    try {
        const response = await fetch('/sale/sale-transaction/sale-transaction-list/invoice/paid/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken') // Embedded directly in a Django template
            },
        body: JSON.stringify(data_send)
        });
        
        if (!response.ok) throw new Error('Network response was not ok');
        
        const data = await response.json();
       if (data.message_sucess){
                Swal.fire({
                    title: "Modify Invoice",
                    text: data.message_sucess,
                    icon: "success"
                    });
                    show_div_clear_cart('wrapper_paid_invoice')
                window.addEventListener('click', ()=>{
                    if(document.getElementById('payment_method_condition').value==1){
                        payment_filter('Cash On Delivery')    
                    } else{
                        location.reload()
                    }
                } )
            }
            if (data.message_error){
                Swal.fire({
                    title: "Modify Invoice",
                    text: data.message_error,
                    icon: "error"
                    });
            }
    
    } catch (error) {     
        console.error('Fetch error:', error);}    
    finally{
        document.getElementById('loader_container').classList.add('hide')
    }    
    }
}