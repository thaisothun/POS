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

async function inventory(data) {
    const search = document.getElementById('search_box')
    if (search.value == ''){
        const status = document.getElementById(data)
        status.classList.toggle('active')
        var ab = 0
        if (status.className==`${data} active`){
            ab = 1  }
        const data_send = {sortby: data, status: ab}
        try {
            const response = await fetch('/fliter-inventory-deactivate/', {
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
                const rowHTML = `<tr><td>${item.id}</td><td>${item.name}</td><td>${item.store__name}</td><td>${item.category__name}</td><td>${item.size}</td><td>${item.price}</td><td>${item.quantity}</td><td>${item.reorder_alert}</td><td><a title="Edit ${item.id}" href="javascript:void(0)" id="more_action" onclick="get_inventory('wrapper_modify_item','${item.id}')"> <svg xmlns="http://www.w3.org/2000/svg" height="28px" viewBox="0 -960 960 960" width="28px" fill="black"><path d="M218.57-421.33q-24.24 0-41.4-17.26Q160-455.86 160-480.09q0-24.24 17.26-41.41 17.26-17.17 41.5-17.17t41.41 17.26q17.16 17.27 17.16 41.5 0 24.24-17.26 41.41-17.26 17.17-41.5 17.17Zm261.34 0q-24.24 0-41.41-17.26-17.17-17.27-17.17-41.5 0-24.24 17.26-41.41 17.27-17.17 41.5-17.17 24.24 0 41.41 17.26 17.17 17.27 17.17 41.5 0 24.24-17.26 41.41-17.27 17.17-41.5 17.17Zm261.33 0q-24.24 0-41.41-17.26-17.16-17.27-17.16-41.5 0-24.24 17.26-41.41 17.26-17.17 41.5-17.17t41.4 17.26Q800-504.14 800-479.91q0 24.24-17.26 41.41-17.26 17.17-41.5 17.17Z"/></svg></a> <a title="Activate ${item.id}" href="javascript:void(0)" id="activate" onclick="show_div('wrapper_delete_item','${item.id}' )" ><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#434343"><path d="M440-160v-326L336-382l-56-58 200-200 200 200-56 58-104-104v326h-80ZM160-600v-120q0-33 23.5-56.5T240-800h480q33 0 56.5 23.5T800-720v120h-80v-120H240v120h-80Z"/></svg></a></td></tr>`;
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
            const response = await fetch('/search-inventory-deactivate/', {
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
                const rowHTML = `<tr><td>${item.id}</td><td>${item.name}</td><td>${item.store__name}</td><td>${item.category__name}</td><td>${item.size}</td><td>${item.price}</td><td>${item.quantity}</td><td>${item.reorder_alert}</td><td><a title="Edit ${item.id}" href="javascript:void(0)" id="more_action" onclick="get_inventory('wrapper_modify_item','${item.id}')"> <svg xmlns="http://www.w3.org/2000/svg" height="28px" viewBox="0 -960 960 960" width="28px" fill="black"><path d="M218.57-421.33q-24.24 0-41.4-17.26Q160-455.86 160-480.09q0-24.24 17.26-41.41 17.26-17.17 41.5-17.17t41.41 17.26q17.16 17.27 17.16 41.5 0 24.24-17.26 41.41-17.26 17.17-41.5 17.17Zm261.34 0q-24.24 0-41.41-17.26-17.17-17.27-17.17-41.5 0-24.24 17.26-41.41 17.27-17.17 41.5-17.17 24.24 0 41.41 17.26 17.17 17.27 17.17 41.5 0 24.24-17.26 41.41-17.27 17.17-41.5 17.17Zm261.33 0q-24.24 0-41.41-17.26-17.16-17.27-17.16-41.5 0-24.24 17.26-41.41 17.26-17.17 41.5-17.17t41.4 17.26Q800-504.14 800-479.91q0 24.24-17.26 41.41-17.26 17.17-41.5 17.17Z"/></svg></a> <a title="Activate ${item.id}" href="javascript:void(0)" id="activate" onclick="show_div('wrapper_delete_item','${item.id}' )" ><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#434343"><path d="M440-160v-326L336-382l-56-58 200-200 200 200-56 58-104-104v326h-80ZM160-600v-120q0-33 23.5-56.5T240-800h480q33 0 56.5 23.5T800-720v120h-80v-120H240v120h-80Z"/></svg></a></td></tr>`;
                table_content.insertAdjacentHTML("beforeend", rowHTML);   
            })
                    
        } catch (error) {
            console.error('Fetch error:', error);
        }
    }
}

const search = document.getElementById('search_box')
search.addEventListener('input', (event)=>{
    inventory('id')
})

async function get_inventory(div_name, product_id) {
    show_div(div_name)
    const data_send = {product_id: product_id}
    try {
        const response = await fetch('/get-inventory/', {
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
            const item_id = document.getElementById('item_id')    
            const name = document.getElementById('product_name')
            const barcode_number = document.getElementById('barcode_number')
            const item_dscription =document.getElementById('item_dscription')
            const store = document.getElementById('item_store')
            const item_category = document.getElementById('item_category')
            const item_unit = document.getElementById('item_unit')
            const item_size = document.getElementById('item_size')
            const item_price = document.getElementById('item_price')
            const item_cost = document.getElementById('item_cost')
            const item_reorder_alert = document.getElementById('item_reorder_alert')
            const item_photo = document.getElementById('item_photo')
            item_id.innerHTML = item.id
            name.children[1].value = item.name
            barcode_number.children[1].value = item.barcode_number
            item_dscription.children[1].value = item.description
            store.children[1].value = item.store
            item_category.children[1].value = item.category  
            item_unit.children[1].value = item.unit
            item_size.children[1].value = item.size  
            item_price.children[1].value = item.price
            item_cost.children[1].value = item.cost
            item_reorder_alert.children[1].value = item.reorder_alert
            item_photo.children[0].setAttribute('src', `/media/${item.photo}`)
        })
    
    } catch (error) {
        console.error('Fetch error:', error);
    }
}

const form = document.querySelector('#form_update')
form.addEventListener('submit', async function(e){
    e.preventDefault();
    formdata = new FormData(form)
    const item_id = document.getElementById('item_id')
    id = item_id.innerHTML
    try {
        const response = await fetch(`/save-inventory/${id}/`, {
        method: 'POST',
        headers: {
            'X-CSRFToken': getCookie('csrftoken') // Embedded directly in a Django template
            },
        body: formdata
        });
        if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            if (data.message_error){
                Swal.fire({
                    title: "Update Item",
                    text: data.message_error,
                    icon: "error"
                    }); window.addEventListener('click', ()=>{window.location.href = '/inventory/item-management/deactivate-item/'})
            }
            if (data.message_sucess){
                Swal.fire({
                    title: "Update Item",
                    text: data.message_sucess,
                    icon: "success"
                    }); window.addEventListener('click', ()=>{window.location.href = '/inventory/item-management/deactivate-item/'})
            }
        } catch (error) {
        console.error('Fetch error:', error);}
})

const form_deactivate = document.querySelector('#form_deactivate')
form_deactivate.addEventListener('submit', async function(e){
    e.preventDefault();
    const item_id = document.getElementById('product_id')
    id = item_id.innerHTML
    try {
        const response = await fetch(`/activate-inventory/${id}/`, {
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
                    title: "Activate Item",
                    text: data.message_sucess,
                    icon: "success"
                    }); window.addEventListener('click', ()=>{window.location.href = '/inventory/item-management/deactivate-item/'})
            }
            if (data.message_error){
                Swal.fire({
                    title: "Activate Item",
                    text: data.message_error,
                    icon: "error"
                    }); window.addEventListener('click', ()=>{window.location.href = '/inventory/item-management/deactivate-item/'})
            }
        } catch (error) {
        console.error('Fetch error:', error);}
    })
