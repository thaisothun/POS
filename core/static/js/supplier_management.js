const option = {
  year: 'numeric', 
  month: 'long', 
  day: 'numeric',   
};

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

async function customer(data) {
    const search = document.getElementById('search_box')
    if (search.value == ''){
        const status = document.getElementById(data)
        status.classList.toggle('active')
        var ab = 0
        if (status.className==`${data} active`){
            ab = 1  }
        const data_send = {sortby: data, status: ab}
        try {
            const response = await fetch('/supplier-management/sort/', {
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
                const rowHTML = `<tr><td>${item.id}</td><td>${item.store__name}</td><td>${item.first_name}</td><td>${item.last_name}</td><td>${item.gender}</td><td>${item.phone_number1}</td><td style="text-transform: none;">${item.e_mail}</td><td>${item.membership}</td><td>${new Date(item.created_on).toLocaleString('en-us',option).replace(' at ', ', ')}</td><td><a title="Edit ${item.id}" href="javascript:void(0)" id="more_action" onclick="get_customer('wrapper_modify_customer','${item.id}')"> <svg xmlns="http://www.w3.org/2000/svg" height="28px" viewBox="0 -960 960 960" width="28px" fill="black"><path d="M218.57-421.33q-24.24 0-41.4-17.26Q160-455.86 160-480.09q0-24.24 17.26-41.41 17.26-17.17 41.5-17.17t41.41 17.26q17.16 17.27 17.16 41.5 0 24.24-17.26 41.41-17.26 17.17-41.5 17.17Zm261.34 0q-24.24 0-41.41-17.26-17.17-17.27-17.17-41.5 0-24.24 17.26-41.41 17.27-17.17 41.5-17.17 24.24 0 41.41 17.26 17.17 17.27 17.17 41.5 0 24.24-17.26 41.41-17.27 17.17-41.5 17.17Zm261.33 0q-24.24 0-41.41-17.26-17.16-17.27-17.16-41.5 0-24.24 17.26-41.41 17.26-17.17 41.5-17.17t41.4 17.26Q800-504.14 800-479.91q0 24.24-17.26 41.41-17.26 17.17-41.5 17.17Z"/></svg></a> <a title="Delete ${item.id}" href="javascript:void(0)" id="delete" onclick="show_div('wrapper_delete_customer','${item.id}' )" ><svg xmlns="http://www.w3.org/2000/svg" height="28px" viewBox="0 -960 960 960" width="28px" fill="black"><path d="m366-299.33 114-115.34 114.67 115.34 50-50.67-114-115.33 114-115.34-50-50.66L480-516 366-631.33l-50.67 50.66L430-465.33 315.33-350 366-299.33ZM267.33-120q-27 0-46.83-19.83-19.83-19.84-19.83-46.84V-740H160v-66.67h192V-840h256v33.33h192V-740h-40.67v553.33q0 27-19.83 46.84Q719.67-120 692.67-120H267.33Zm425.34-620H267.33v553.33h425.34V-740Zm-425.34 0v553.33V-740Z"/></svg></a></td></tr>`;
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
            const response = await fetch('/supplier-management/search/', {
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
                const rowHTML = `<tr><td>${item.id}</td><td>${item.store__name}</td><td>${item.first_name}</td><td>${item.last_name}</td><td>${item.gender}</td><td>${item.phone_number1}</td><td style="text-transform: none;">${item.e_mail}</td><td>${item.membership}</td><td>${new Date(item.created_on).toLocaleString('en-us',option).replace(' at ', ', ')}</td><td><a title="Edit ${item.id}" href="javascript:void(0)" id="more_action" onclick="get_customer('wrapper_modify_customer','${item.id}')"> <svg xmlns="http://www.w3.org/2000/svg" height="28px" viewBox="0 -960 960 960" width="28px" fill="black"><path d="M218.57-421.33q-24.24 0-41.4-17.26Q160-455.86 160-480.09q0-24.24 17.26-41.41 17.26-17.17 41.5-17.17t41.41 17.26q17.16 17.27 17.16 41.5 0 24.24-17.26 41.41-17.26 17.17-41.5 17.17Zm261.34 0q-24.24 0-41.41-17.26-17.17-17.27-17.17-41.5 0-24.24 17.26-41.41 17.27-17.17 41.5-17.17 24.24 0 41.41 17.26 17.17 17.27 17.17 41.5 0 24.24-17.26 41.41-17.27 17.17-41.5 17.17Zm261.33 0q-24.24 0-41.41-17.26-17.16-17.27-17.16-41.5 0-24.24 17.26-41.41 17.26-17.17 41.5-17.17t41.4 17.26Q800-504.14 800-479.91q0 24.24-17.26 41.41-17.26 17.17-41.5 17.17Z"/></svg></a> <a title="Delete ${item.id}" href="javascript:void(0)" id="delete" onclick="show_div('wrapper_delete_customer','${item.id}' )" ><svg xmlns="http://www.w3.org/2000/svg" height="28px" viewBox="0 -960 960 960" width="28px" fill="black"><path d="m366-299.33 114-115.34 114.67 115.34 50-50.67-114-115.33 114-115.34-50-50.66L480-516 366-631.33l-50.67 50.66L430-465.33 315.33-350 366-299.33ZM267.33-120q-27 0-46.83-19.83-19.83-19.84-19.83-46.84V-740H160v-66.67h192V-840h256v33.33h192V-740h-40.67v553.33q0 27-19.83 46.84Q719.67-120 692.67-120H267.33Zm425.34-620H267.33v553.33h425.34V-740Zm-425.34 0v553.33V-740Z"/></svg></a></td></tr>`;
                table_content.insertAdjacentHTML("beforeend", rowHTML); 
            })            
        } catch (error) {
            console.error('Fetch error:', error);
        }
    }
}

const search = document.getElementById('search_box')
search.addEventListener('input', (event)=>{
    customer('id')
})

const form_deactivate = document.querySelector('#form_deactivate')
form_deactivate.addEventListener('submit', async function(e){
    e.preventDefault();
    const item_id = document.getElementById('product_id')
    id = item_id.innerHTML
    try {
        const response = await fetch(`/supplier-management/deactivate/${id}/`, {
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
                    title: "Deactivate Supplier",
                    text: data.message_sucess,
                    icon: "success"
                    }); window.addEventListener('click', ()=>{window.location.href = '/people/supplier-list/'})
            }
            if (data.message_error){
                Swal.fire({
                    title: "Deactivate Supplier",
                    text: data.message_error,
                    icon: "error"
                    }); window.addEventListener('click', ()=>{window.location.href = '/people/supplier-list/'})
            }
        } catch (error) {
        console.error('Fetch error:', error);}
    })

async function get_customer(div_name, product_id) {
    show_div(div_name)
    const data_send = {product_id: product_id}
    try {
        const response = await fetch('/supplier-management/get-customer/', {
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
            document.getElementById('item_id').innerHTML = item.id
            document.getElementById('item_first_name').children[1].value = item.first_name
            document.getElementById('item_last_name').children[1].value = item.last_name
            document.getElementById('item_gender').children[1].value = item.gender
            document.getElementById('item_phone_1').children[1].value = item.phone_number1
            document.getElementById('item_phone_2').children[1].value = item.phone_number2 ?? ""
            document.getElementById('item_email').children[1].value = item.e_mail
            document.getElementById('item_store').children[1].value = item.store__id
            document.getElementById('item_membership').children[1].value = item.membership
            document.getElementById('item_address').children[1].value = item.address
            document.getElementById('item_note').children[1].value = item.note
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
        const response = await fetch(`/supplier-management/save-customer/${id}/`, {
        method: 'POST',
        headers: {
            'X-CSRFToken': getCookie('csrftoken') // Embedded directly in a Django template
            },
        body: formdata
        });
        if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            if (data['message_sucess']){
                Swal.fire({
                    title: "Modify Supplier",
                    text: data['message_sucess'],
                    icon: "success"
                    });  window.addEventListener('click', ()=>{window.location.href = '/people/supplier-list/'})
            }
            if (data['message_error']){
                Swal.fire({
                    title: "Modify Supplier",
                    text: data['message_error'],
                    icon: "error"
                    }); window.addEventListener('click', ()=>{window.location.href = '/people/supplier-list/'})
            }
        } catch (error) {
        console.error('Fetch error:', error);}
})
