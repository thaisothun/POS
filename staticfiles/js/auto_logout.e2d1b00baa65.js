const inactive_time_out = 5 * 60 * 1000;
const buffer_time = 60 * 1000;
const warn_time_out = inactive_time_out - buffer_time;

let seconds_remaining;
let counter_timer;
let timer_warning;
let timer_idel;

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

function show_warning (){
    document.getElementById('wrapper_delete_customer').classList.add('show');
    seconds_remaining = 60;
    document.getElementById('warning_time').innerText = seconds_remaining;
    counter_timer = setInterval(()=>{
        seconds_remaining --;
        document.getElementById('warning_time').innerText = seconds_remaining;
        if (seconds_remaining <=5){
            const alertSound = new Audio('https://google.com');
            alertSound.play();
            }
        if (seconds_remaining <= 0){
            clearInterval(counter_timer);
            } 
    },1000)
}

function logout (){
    window.location.href = '/logout'; 
}

function reset_timer(){
    document.getElementById('wrapper_delete_customer').classList.remove('show');
    clearInterval(timer_warning);
    clearInterval(timer_idel);
    clearInterval(timer_warning);
    timer_warning = setTimeout(show_warning , warn_time_out);
    timer_idel = setTimeout(logout , inactive_time_out);
}

async function keep_session (){
    try {
        const data = ''
        const response = await fetch('/keep-session/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')
            },
        body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error('Network response was not ok');           
    } catch (error) {
        console.error('Fetch error:', error);
        }
}

const activity_event = ['mousemove', 'mousedown', 'keypress', 'touchstart', 'scroll'];
activity_event.forEach((event)=>{
    window.addEventListener(event, ()=>{
        reset_timer();
    })
})

reset_timer();