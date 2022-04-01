fetch(`https://api.allorigins.win/get?url=${encodeURIComponent('http://www.weeia.p.lodz.pl/dla-studentow/plany-semestru-letniego/studia-stacjonarne/')}`)
	.then(response => {
		if (response.ok) return response.json()
		throw new Error('Error!')
	})
		.then(data => {
			currentYear = parseInt(new Date().getFullYear().toString().substr(-2));
			years = [currentYear - 1, currentYear, currentYear + 1];
			for(i=0; i<3; i++){
				linkPart = data.contents.split("href='wgrane_pliki/" + years[i]).pop();
				linkPart2 = "http://www.weeia.p.lodz.pl/wgrane_pliki/" + years[i] + linkPart.substring(0, linkPart.indexOf("'")).split("\n").filter(item => item !== '');
			if(linkPart2.length<100){
				localStorage.setItem("link",linkPart2)
			}
		} 	
	})
	link = localStorage.getItem("link")
	const proxy = "https://wikamproxy.herokuapp.com/";
		const url = proxy + link;
		(async function () {
			pdfjsLib.GlobalWorkerOptions.workerSrc = "//mozilla.github.io/pdf.js/build/pdf.worker.js";
			const doc = await pdfjsLib.getDocument(url).promise;
			let currentPage = 15;
			await getPage(doc, currentPage);
		})();
		async function getPage(doc, pageNumber) {
			if (pageNumber >= 1 && pageNumber <= doc._pdfInfo.numPages) {
				const page = await doc.getPage(pageNumber);
				const viewport = page.getViewport({
					scale: 3
				});
				const canvas = document.querySelector("canvas")
				const context = canvas.getContext("2d")
				canvas.height = viewport.height
				canvas.width = viewport.width
				return await page.render({
					canvasContext: context,
					viewport: viewport
				}).promise;
			} else {
				console.log("Error!");
			}
		}
    const plan = document.getElementById("plan-container")
    const tasks = document.getElementById("task-grid")
	const subjects = document.getElementById("subjects-grid")
	const faculty = document.getElementById("faculty-grid")

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
		}, 150)
    }
}
