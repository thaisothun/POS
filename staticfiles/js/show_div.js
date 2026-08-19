
function show_div(div_class, id){
    const div_area = document.getElementById(div_class)
    if (div_area.className === `${div_class} show`){
        const div_area = document.getElementById(div_class)
        div_area.classList.toggle('show')
        
    } else{
        const div_area = document.getElementById(div_class)
        div_area.classList.toggle('show')    
        const text_product_id = document.getElementById('product_id')
        if (text_product_id){
            text_product_id.innerHTML= id}
        const value_product_id = document.getElementById('product_id_value')
        if (value_product_id){    
            value_product_id.value = id}
    }
}

function show_div_invoice(div_class, id){
    const div_area = document.getElementById(div_class)
    if (div_area.className === `${div_class} show`){
        const div_area = document.getElementById(div_class)
        div_area.classList.toggle('show')
        
    } else{
        const div_area = document.getElementById(div_class)
        div_area.classList.toggle('show')    
        const text_product_id = document.getElementById('invoice_id')
        if (text_product_id){
            text_product_id.innerHTML= id}
        const value_product_id = document.getElementById('invoice_id_value')
        if (value_product_id){    
            value_product_id.value = id}
    }
}

function show_div_clear_cart(div_class, id){
    localStorage.removeItem('cart');
    const div_area = document.getElementById(div_class)
    if (div_area.className === `${div_class} show`){
        const div_area = document.getElementById(div_class)
        div_area.classList.toggle('show')
        
    } else{
        const div_area = document.getElementById(div_class)
        div_area.classList.toggle('show')    
        const text_product_id = document.getElementById('invoice_id')
        if (text_product_id){
            text_product_id.innerHTML= id}
        const value_product_id = document.getElementById('invoice_id_value')
        if (value_product_id){    
            value_product_id.value = id}
    }
    
}

try{
    var store = document.getElementById('store').innerHTML.toLowerCase()
    if (store != 'head office'){
    document.querySelectorAll('#id_store').forEach((item)=>{
        item.style.pointerEvents = "none"
        item.setAttribute("tabindex", "-1");
    })
    document.querySelectorAll('#id_group').forEach((item)=>{
        item.style.pointerEvents = "none"
        item.setAttribute("tabindex", "-1");
    })
    }
    
} catch{ }