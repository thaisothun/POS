const ctx1 = document.getElementById('chart_sale');
const now = new Date();
const last_month = new Date()
last_month.setMonth(last_month.getMonth()-1)
const daysThisMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
const dayOfMonth = now.getDate();
const days_remain = document.getElementById('days_remain')
days_remain.innerHTML = `${daysThisMonth - dayOfMonth} days left of this month`
new Chart(ctx1, {
    type: 'doughnut',
    data: {
        datasets: [{
        label: 'Days',
        data: [dayOfMonth, daysThisMonth-dayOfMonth],
        backgroundColor:['#CE2626','#7DAACB'],
        borderWidth: 2,
        borderColor: '#c1b7df',
      }]
    },
    options: {
        responsive: true,
    }
});

const pending_paid = document.getElementById('pending_paid').innerHTML
const pending_paid_3days = document.getElementById('pending_paid_3days')
const ctx2 = document.getElementById('chart_pending_paid')
new Chart(ctx2, {
    type: 'doughnut',
    data: {
        datasets: [{
        label: 'Pending Paid',
        data: [pending_paid, pending_paid_3days.innerHTML],
        backgroundColor:['#ad04cf','#CE2626'],
        borderWidth: 2,
        borderColor: '#c1b7df',
      }]
    },
    options: {
        responsive: true,
        }
});
const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const result = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i-1);
    result.push(daysOfWeek[d.getDay()]);
  }
 
const sale_trend_data = document.getElementById('sale_trend_data')
const ctx3 = document.getElementById('sale_trend')
const data = sale_trend_data.value.split(",")
new Chart(ctx3, {
    type: 'line',
    data: {
        labels: [result[6], result[5], result[4], result[3], result[2], result[1], result[0]],
        datasets: [{
        data: [data[0].replace('[',''),data[1],data[2],data[3],data[4],data[5],data[6].replace(']','')],
        fill: false,
        borderColor: 'rgb(255, 94, 0)',
    }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        spanGaps: true,
        plugins: {
            legend: { display: false }, // Hides the legend
            tooltip: { enabled: true }  // Hides tooltips on hover
                },
            scales: {
                x: { display: false }, // Hides x-axis and its grid/labels
                y: { 
                    ticks: {
                    color: 'white' // Color for Y-axis labels
                    } },  // Hides y-axis and its grid/labels
                },
            elements: {
            line: {
            tension: 0.3 // Smooths the line graphic
            }
        }
    }
});
  
shor= document.getElementById('short')
shor.innerHTML = `${daysThisMonth - dayOfMonth} days left to achieve short amount`
const data_dialy_sale_month = document.getElementById('daily_sale_month')
const daily_sale_month_label = document.getElementById('daily_sale_month_label')
const daily_sale_last_month = document.getElementById('daily_sale_last_month')
const daily_sale_last_month_label = document.getElementById('daily_sale_last_month_label')
const ctx4 = document.getElementById('chart_daily_sale_month')
const generateHexList = (num) => {
  return Array.from({ length: num }, () => 
    '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')
  );
};
new Chart(ctx4, {
    type: 'bar',
    data: {
        labels: daily_sale_month_label.value.replace('[','').replace(']','').split(','),
        datasets: [{
        label: last_month.toLocaleString('default', { month: 'short' }),    
        data: daily_sale_last_month.value.replace('[','').replace(']','').split(','),
        backgroundColor: generateHexList(31)},
        {
        label: now.toLocaleString('default', { month: 'short' }),    
        data: data_dialy_sale_month.value.replace('[','').replace(']','').split(','),
        backgroundColor: generateHexList(31)
        }]
    },
    options: {
        animation: {
            onComplete:()=>{
                deplayed: true;
            }
            },
        responsive: true,
        maintainAspectRatio: false,
        spanGaps: true,
        plugins: {
            legend: { display: false }, 
            tooltip: { enabled: true } 
                },
            scales: {
                x: { ticks: {
                    color: 'white' 
                    } }, 
                y: { 
                    ticks: {
                    color: 'white' 
                    } },  
                },
            elements: {
            line: {
            tension: 0.3 
            }
        }
    }
});

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

const sale_performance_option = document.getElementById('sale_performance_option')
sale_performance_option.addEventListener('change', async ()=>{
    if(sale_performance_option.value=='month'){
        location.reload()}
    else{
        const data_send = {option: sale_performance_option.value}
        try {
        const response = await fetch(`/sale/sale-transaction/sale-transaction-list/sale-performace/`, {
        method: 'POST',
        headers: {
            'X-CSRFToken': getCookie('csrftoken') // Embedded directly in a Django template
            },
        body: JSON.stringify(data_send)
        });
        if (!response.ok) throw new Error('Network response was not ok');
           const data = await response.json();
           document.getElementById('message').innerHTML = `${data['sale_performance']}% ${data['message']}`
           const sale_performance_chart = document.getElementById('chart')
           sale_performance_chart.replaceChildren()
           const html = `<canvas id="chart_daily_sale_month"></canvas>`
           sale_performance_chart.insertAdjacentHTML("beforeend", html)
           const ctx4 = document.getElementById('chart_daily_sale_month') 
           let deplayed
           new Chart(ctx4, {
    type: 'bar',
    data: {
        labels: data['labels'],
        datasets: [{
        label: data['data_last_label'],    
        data: data['data_last'],
        backgroundColor: generateHexList(31)},
        {
        label: data['data_current_lebal'],    
        data: data['data_current'],
        backgroundColor: generateHexList(31)
        }]
    },
    options: {
        animation: {
            onComplete:()=>{
                deplayed: true;
            }
            },
        responsive: true,
        maintainAspectRatio: false,
        spanGaps: true,
        plugins: {
            legend: { display: false }, 
            tooltip: { enabled: true } 
                },
            scales: {
                x: { ticks: {
                    color: 'white' 
                    } }, 
                y: { 
                    ticks: {
                    color: 'white' 
                    } },  
                },
            elements: {
            line: {
            tension: 0.3 
            }
        }
    }
});
        } catch (error) {
        console.error('Fetch error:', error);}
    }
})