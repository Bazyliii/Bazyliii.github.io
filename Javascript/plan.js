var link
fetch(`https://api.allorigins.win/get?url=${encodeURIComponent('http://www.weeia.p.lodz.pl/dla-studentow/plany-semestru-letniego/studia-stacjonarne/')}`)
	.then(response => {
		if (response.ok) return response.json()
		throw new Error('Error!')})
		.then(data => {
			currentYear = parseInt(new Date().getFullYear().toString().substr(-2))
			years = [currentYear - 1, currentYear, currentYear + 1]
			for(i=0; i<3; i++){
				linkPart = data.contents.split("href='wgrane_pliki/" + years[i]).pop()
				linkPart2 = "http://www.weeia.p.lodz.pl/wgrane_pliki/" + years[i] + linkPart.substring(0, linkPart.indexOf("'")).split("\n").filter(item => item !== '')
			if(linkPart2.length<100){
			link = linkPart2
			}}
		})
		
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

