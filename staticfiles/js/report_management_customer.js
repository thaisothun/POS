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
const membership = document.getElementById('selection').children[1]
const status = document.getElementById('selection').children[3]
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

start_date.disabled = true;
end_date.disabled = true;
membership.disabled = true;
status.disabled = true;

document.getElementById('filter').addEventListener('focus', ()=>{
    start_date.disabled = false;
    end_date.disabled = false;
    membership.disabled = false;
    status.disabled = false;
    start_date.value = `${current_year}-${current_month}-01`
    end_date.value = `${current_year}-${current_month}-${current_day}`
})
document.getElementById('all').addEventListener('focus',()=>{
    start_date.disabled = true;
    end_date.disabled = true;
    membership.disabled = true;
    status.disabled = true;
    start_date.value = ''
    end_date.value = ''
})

start_date.addEventListener('change', ()=>{
    const current_date = new Date(`${current_year}-${current_month}-${current_day}`);
    if (new Date(start_date.value) > current_date){
        Swal.fire({
            title: "Customer Report",
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
            title: "Customer Report",
            text: "Selected date can not before start date!",
            icon: "error"
            });
            window.addEventListener('click', ()=>{
                    location.reload()
                } )
    }})

async function sale_transaction_report(start_date, end_date, path){
    const option = document.querySelector('input[name="filter_option"]:checked').value;
    data_send = {start_date : start_date.value, end_date : end_date.value, option:option,membership:membership.value,status:status.value}
    if (option != 'all'){   
        document.getElementById('date').innerHTML = `From ${start_date.value} To ${end_date.value}`
    } else{
        document.getElementById('date').innerHTML = 'All Period'
    }
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
            console.log(data)
            const table_content = document.getElementById('table_content')
            if (data['message']){
                Swal.fire({
                title: "Customer Report",
                text: data['message'],
                icon: "error"
                });
                table_content.replaceChildren()
                return
            } else{
            table_content.replaceChildren()     
            data['item'].forEach(item=>{  
                const rowHTML = `<tr><td>${item.id}</td><td>${item.store__name}</td><td>${item.first_name}</td><td>${item.last_name}</td><td>${item.gender}</td><td>${item.phone_number1}</td><td style="text-transform: none;">${item.e_mail}</td><td>${item.membership}</td><td>${new Date(item.created_on).toLocaleString('en-us', option).replace(' at ', ', ')}</td><td>${item.status}</td><tr>`
                table_content.insertAdjacentHTML("beforeend", rowHTML)
            })
            }
        } catch (error) {
        console.error('Fetch error:', error);}
}

async function sale_transaction_report_excel(start_date, end_date, path){
    const table_content = document.getElementById('table_content')
    const option = document.querySelector('input[name="filter_option"]:checked').value;
    const category = document.getElementById('selection').children[1].value
    if (!table_content || table_content.rows.length == 0){
        Swal.fire({
            title: "Customer Report",
            text: "Please click generate report first!",
            icon: "error"
            });
            return
        }
    
    data_send = {start_date : start_date.value, end_date : end_date.value, option:option,membership:membership.value,status:status.value}
    try {
        const response = await fetch(path, {
        method: 'POST',
        headers: {
            'X-CSRFToken': getCookie('csrftoken') // Embedded directly in a Django template
            },
        body: JSON.stringify(data_send)
        });
        if (!response.ok) throw new Error('Network response was not ok');
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `customer_report${now.toLocaleString()}.xlsx`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        } catch (error) {
        console.error('Fetch error:', error);}
}

document.getElementById('generate').addEventListener('click', ()=>{
    sale_transaction_report(start_date, end_date, '/report_management/generate-report/people-customer/generate/')})

document.getElementById('excel').addEventListener('click', ()=>{
    sale_transaction_report_excel(start_date, end_date, '/report_management/generate-report/people-customer/excel/')})



