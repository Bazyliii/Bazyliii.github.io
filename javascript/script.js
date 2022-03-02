//Dropdown menu
document.addEventListener("click", e => {
	const isDropdownButton = e.target.matches("[data-dropdown-button]")
	if (!isDropdownButton && e.target.closest("[data-dropdown]") != null) return false
	let currentDropdown
	if (isDropdownButton) {
		currentDropdown = e.target.closest("[data-dropdown]")
		currentDropdown.classList.toggle("active")
	}
	document.querySelectorAll("[data-dropdown].active").forEach(dropdown => {
		if (dropdown === currentDropdown) return
		dropdown.classList.remove("active")
	})
});
//Fetching i wyświetlanie planu
fetch(`https://api.allorigins.win/get?url=${encodeURIComponent('http://www.weeia.p.lodz.pl/dla-studentow/plany-semestru-letniego/studia-stacjonarne/')}`)
	.then(response => {
		if (response.ok) return response.json()
		throw new Error('Network response was not ok.')
	})
		.then(data => {
			currentYear = parseInt(new Date().getFullYear().toString().substr(-2));
			years = [currentYear - 1, currentYear, currentYear + 1];
			for(i=0; i<3; i++){
				linkPart = data.contents.split("href='wgrane_pliki/" + years[i]).pop();
				linkPart2 = "http://www.weeia.p.lodz.pl/wgrane_pliki/" + years[i] + linkPart.substring(0, linkPart.indexOf("'")).split("\n").filter(item => item !== '');
			if(linkPart2.length<100){
				link=linkPart2
			}
		} 
		const proxy = "https://wikamproxy.herokuapp.com/";
		const url = proxy + link;
		(async function () {
			pdfjsLib.GlobalWorkerOptions.workerSrc = "//mozilla.github.io/pdf.js/build/pdf.worker.js";
			const doc = await pdfjsLib.getDocument(url).promise;
			let currentPage = 16;
			await getPage(doc, currentPage);
		})();
		async function getPage(doc, pageNumber) {
			if (pageNumber >= 1 && pageNumber <= doc._pdfInfo.numPages) {
				const page = await doc.getPage(pageNumber);
				const viewport = page.getViewport({
					scale: 3
				});
				const canvas = document.getElementById("canvas");
				const context = canvas.getContext("2d");
				const loading = document.querySelector('.loading-dots');
				const tab2 = document.querySelector('#tab2');
				const tab2i = document.querySelector('.calendar');
				canvas.height = viewport.height + 100;
				canvas.width = viewport.width;
				loading.style.display = "none";
				tab2.style.pointerEvents = "auto";
				tab2i.style.opacity = "1";
				return await page.render({
					canvasContext: context,
					viewport: viewport
				}).promise;
			} else {
				console.log("Error!");
			}
		}
	})
//Fetching przedmiotów
fetch(`https://api.allorigins.win/get?url=${encodeURIComponent('https://weeia.edu.p.lodz.pl/course/index.php?categoryid=2')}`)
	.then(response => {
		if (response.ok) return response.json()
		throw new Error('Network response was not ok.')
	})
	.then(data => {
		strippedString = data.contents.replace(/(<([^>]+)>)/gi, "").split("Kategorie przedmiotów:").pop();;
		filteredItems = strippedString.substring(0, strippedString.indexOf("Przeszukaj przedmioty")).replace(/    /gi, "").split("\n").filter(item => item !== '');
		try {
			for (i = 0; i < filteredItems.length; i++) {
				for (j = i + 1; j < filteredItems.length; j++) {
					firstElement = filteredItems[i];
					secondElement = filteredItems[j];
					result = secondElement.includes(firstElement)
					if (result == true) {
						filteredItems.splice(j, 1);
						if (j != 0) {
							j--
						}
					}
				}
			}
		} catch (e) {}
		console.log(filteredItems)
	});
function showhide() {
	let plan = document.getElementById("planlekcji");
	let wrapper = document.querySelector(".wrapper");
	if (plan.style.opacity === "1") {
		plan.style.opacity = "0";
		plan.style.pointerEvents = "none";
		var delayInMilliseconds = 100;
		setTimeout(function () {
			plan.style.display = "none";
			wrapper.style.display = "grid";
		}, delayInMilliseconds);
	} else {
		plan.style.display = "block";
		plan.style.pointerEvents = "auto";
		wrapper.style.display = "none";
		setTimeout(function () {
			plan.style.opacity = "1";
		}, delayInMilliseconds);
	}
}


var dropdownMenuDiv = document.querySelector(".navbar");
var dropdownMenu = document.querySelector(".menu");
document.onclick = check;

function check(e) {
	var target = (e && e.target);
	if (!checkParent(target, dropdownMenuDiv)) {
		if (checkParent(target, dropdownMenu)) {
			if (dropdownMenuDiv.classList.contains("invisible")) {
				
				dropdownMenuDiv.classList.remove("invisible");
			} else {
				dropdownMenuDiv.classList.add("invisible");
			}
		} else {
			dropdownMenuDiv.classList.add("invisible");
		}
	}
}

function checkParent(t, elm) {
	while (t.parentNode) {
		if (t == elm) {
			return true;
		}
		t = t.parentNode;
	}
	return false;
}
