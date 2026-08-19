
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

async function set_default_store(store) {
    const data_send = {store: store}
    try {
        const response = await fetch('/setting/set-default-store/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')
            },
        body: JSON.stringify(data_send)
        });
        
        if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            if (data.message_sucess){
                Swal.fire({
                    title: "Default Store ",
                    text: data.message_sucess,
                    icon: "success"
                    });
            }
            if (data.message_error){
                Swal.fire({
                    title: "Default Store",
                    text: data.message_error,
                    icon: "error"
                    });
            }

    } catch (error) {
        console.error('Fetch error:', error);
    }
}

async function get_user_setting() {
    try {
        const response = await fetch('/setting/get-user-setting/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')
            },
        body: ''
        });
        if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            document.getElementById('store_option').value = data['default_store']
        } catch (error) {
        console.error('Fetch error:', error);
    }
}

document.getElementById('store_option').addEventListener('change', (item)=>{
    set_default_store(item.target.value)
})

window.addEventListener('load', ()=>{
    get_user_setting()
})