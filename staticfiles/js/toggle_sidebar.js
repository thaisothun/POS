const sidebar_icon = document.getElementById('toggle-sidebar-icon')

function toggle_sidebar(){
    const sidebar = document.getElementById('sidebar')
    const activeelement = document.querySelectorAll('.active')
    activeelement.forEach(element=>{
        element.classList.remove('active')
    })
    sidebar.classList.toggle('close')
    sidebar_icon.classList.toggle('rotate')
}

sidebar_icon.addEventListener('click', toggle_sidebar)
