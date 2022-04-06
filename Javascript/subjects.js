function profile(x){
    settings.style.transition= "opacity 150ms ease-in-out"
    createTabs(x)
    fetchPlan(x)
    showhide(settings, 'none')
    document.querySelector("body").style.overflow = "auto"
    localStorage.setItem("kierunek", x) 
}
if(localStorage.getItem("kierunek")!=null){
    showhide(settings, 'none')
    document.querySelector("body").style.overflow = "auto"
    x = localStorage.getItem("kierunek")
    createTabs(x)
    fetchPlan(x)
}
function createTabs(x){
    fetch("Javascript/data.json") 
	.then(response => response.json()) 
	.then(parsed => {
const subjectsGrid = document.getElementById('subjects-grid')
for(var i=0; i<parsed.faculty[x].subjects.length; i++){
    var newItem = document.createElement('div')
    newItem.classList.add('task', x)
    newItem.setAttribute('onclick',"window.location.href = '"+parsed.faculty[x].subjects[i].link+"'")
    newItem.innerHTML = parsed.faculty[x].subjects[i].icon + parsed.faculty[x].subjects[i].name
    subjectsGrid.appendChild(newItem)
    }
})}
function fetchPlan(x){
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
    fetch("Javascript/data.json") 
    .then(response => response.json()) 
    .then(parsed => {
    let currentPage = parsed.faculty[x].plan
const proxy = "https://wikamproxy.herokuapp.com/"
const url = proxy + link;
(async function () {
    pdfjsLib.GlobalWorkerOptions.workerSrc = "//mozilla.github.io/pdf.js/build/pdf.worker.js"
    const doc = await pdfjsLib.getDocument(url).promise
    await getPage(doc, currentPage)})()
async function getPage(doc, pageNumber) {
    if (pageNumber >= 1 && pageNumber <= doc._pdfInfo.numPages) {
        const page = await doc.getPage(pageNumber)
        const viewport = page.getViewport({
            scale: 3
        })
        const canvas = document.querySelector("canvas")
        const context = canvas.getContext("2d")
        canvas.height = viewport.height + 100
        canvas.width = viewport.width
        document.querySelector('.loading-dots').style.display = "none"
        document.getElementById("text").style.display = "block"
        document.querySelector('.fa-calendar-days').style.display = "block"
        document.getElementById("plan").style.pointerEvents = "auto"
        return await page.render({
            canvasContext: context,
            viewport: viewport
        }).promise
    } else {
        console.log("Error!")
    }}})})}