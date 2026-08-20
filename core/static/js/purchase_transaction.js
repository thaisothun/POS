localStorage.removeItem('cart');
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
                                <p style="position: absolute; padding: 0.5rem; font-size: 1rem; font-weight: 600; ">${item.cost}</p>
                                <div style="width: 120px; height: 120px; object-fit: cover;"><img style="width: 100%; height: 100%; border-top-left-radius:10px; border-top-right-radius: 10px;" src="${media_url}media/${item.photo}" alt="photo item"></div>    
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
    const sub_total = document.getElementById('sub_total')
    sub_total.innerHTML = totalAmount.toFixed(2)
}

function discount_amount(){
    const discount_ele = document.getElementById('discount_amount')
    const sub_total = document.getElementById('sub_total').innerHTML
    const discount_amount = (sub_total * discount.children[1].value)/100
    discount_ele.innerHTML = discount_amount.toFixed(2)
    net_total()
}

const discount = document.getElementById('discount')
discount.children[1].addEventListener('focusout', ()=>{
    discount_amount()})

const promotion_code = document.getElementById('promotion_code')
promotion_code.children[1].addEventListener('focusout', (item)=>{
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
                const promotion_code_amount = document.getElementById('promotion_code_amount')
                promotion_code_amount.innerHTML = item.amount_discount
            })
            } catch (error) {
            console.error('Fetch error:', error);}
        }
        send_get_data()
        discount_amount()
        net_total()
    })

function net_total(){
    const sub_total = document.getElementById('sub_total')
    const promotion_code_amount = document.getElementById('promotion_code_amount')
    const discount_ele = document.getElementById('discount_amount')
    const net_total = sub_total.innerHTML - promotion_code_amount.innerHTML - discount_ele.innerHTML
    const net_total_ele = document.getElementById('net_amount')
    net_total_ele.innerHTML = net_total.toFixed(2)
}

function clear_cart(){
    localStorage.removeItem('cart');
    const item_cart = document.getElementById('cart_item')
        item_cart.replaceChildren()
        const sub_total = document.getElementById('sub_total')
        location.reload();       
}

const search_box = document.getElementById('search_box')
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
                                <p style="position: absolute; padding: 0.5rem; font-size: 1rem; font-weight: 600; ">${item.cost}</p>
                                <div style="width: 120px; height: 120px; object-fit: cover;"><img style="width: 100%; height: 100%; border-top-left-radius:10px; border-top-right-radius: 10px;" src="${media_url}media/${item.photo}" alt="photo item"></div>    
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

const submit = document.getElementById('submit')
submit.addEventListener('click', (e)=>{
    let cart = JSON.parse(localStorage.getItem('cart'))
    document.getElementById('cart_save_item').value = JSON.stringify(cart)
})

function modify_price(item_id){
    const input_modify_price = document.getElementById(item_id)
    input_modify_price.addEventListener('focusout', ()=>{
        console.log('run')
        let cart = JSON.parse(localStorage.getItem('cart'))
    const existingItem = cart.find(item => item.item_id === item_id);
    if (existingItem) {
        existingItem.unit_price = Number(input_modify_price.value).toFixed(2);
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
}

function print_sale_receipt() {
    window.print()
    const sale_receipt_div = document.getElementById('print_sale_receipt')
    sale_receipt_div.classList.toggle('show')
}

const search_customer_input = document.getElementById('customer_search')
search_customer_input.children[0].addEventListener('input', ()=>{
    const customer_serarch_toggle = document.getElementById('customer_search_toggle')
    customer_serarch_toggle.classList.toggle('show')
    data_send = {search_text: search_customer_input.children[0].value}
    async function send_get_data() {
        try {
            const response = await fetch('/purchase-transaction/search_supplier/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken') // Embedded directly in a Django template
                },
            body: JSON.stringify(data_send)
            });
            
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            const customer_serarch_div = document.getElementById('customer_search_display')
            customer_serarch_div.replaceChildren()
            if(data.length==0){
                rowHtml = `<li>Not Found</li>`
                customer_serarch_div.insertAdjacentHTML("beforeend", rowHtml);
            } else{            
            data.forEach((item)=>{
                rowHtml = `<li onclick="select_custmer('${item.id}')">${item.full_name}, Phone Number ${item.phone_number1}</li>`
                customer_serarch_div.insertAdjacentHTML("beforeend", rowHtml);
            })}
            } catch (error) {
            console.error('Fetch error:', error);}
        }
        send_get_data()
})

function select_custmer(id){
    const search_customer_input = document.getElementById('customer_search')
    search_customer_input.children[0].value = id
    const customer_serarch_toggle = document.getElementById('customer_search_toggle')
    customer_serarch_toggle.classList.toggle('show')
}

const form = document.querySelector('#form_add_customer')
form.addEventListener('submit', async function(e){
    e.preventDefault();
    formdata = new FormData(form)
    try {
        const response = await fetch(`/purchase-transaction/add_supplier/`, {
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
                    title: "Add Supplier",
                    text: data['message_sucess'],
                    icon: "success"
                    });
                show_div('wrapper_add_customer_sale_transaction')
                data.customer.forEach((item)=>{
                    const search_customer_input = document.getElementById('customer_search')
                    search_customer_input.children[0].value = item.id
                })
            }
            if (data['message_error']){
                Swal.fire({
                    title: "Add Supplier",
                    text: data['message_error'],
                    icon: "error"
                    }); window.addEventListener('click', ()=>{window.location.href = '/purchase/purchase-transaction/'})
            }
            if (data['form_error']){
                Swal.fire({
                    title: "Add Supplier",
                    text: data['form_error'],
                    icon: "error"
                    }); window.addEventListener('click', ()=>{window.location.href = '/purchase/purchase-transaction/'})
            }
        } catch (error) {
        console.error('Fetch error:', error);}
})
