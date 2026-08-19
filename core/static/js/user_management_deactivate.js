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
            const response = await fetch('/user-management/deactivate-user-list/sort/', {
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
                const rowHTML = `<tr>
                                    <td>${item.userprofile__store__name}</td>
                                    <td style="text-transform: none;">${item.username}</td>
                                    <td>${item.first_name}</td>
                                    <td>${item.last_name}</td>
                                    <td>${item.userprofile__gender}</td>
                                    <td>${new Date(item.userprofile__date_of_brith).toLocaleDateString('en-us',option).replace('At',',')}</td>
                                    <td>${item.userprofile__phone_number}</td>
                                    <td>${item.userprofile__group__name}</td>
                                    <td>${new Date(item.userprofile__created_on).toLocaleDateString('en-us',option).replace('At',',')}</td>
                                    <td>${item.userprofile__status}</td>
                                    <td><a title="Edit ${item.username}" href="javascript:void(0)" id="more_action" onclick="get_user('wrapper_modify_user','${item.username}')"> <svg xmlns="http://www.w3.org/2000/svg" height="28px" viewBox="0 -960 960 960" width="28px" fill="black"><path d="M218.57-421.33q-24.24 0-41.4-17.26Q160-455.86 160-480.09q0-24.24 17.26-41.41 17.26-17.17 41.5-17.17t41.41 17.26q17.16 17.27 17.16 41.5 0 24.24-17.26 41.41-17.26 17.17-41.5 17.17Zm261.34 0q-24.24 0-41.41-17.26-17.17-17.27-17.17-41.5 0-24.24 17.26-41.41 17.27-17.17 41.5-17.17 24.24 0 41.41 17.26 17.17 17.27 17.17 41.5 0 24.24-17.26 41.41-17.27 17.17-41.5 17.17Zm261.33 0q-24.24 0-41.41-17.26-17.16-17.27-17.16-41.5 0-24.24 17.26-41.41 17.26-17.17 41.5-17.17t41.4 17.26Q800-504.14 800-479.91q0 24.24-17.26 41.41-17.26 17.17-41.5 17.17Z"/></svg></a> <a title="Activate Customer ${item.username}" href="javascript:void(0)" id="activate" onclick="show_div('wrapper_delete_customer','${item.username}' )" ><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#434343"><path d="M440-160v-326L336-382l-56-58 200-200 200 200-56 58-104-104v326h-80ZM160-600v-120q0-33 23.5-56.5T240-800h480q33 0 56.5 23.5T800-720v120h-80v-120H240v120h-80Z"/></svg></a></td>
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
        const data_send = {search_text: search.value, status: ab, sortby: data}
        try {
            const response = await fetch('/user-management/deactivate-user-list/search/', {
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
                 const rowHTML = `<tr>
                                    <td>${item.userprofile__store__name}</td>
                                    <td style="text-transform: none;">${item.username}</td>
                                    <td>${item.first_name}</td>
                                    <td>${item.last_name}</td>
                                    <td>${item.userprofile__gender}</td>
                                    <td>${new Date(item.userprofile__date_of_brith).toLocaleDateString('en-us',option).replace('At',',')}</td>
                                    <td>${item.userprofile__phone_number}</td>
                                    <td>${item.userprofile__group__name}</td>
                                    <td>${new Date(item.userprofile__created_on).toLocaleDateString('en-us',option).replace('At',',')}</td>
                                    <td>${item.userprofile__status}</td>
                                    <td><a title="Edit ${item.username}" href="javascript:void(0)" id="more_action" onclick="get_user('wrapper_modify_user','${item.username}')"> <svg xmlns="http://www.w3.org/2000/svg" height="28px" viewBox="0 -960 960 960" width="28px" fill="black"><path d="M218.57-421.33q-24.24 0-41.4-17.26Q160-455.86 160-480.09q0-24.24 17.26-41.41 17.26-17.17 41.5-17.17t41.41 17.26q17.16 17.27 17.16 41.5 0 24.24-17.26 41.41-17.26 17.17-41.5 17.17Zm261.34 0q-24.24 0-41.41-17.26-17.17-17.27-17.17-41.5 0-24.24 17.26-41.41 17.27-17.17 41.5-17.17 24.24 0 41.41 17.26 17.17 17.27 17.17 41.5 0 24.24-17.26 41.41-17.27 17.17-41.5 17.17Zm261.33 0q-24.24 0-41.41-17.26-17.16-17.27-17.16-41.5 0-24.24 17.26-41.41 17.26-17.17 41.5-17.17t41.4 17.26Q800-504.14 800-479.91q0 24.24-17.26 41.41-17.26 17.17-41.5 17.17Z"/></svg></a> <a title="Activate Customer ${item.username}" href="javascript:void(0)" id="activate" onclick="show_div('wrapper_delete_customer','${item.username}' )" ><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#434343"><path d="M440-160v-326L336-382l-56-58 200-200 200 200-56 58-104-104v326h-80ZM160-600v-120q0-33 23.5-56.5T240-800h480q33 0 56.5 23.5T800-720v120h-80v-120H240v120h-80Z"/></svg></a></td>
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
    customer('username')
})

