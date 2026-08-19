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
            const response = await fetch('/order-reminder-list/sort/', {
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
                const rowHTML = `<tr><td>${item.id}</td><td>${item.name}</td><td>${item.store__name}</td><td>${item.category__name}</td><td>${item.size}</td><td>${item.price}</td><td>${item.quantity}</td><td>${item.reorder_alert}</td></tr>`;
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
            const response = await fetch('/order-reminder-list/search/', {
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
                const rowHTML = `<tr><td>${item.id}</td><td>${item.name}</td><td>${item.store__name}</td><td>${item.category__name}</td><td>${item.size}</td><td>${item.price}</td><td>${item.quantity}</td><td>${item.reorder_alert}</td></tr>`;
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
