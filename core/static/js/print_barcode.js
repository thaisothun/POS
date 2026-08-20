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

async function print_barcode(data) {
    const search = document.getElementById('search_box')
    if (search.value == ''){
        const status = document.getElementById(data)
        status.classList.toggle('active')
        var ab = 0
        if (status.className==`${data} active`){
            ab = 1  }
        const data_send = {sortby: data, status: ab}
        try {
            const response = await fetch('/print-item-barcode-sort/', {
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
                const rowHTML = `<tr><td>${item.id}</td><td>${item.name}</td><td>${item.store__name}</td><td>${item.category__name}</td><td>${item.size}</td><td>${item.price}</td><td>${item.quantity}</td><td>${item.reorder_alert}</td><td><a title="Print Barcode ${item.id}" href="javascript:void(0)" id="more_action" onclick="print_barcode_item('print-barcode','${item.id}' )" ><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#434343"><path d="M640-640v-120H320v120h-80v-200h480v200h-80Zm-480 80h640-640Zm560 100q17 0 28.5-11.5T760-500q0-17-11.5-28.5T720-540q-17 0-28.5 11.5T680-500q0 17 11.5 28.5T720-460Zm-80 260v-160H320v160h320Zm80 80H240v-160H80v-240q0-51 35-85.5t85-34.5h560q51 0 85.5 34.5T880-520v240H720v160Zm80-240v-160q0-17-11.5-28.5T760-560H200q-17 0-28.5 11.5T160-520v160h80v-80h480v80h80Z"/></svg></a></td></tr>`;
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
        const data_send = {search_text: search.value, status: ab, sortby: data}
        try {
            const response = await fetch('/print-item-barcode-search/', {
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
                const rowHTML = `<tr><td>${item.id}</td><td>${item.name}</td><td>${item.store__name}</td><td>${item.category__name}</td><td>${item.size}</td><td>${item.price}</td><td>${item.quantity}</td><td>${item.reorder_alert}</td><td><a title="Print Barcode ${item.id}" href="javascript:void(0)" id="more_action" onclick="print_barcode_item('print-barcode','${item.id}' )" ><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#434343"><path d="M640-640v-120H320v120h-80v-200h480v200h-80Zm-480 80h640-640Zm560 100q17 0 28.5-11.5T760-500q0-17-11.5-28.5T720-540q-17 0-28.5 11.5T680-500q0 17 11.5 28.5T720-460Zm-80 260v-160H320v160h320Zm80 80H240v-160H80v-240q0-51 35-85.5t85-34.5h560q51 0 85.5 34.5T880-520v240H720v160Zm80-240v-160q0-17-11.5-28.5T760-560H200q-17 0-28.5 11.5T160-520v160h80v-80h480v80h80Z"/></svg></a></td></tr>`;
                table_content.insertAdjacentHTML("beforeend", rowHTML);                
            })
                    
        } catch (error) {
            console.error('Fetch error:', error);
        }
    }
}

const search = document.getElementById('search_box')
search.addEventListener('input', (event)=>{
    print_barcode('id')
})

async function print_barcode_item(div_name,id){
    show_div(div_name)
    const data_send = {product_id: id}
    try {
        const response = await fetch('/print-item-barcode-get-item/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')
            },
        body: JSON.stringify(data_send)
        });
        
        if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            data.forEach(item=>{
            const id = document.getElementById('item-id')
            const name = document.getElementById('item-name')
            const price = document.getElementById('item-price')
            const barcode = document.getElementById('item-barcode')
            id.innerHTML = item.id
            name.innerHTML = item.name
            price.innerHTML = `$${item.price}`
            barcode.setAttribute('src', `${media_url}media/${item.barcode_image}`)
        })
        
    } catch (error) {
        console.error('Fetch error:', error);
    }
}

function print_barcode1(){
    window.print()
}