const form_activate = document.querySelector('#form_activate')
form_activate.addEventListener('submit', async function(e){
    e.preventDefault();
    const item_id = document.getElementById('product_id')
    username = item_id.innerHTML
    try {
        const response = await fetch(`/user-management/deactivate-user-list/activate/${username}/`, {
        method: 'POST',
        headers: {
            'X-CSRFToken': getCookie('csrftoken') // Embedded directly in a Django template
            },
        body: username
        });
        if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            if (data.message_sucess){
                Swal.fire({
                    title: "Activate User",
                    text: data.message_sucess,
                    icon: "success"
                    });
                show_div('wrapper_delete_customer')
                window.addEventListener('click', ()=>{
                    location.reload()
                } )
            }
            if (data.message_error){
                Swal.fire({
                    title: "Activate User",
                    text: data.message_error,
                    icon: "error"
                    });
                show_div('wrapper_delete_customer')
                window.addEventListener('click', ()=>{
                    location.reload()
                } )
            }
        } catch (error) {
        console.error('Fetch error:', error);}
    })

async function get_user(div_name, username) {
    show_div(div_name)
    const data_send = {username: username}
    try {
        const response = await fetch('/user-management/get-user/', {
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
            document.getElementById('modify_username').children[1].value = item.username
            document.getElementById('modify_group').children[1].value = item.userprofile__group
            document.getElementById('modify_first_name').children[1].value = item.first_name
            document.getElementById('modify_last_name').children[1].value = item.last_name
            document.getElementById('modify_gender').children[1].value = item.userprofile__gender
            document.getElementById('modify_date_of_birth').children[1].value = item.userprofile__date_of_brith
            document.getElementById('modify_phone_number').children[1].value = item.userprofile__phone_number
            document.getElementById('modify_email').children[1].value = item.email
            document.getElementById('modify_store').children[1].value = item.userprofile__store
            document.getElementById('modify_address').children[1].value = item.userprofile__address
            document.getElementById('modify_profile_photo').children[0].src = `/media/${item.userprofile__image_profile}`    
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
        const response = await fetch(`/user-management/modify-user/${id}/`, {
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
                    title: "Update User",
                    text: data.message_sucess,
                    icon: "success"
                    }); window.addEventListener('click', ()=>{window.location.href = '/user-management/deactivate-user-list/'})
            }
            if (data.message_error){
                Swal.fire({
                    title: "Update User",
                    text: data.message_error,
                    icon: "error"
                    }); window.addEventListener('click', ()=>{window.location.href = '/user-management/deactivate-user-list/'})
            }
        } catch (error) {
        console.error('Fetch error:', error);}
})
