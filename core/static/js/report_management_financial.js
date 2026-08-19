const option = {
  year: 'numeric', 
  month: 'long', 
  day: 'numeric', 
  hour: 'numeric', 
  minute: 'numeric',   
};

const formatter = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
});

const now = new Date()
const current_day = String(now.getDate()).padStart(2, '0');
const current_month = String(now.getMonth() + 1).padStart(2, '0');
const current_year = now.getFullYear()
const start_date = document.getElementById('start_date')
const end_date = document.getElementById('end_date')
start_date.value = `${current_year}-${current_month}-01`
end_date.value = `${current_year}-${current_month}-${current_day}`

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

start_date.addEventListener('change', ()=>{
    const current_date = new Date(`${current_year}-${current_month}-${current_day}`);
    if (new Date(start_date.value) > current_date){
        Swal.fire({
            title: "Profit and Loss Statement",
            text: "Selected date can not after current date!",
            icon: "error"
            });
            window.addEventListener('click', ()=>{
                    location.reload()
                } )
    }})

end_date.addEventListener('change', ()=>{
    const from_date_selected = new Date(start_date.value)
    if (new Date(end_date.value) < from_date_selected){
        Swal.fire({
            title: "Profit and Loss Statement",
            text: "Selected date can not before start date!",
            icon: "error"
            });
            window.addEventListener('click', ()=>{
                    location.reload()
                } )
    }})

async function sale_transaction_report(start_date, end_date, path){
    data_send = {start_date : start_date.value, end_date : end_date.value}
    document.getElementById('from_date').innerHTML = start_date.value
    document.getElementById('to_date').innerHTML = end_date.value
    try {
        const response = await fetch(path, {
        method: 'POST',
        headers: {
            'X-CSRFToken': getCookie('csrftoken') // Embedded directly in a Django template
            },
        body: JSON.stringify(data_send)
        });
        if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            const table_content = document.getElementById('content')
            const expanse_list = document.getElementById('expanse_list')
            const expanse_list_amount = document.getElementById('expanse_list_amount')
            document.getElementById('profit_loss').classList.add('show')
            if (data['message']){
                Swal.fire({
                title: "Profit and Loss Statement",
                text: data['message'],
                icon: "error"
                }); window.addEventListener('click', ()=>{
                    window.location.reload()
                })
                
                return
            } else{
            table_content.replaceChildren()
            expanse_list.replaceChildren()
            expanse_list_amount.replaceChildren()
            data['expanse'].forEach((item)=>{
                const html = `<h3>${formatter.format(item.total)}</h3>`
                expanse_list_amount.insertAdjacentHTML('beforeend', html)
            })
            data['expanse'].forEach((item)=>{
                const html = `<h3 style="text-transform: capitalize;">${item.category__name}</h3>`
                expanse_list.insertAdjacentHTML('beforeend', html)
            })
            const rowHTML = `<h2 style="visibility: hidden;">Income</h2>
                                <h3>${formatter.format(data['total_sale']['sale'])}</h3>
                                <h3>0.00</h3>
                                <h3>${formatter.format(data['total_sale']['sale'])}</h3>
                            <h2 style="visibility: hidden;">Cost of Goods Sold</h2>
                                <h3>${formatter.format(data['total_sale']['cost'])}</h3>
                                <h3>${formatter.format(data['total_sale']['promotion'])}</h3>
                                <h3>${formatter.format(data['total_sale']['discount'])}</h3>
                                <h3>${formatter.format(Number(data['total_sale']['cost']) + Number(data['total_sale']['promotion']) + Number(data['total_sale']['discount']))}</h3>
                            `  
                table_content.insertAdjacentHTML("beforeend", rowHTML)
            }
            document.getElementById('total_expanse').innerHTML = formatter.format(data['total_expanse']['expanse'])
            document.getElementById('net_profit').innerHTML = formatter.format(data['net_profit'])
        } catch (error) {
        console.error('Fetch error:', error);}
}

document.getElementById('generate').addEventListener('click', ()=>{
    sale_transaction_report(start_date, end_date, '/report_management/generate-report/financial/generate/')})


