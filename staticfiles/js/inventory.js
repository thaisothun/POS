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
            const response = await fetch('/fliter-inventory/', {
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
                const rowHTML = `<tr><td>${item.id}</td><td>${item.name}</td><td>${item.store__name}</td><td>${item.category__name}</td><td>${item.size}</td><td>${item.price}</td><td>${item.quantity}</td><td>${item.reorder_alert}</td><td><a title="Edit ${item.id}" href="javascript:void(0)" id="more_action" onclick="get_inventory('wrapper_modify_item','${item.id}')"> <svg xmlns="http://www.w3.org/2000/svg" height="28px" viewBox="0 -960 960 960" width="28px" fill="black"><path d="M218.57-421.33q-24.24 0-41.4-17.26Q160-455.86 160-480.09q0-24.24 17.26-41.41 17.26-17.17 41.5-17.17t41.41 17.26q17.16 17.27 17.16 41.5 0 24.24-17.26 41.41-17.26 17.17-41.5 17.17Zm261.34 0q-24.24 0-41.41-17.26-17.17-17.27-17.17-41.5 0-24.24 17.26-41.41 17.27-17.17 41.5-17.17 24.24 0 41.41 17.26 17.17 17.27 17.17 41.5 0 24.24-17.26 41.41-17.27 17.17-41.5 17.17Zm261.33 0q-24.24 0-41.41-17.26-17.16-17.27-17.16-41.5 0-24.24 17.26-41.41 17.26-17.17 41.5-17.17t41.4 17.26Q800-504.14 800-479.91q0 24.24-17.26 41.41-17.26 17.17-41.5 17.17Z"/></svg></a><a title="Item Adjustment ${item.id}" href="javascript:void(0)" id="adjustment" onclick="adjustment('wrapper_adjustment_item','${item.id}')"><svg xmlns="http://www.w3.org/2000/svg" height="28px" viewBox="0 -960 960 960" width="28px" fill="black"><path d="M640-640h120-120Zm-440 0h338-18 14-334Zm16-80h528l-34-40H250l-34 40Zm184 270 80-40 80 40v-190H400v190Zm182 330H200q-33 0-56.5-23.5T120-200v-499q0-14 4.5-27t13.5-24l50-61q11-14 27.5-21.5T250-840h460q18 0 34.5 7.5T772-811l50 61q9 11 13.5 24t4.5 27v196q-19-7-39-11t-41-4v-122H640v153q-35 20-61 49.5T538-371l-58-29-160 80v-320H200v440h334q8 23 20 43t28 37Zm138 0v-120H600v-80h120v-120h80v120h120v80H800v120h-80Z"/></svg></a> <a title="Delete ${item.id}" href="javascript:void(0)" id="delete" onclick="show_div('wrapper_delete_item','${item.id}' )" ><svg xmlns="http://www.w3.org/2000/svg" height="28px" viewBox="0 -960 960 960" width="28px" fill="black"><path d="m366-299.33 114-115.34 114.67 115.34 50-50.67-114-115.33 114-115.34-50-50.66L480-516 366-631.33l-50.67 50.66L430-465.33 315.33-350 366-299.33ZM267.33-120q-27 0-46.83-19.83-19.83-19.84-19.83-46.84V-740H160v-66.67h192V-840h256v33.33h192V-740h-40.67v553.33q0 27-19.83 46.84Q719.67-120 692.67-120H267.33Zm425.34-620H267.33v553.33h425.34V-740Zm-425.34 0v553.33V-740Z"/></svg></a></td></tr>`;
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
            const response = await fetch('/search-inventory/', {
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
                const rowHTML = `<tr><td>${item.id}</td><td>${item.name}</td><td>${item.store__name}</td><td>${item.category__name}</td><td>${item.size}</td><td>${item.price}</td><td>${item.quantity}</td><td>${item.reorder_alert}</td><td><a title="Edit ${item.id}" href="javascript:void(0)" id="more_action" onclick="get_inventory('wrapper_modify_item','${item.id}')"> <svg xmlns="http://www.w3.org/2000/svg" height="28px" viewBox="0 -960 960 960" width="28px" fill="black"><path d="M218.57-421.33q-24.24 0-41.4-17.26Q160-455.86 160-480.09q0-24.24 17.26-41.41 17.26-17.17 41.5-17.17t41.41 17.26q17.16 17.27 17.16 41.5 0 24.24-17.26 41.41-17.26 17.17-41.5 17.17Zm261.34 0q-24.24 0-41.41-17.26-17.17-17.27-17.17-41.5 0-24.24 17.26-41.41 17.27-17.17 41.5-17.17 24.24 0 41.41 17.26 17.17 17.27 17.17 41.5 0 24.24-17.26 41.41-17.27 17.17-41.5 17.17Zm261.33 0q-24.24 0-41.41-17.26-17.16-17.27-17.16-41.5 0-24.24 17.26-41.41 17.26-17.17 41.5-17.17t41.4 17.26Q800-504.14 800-479.91q0 24.24-17.26 41.41-17.26 17.17-41.5 17.17Z"/></svg></a><a title="Item Adjustment ${item.id}" href="javascript:void(0)" id="adjustment" onclick="adjustment('wrapper_adjustment_item','${item.id}')"><svg xmlns="http://www.w3.org/2000/svg" height="28px" viewBox="0 -960 960 960" width="28px" fill="black"><path d="M640-640h120-120Zm-440 0h338-18 14-334Zm16-80h528l-34-40H250l-34 40Zm184 270 80-40 80 40v-190H400v190Zm182 330H200q-33 0-56.5-23.5T120-200v-499q0-14 4.5-27t13.5-24l50-61q11-14 27.5-21.5T250-840h460q18 0 34.5 7.5T772-811l50 61q9 11 13.5 24t4.5 27v196q-19-7-39-11t-41-4v-122H640v153q-35 20-61 49.5T538-371l-58-29-160 80v-320H200v440h334q8 23 20 43t28 37Zm138 0v-120H600v-80h120v-120h80v120h120v80H800v120h-80Z"/></svg></a> <a title="Delete ${item.id}" href="javascript:void(0)" id="delete" onclick="show_div('wrapper_delete_item','${item.id}' )" ><svg xmlns="http://www.w3.org/2000/svg" height="28px" viewBox="0 -960 960 960" width="28px" fill="black"><path d="m366-299.33 114-115.34 114.67 115.34 50-50.67-114-115.33 114-115.34-50-50.66L480-516 366-631.33l-50.67 50.66L430-465.33 315.33-350 366-299.33ZM267.33-120q-27 0-46.83-19.83-19.83-19.84-19.83-46.84V-740H160v-66.67h192V-840h256v33.33h192V-740h-40.67v553.33q0 27-19.83 46.84Q719.67-120 692.67-120H267.33Zm425.34-620H267.33v553.33h425.34V-740Zm-425.34 0v553.33V-740Z"/></svg></a></td></tr>`;
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

const form_update = document.querySelector('#form_update')
form_update.addEventListener('submit', async function(e){
    e.preventDefault();
    formdata = new FormData(form_update)
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
                    }); window.addEventListener('click', ()=>{window.location.href = '/inventory/item-management/'})
            }
            if (data.message_sucess){
                Swal.fire({
                    title: "Update Item",
                    text: data.message_sucess,
                    icon: "success"
                    }); window.addEventListener('click', ()=>{window.location.href = '/inventory/item-management/'})
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
        const response = await fetch(`/deactivate-inventory/${id}/`, {
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
                    title: "Deactivate Item",
                    text: data.message_sucess,
                    icon: "success"
                    });window.addEventListener('click', ()=>{window.location.href = '/inventory/item-management/'})
            }
            if (data.message_error){
                Swal.fire({
                    title: "Deactivate Item",
                    text: data.message_error,
                    icon: "error"
                    }); window.addEventListener('click', ()=>{window.location.href = '/inventory/item-management/'})
            }
        } catch (error) {
        console.error('Fetch error:', error);}
    })

async function adjustment(div_name, product_id) {
    show_div(div_name)
    const data_send = {product_id: product_id}
    try {
        const response = await fetch('/item-management/get-adjustment-item/', {
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
                document.getElementById('adjustment_name').children[1].value = item.id
                document.getElementById('adjustment_name').children[1].inert = true;
        })

    } catch (error) {
        console.error('Fetch error:', error);
    }
}

const form_adjustment = document.querySelector('#form_adjustment')
form_adjustment.addEventListener('submit', async function(e){
    e.preventDefault();
    formdata = new FormData(form_adjustment)
    try {
        const response = await fetch(`/item-management/save-adjustment-item/`, {
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
                    title: "Adjustment Item",
                    text: data.message_error,
                    icon: "error"
                    }); window.addEventListener('click', ()=>{window.location.href = '/inventory/item-management/'})
            }
            if (data.message_sucess){
                Swal.fire({
                    title: "Adjustment Item",
                    text: data.message_sucess,
                    icon: "success"
                    });
                show_div('wrapper_adjustment_item')
                window.addEventListener('click', ()=>{window.location.href = '/inventory/item-management/'})
            }
        } catch (error) {
        console.error('Fetch error:', error);}
})