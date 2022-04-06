const plan = document.getElementById("plan-container")
const tasks = document.getElementById("task-grid")
const subjects = document.getElementById("subjects-grid")
const faculty = document.getElementById("faculty-grid")
const settings = document.getElementById("settings")
function showhide(x, y){
    if(x.style.opacity == '0'){
        x.style.opacity = '1'
        tasks.style.opacity = '0'
		setTimeout(function () {
			x.style.display = y
			tasks.style.display = 'none'
		}, 150)
    }
    else{
       	x.style.opacity = '0'
        tasks.style.opacity = '1'
		setTimeout(function () {
			x.style.display = 'none'
			tasks.style.display = 'grid'
		}, 150)}}

