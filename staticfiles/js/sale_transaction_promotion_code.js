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

async function category(data) {
    const search = document.getElementById('search_box')
    if (search.value == ''){
        const status = document.getElementById(data)
        status.classList.toggle('active')
        var ab = 0
        if (status.className==`${data} active`){
            ab = 1  }
        const data_send = {sortby: data, status: ab}
        try {
            const response = await fetch('/sale/sale-transaction/promotion-code/sort/', {
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
                item_link = link.replace('0', item.name);
                console.log(link)
                if (item.start_date){
                    start_date = new Date(item.start_date).toLocaleString('en-us',option).replace(' at ', ', ')
                } else{ start_date = ''}
                if (item.end_date){
                    end_date = new Date(item.end_date).toLocaleString('en-us',option).replace(' at ', ', ')
                } else{ end_date = ''}
                const rowHTML = `<tr><td>${item.id}</td><td><a id="link" href="${item_link}">${item.name}</a></td><td>${item.store__name}</td><td>${item.amount_discount}</td><td>${item.max_uses}</td><td>${item.max_uses_per_user}</td><td>${start_date}</td><td>${end_date}</td><td><a title="Edit ${item.id}" href="javascript:void(0)" id="more_action" onclick="get_category('wrapper_modify_promotion_code','${item.id}')"> <svg xmlns="http://www.w3.org/2000/svg" height="28px" viewBox="0 -960 960 960" width="28px" fill="black"><path d="M218.57-421.33q-24.24 0-41.4-17.26Q160-455.86 160-480.09q0-24.24 17.26-41.41 17.26-17.17 41.5-17.17t41.41 17.26q17.16 17.27 17.16 41.5 0 24.24-17.26 41.41-17.26 17.17-41.5 17.17Zm261.34 0q-24.24 0-41.41-17.26-17.17-17.27-17.17-41.5 0-24.24 17.26-41.41 17.27-17.17 41.5-17.17 24.24 0 41.41 17.26 17.17 17.27 17.17 41.5 0 24.24-17.26 41.41-17.27 17.17-41.5 17.17Zm261.33 0q-24.24 0-41.41-17.26-17.16-17.27-17.16-41.5 0-24.24 17.26-41.41 17.26-17.17 41.5-17.17t41.4 17.26Q800-504.14 800-479.91q0 24.24-17.26 41.41-17.26 17.17-41.5 17.17Z"/></svg></a> <a title="Delete ${item.id}" href="javascript:void(0)" id="delete" onclick="show_div('wrapper_delete_promotion_code','${item.name}' )" ><svg xmlns="http://www.w3.org/2000/svg" height="28px" viewBox="0 -960 960 960" width="28px" fill="black"><path d="m366-299.33 114-115.34 114.67 115.34 50-50.67-114-115.33 114-115.34-50-50.66L480-516 366-631.33l-50.67 50.66L430-465.33 315.33-350 366-299.33ZM267.33-120q-27 0-46.83-19.83-19.83-19.84-19.83-46.84V-740H160v-66.67h192V-840h256v33.33h192V-740h-40.67v553.33q0 27-19.83 46.84Q719.67-120 692.67-120H267.33Zm425.34-620H267.33v553.33h425.34V-740Zm-425.34 0v553.33V-740Z"/></svg></a></td></tr>`;
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
            const response = await fetch('/sale/sale-transaction/promotion-code/search/', {
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
                item_link = link.replace('0', item.name);
                console.log(item_link)
                if (item.start_date){
                    start_date = new Date(item.start_date).toLocaleString('en-us',option).replace(' at ', ', ')
                } else{ start_date = ''}
                if (item.end_date){
                    end_date = new Date(item.end_date).toLocaleString('en-us',option).replace(' at ', ', ')
                } else{ end_date = ''}
                const rowHTML = `<tr><td>${item.id}</td><td><a id="link" href="${item_link}">${item.name}</a></td><td>${item.store__name}</td><td>${item.amount_discount}</td><td>${item.max_uses}</td><td>${item.max_uses_per_user}</td><td>${start_date}</td><td>${end_date}</td><td><a title="Edit ${item.id}" href="javascript:void(0)" id="more_action" onclick="get_category('wrapper_modify_promotion_code','${item.id}')"> <svg xmlns="http://www.w3.org/2000/svg" height="28px" viewBox="0 -960 960 960" width="28px" fill="black"><path d="M218.57-421.33q-24.24 0-41.4-17.26Q160-455.86 160-480.09q0-24.24 17.26-41.41 17.26-17.17 41.5-17.17t41.41 17.26q17.16 17.27 17.16 41.5 0 24.24-17.26 41.41-17.26 17.17-41.5 17.17Zm261.34 0q-24.24 0-41.41-17.26-17.17-17.27-17.17-41.5 0-24.24 17.26-41.41 17.27-17.17 41.5-17.17 24.24 0 41.41 17.26 17.17 17.27 17.17 41.5 0 24.24-17.26 41.41-17.27 17.17-41.5 17.17Zm261.33 0q-24.24 0-41.41-17.26-17.16-17.27-17.16-41.5 0-24.24 17.26-41.41 17.26-17.17 41.5-17.17t41.4 17.26Q800-504.14 800-479.91q0 24.24-17.26 41.41-17.26 17.17-41.5 17.17Z"/></svg></a> <a title="Delete ${item.id}" href="javascript:void(0)" id="delete" onclick="show_div('wrapper_delete_promotion_code','${item.name}' )" ><svg xmlns="http://www.w3.org/2000/svg" height="28px" viewBox="0 -960 960 960" width="28px" fill="black"><path d="m366-299.33 114-115.34 114.67 115.34 50-50.67-114-115.33 114-115.34-50-50.66L480-516 366-631.33l-50.67 50.66L430-465.33 315.33-350 366-299.33ZM267.33-120q-27 0-46.83-19.83-19.83-19.84-19.83-46.84V-740H160v-66.67h192V-840h256v33.33h192V-740h-40.67v553.33q0 27-19.83 46.84Q719.67-120 692.67-120H267.33Zm425.34-620H267.33v553.33h425.34V-740Zm-425.34 0v553.33V-740Z"/></svg></a></td></tr>`;
                table_content.insertAdjacentHTML("beforeend", rowHTML);
            })            
        } catch (error) {
            console.error('Fetch error:', error);
        }
    }
}

const search = document.getElementById('search_box')
search.addEventListener('input', (event)=>{
    category('id')
})

async function get_category(div_name, product_id) {
    show_div(div_name)
    const data_send = {product_id: product_id}
    try {
        const response = await fetch('/sale/sale-transaction/promotion-code/get/', {
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
            if (item.start_date){
                start_date = new Date(item.start_date).toLocaleString('en-us',option).replace(' at ', ', ')
                } else{ start_date = ''}
            if (item.end_date){
                end_date = new Date(item.end_date).toLocaleString('en-us',option).replace(' at ', ', ')
                } else{ end_date = ''}
            document.getElementById('store_name').children[1].value = item.store
            document.getElementById('product_name').children[1].value = item.name
            document.getElementById('code_amount_discount').children[1].value = item.amount_discount
            document.getElementById('code_max_uses').children[1].value = item.max_uses
            document.getElementById('code_max_uses_per_user').children[1] = item.max_uses_per_user
            document.getElementById('code_start_date').children[1].value = new Date(start_date).toLocaleDateString('en-ca',{month: '2-digit', day: '2-digit', year: 'numeric'});
            document.getElementById('code_end_date').children[1].value = new Date(end_date).toLocaleDateString('en-ca',{month: '2-digit', day: '2-digit', year: 'numeric'})
            document.getElementById('code_id').value = item.id
        })
    } catch (error) {
        console.error('Fetch error:', error);
    }
}

const form = document.querySelector('#form_update')
form.addEventListener('submit', async function(e){
    e.preventDefault();
    formdata = new FormData(form)
    const item_id = document.getElementById('code_id')
    id = item_id.value
    try {
        const response = await fetch(`/sale/sale-transaction/promotion-code/modify/${id}/`, {
        method: 'POST',
        headers: {
            'X-CSRFToken': getCookie('csrftoken') // Embedded directly in a Django template
            },
        body: formdata
        });
        if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            if (data.message_sucess){
                Swal.fire({
                        title: "Modify Promotion Code",
                        text: data.message_sucess,
                        icon: "success"
                        }); window.addEventListener('click', ()=>{window.location.href = '/sale/promotion-code/'})
            }
            if (data.error){     
                Swal.fire({
                        title: "Modify Promotion Code",
                        text: data.error.name[0],
                        icon: "error"
                        }); window.addEventListener('click', ()=>{window.location.href = '/sale/promotion-code/'})       
            }
            if (data.message_error){     
                Swal.fire({
                        title: "Modify Promotion Code",
                        text: data.message_error,
                        icon: "error"
                        }); window.addEventListener('click', ()=>{window.location.href = '/sale/promotion-code/'})       
            }
        } catch (error) {
        console.error('Fetch error:', error);}
})

const form_delete_category = document.querySelector('#form_delete_category')
form_delete_category.addEventListener('submit', async function(e){
    e.preventDefault();
    const item_id = document.getElementById('product_id')
    id = item_id.innerHTML
    try {
        const response = await fetch(`/sale/sale-transaction/promotion-code/delete/${id}/`, {
        method: 'POST',
        headers: {
            'X-CSRFToken': getCookie('csrftoken') // Embedded directly in a Django template
            },
        
        });
        if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            if (data.message_sucess){
                Swal.fire({
                    title: "Delete Promotion Code",
                    text: data.message_sucess,
                    icon: "success"
                    }); window.addEventListener('click', ()=>{window.location.href = '/sale/promotion-code/'})                
            }
            if (data.message_error){
                Swal.fire({
                    title: "Delete Category",
                    text: data.message_error,
                    icon: "error"
                    }); window.addEventListener('click', ()=>{window.location.href = '/sale/promotion-code/'})
            }
        } catch (error) {
        console.error('Fetch error:', error);}
})