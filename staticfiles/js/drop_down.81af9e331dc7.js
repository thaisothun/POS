function dropdown(button_name,rotate_name){   
  const activeelement = document.querySelectorAll('.active')
  const element = document.getElementById(button_name)
  const rotate = document.getElementById(rotate_name)
  
  if (element.className === `${button_name} active`){
    element.classList.remove('active')
    rotate.classList.remove('active')
    return
  } 
  activeelement.forEach(elements=>{
    elements.classList.remove('active')
  })
  element.classList.toggle('active')
  rotate.classList.toggle('active')

  const sidebar = document.getElementById('sidebar')
  const sidebar_icon = document.getElementById('toggle-sidebar-icon')
  if (sidebar.classList.contains('close')){
    sidebar.classList.toggle('close')
    sidebar_icon.classList.toggle('rotate')
  }

}

  
