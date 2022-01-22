
fetch(`https://api.allorigins.win/get?url=${encodeURIComponent('http://www.weeia.p.lodz.pl/dla-studentow/plany-zajec/studia-stacjonarne-plany-zajec/')}`)
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
          link = "http://www.weeia.p.lodz.pl/" + linkContent + "#page=5";
        }
      }
    }
  }
  const proxy ="http://127.0.0.1:8080/";
  const url = proxy + link;

(async function () {

    // Specified the workerSrc property
    pdfjsLib.GlobalWorkerOptions.workerSrc = "//mozilla.github.io/pdf.js/build/pdf.worker.js";

    // Create the PDF document
    const doc = await pdfjsLib.getDocument(url).promise;

    const minPage = 1;
    const maxPage = doc._pdfInfo.numPages;
    let currentPage = 5;

    // Get page 1
    await getPage(doc, currentPage);

    // Display the page number
    document.getElementById("pageNumber").innerHTML = `Page ${currentPage} of ${maxPage}`;

    // The previous button click event
    document.getElementById("previous").addEventListener("click", async () => {

        if (currentPage > minPage) {

            // Get the previous page
            await getPage(doc, currentPage--);

            // Display the page number
            document.getElementById("pageNumber").innerHTML = `Page ${currentPage} of ${maxPage}`;

        }

    });

    // The next button click event
    document.getElementById("next").addEventListener("click", async () => {

        if (currentPage < maxPage) {

            // Get the next page
            await getPage(doc, currentPage++);

            // Display the page number
            document.getElementById("pageNumber").innerHTML = `Page ${currentPage} of ${maxPage}`;

        }

    });

})();


async function getPage(doc, pageNumber) {

    if (pageNumber >= 1 && pageNumber <= doc._pdfInfo.numPages) {

        // Fetch the page
        const page = await doc.getPage(pageNumber);

        // Set the viewport
        const viewport = page.getViewport({ scale: 1.5 });

        // Set the canvas dimensions to the PDF page dimensions
        const canvas = document.getElementById("canvas");
        const context = canvas.getContext("2d");
        canvas.height = 576;
        canvas.width = 1263;

        // Render the PDF page into the canvas context
        return await page.render({
            canvasContext: context,
            viewport: viewport
        }).promise;

    } else {
        console.log("Please specify a valid page number");
    }

}


})