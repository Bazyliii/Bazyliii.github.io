
const loading = document.querySelector('.loading-dots');
const tab2 = document.querySelector('#tab2');
const tab2i = document.querySelector('.calendar');

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
fetch(`https://api.allorigins.win/get?url=${encodeURIComponent('http://www.weeia.p.lodz.pl/dla-studentow/plany-zajec-i-egzaminow/studia-stacjonarne-plany-zajec/')}`)
  .then(response => {
    if (response.ok) return response.json()
    throw new Error('Network response was not ok.')
  })
  .then(data => {
    months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'sep', 'aug', 'dec', 'oct', 'nov'];
    currentYear = parseInt(new Date().getFullYear().toString().substr(-2));
    years = [currentYear - 1, currentYear, currentYear + 1];
    for (i = 0; i < 12; i++) {
      for (j = 1; j <= 31; j++) {
        for (k = 0; k < 3; k++) {
          linkContent = data.contents.match("wgrane_pliki/" + years[k] + months[i] + j + ".pdf");
          if (linkContent != null) {
             link = "http://www.weeia.p.lodz.pl/" + linkContent;
          }
        }
      }
    }
    const proxy = "https://wikamproxy.herokuapp.com/";
    const url = proxy + link;
    (async function () {
      pdfjsLib.GlobalWorkerOptions.workerSrc = "//mozilla.github.io/pdf.js/build/pdf.worker.js";
      const doc = await pdfjsLib.getDocument(url).promise;
      let currentPage = 5;
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
        canvas.height = viewport.height;
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
//Fetching wydziałów
fetch(`https://api.allorigins.win/get?url=${encodeURIComponent('https://weeia.edu.p.lodz.pl')}`)
  .then(response => {
    if (response.ok) return response.json()
    throw new Error('Network response was not ok.')
  })
  .then(data => {
    console.log(data.contents)
  });






function showhide() {
  let plan = document.getElementById("planlekcji");
  let wrapper = document.querySelector(".wrapper");
  if (plan.style.display === "flex") {
    plan.style.display = "none";
      wrapper.style.display = "grid";
      wrapper.style.pointerEvents = "auto";
  } else {
    plan.style.display = "flex";
      wrapper.style.display = "none";
      wrapper.style.pointerEvents = "none";
    }
  }





