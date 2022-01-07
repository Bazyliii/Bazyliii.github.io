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


fetch(`https://api.allorigins.win/get?url=${encodeURIComponent('http://www.weeia.p.lodz.pl/dla-studentow/plany-zajec/studia-stacjonarne-plany-zajec/')}`)
  .then(response => {
    if (response.ok) return response.json()
    throw new Error('Network response was not ok.')
  })
  .then(data => {
    var data = (data.contents);
    var miesiace = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'sep', 'aug', 'dec', 'oct', 'nov'];
    rok = new Date().getFullYear().toString().substr(-2);
    rokprzod = parseInt(rok) + 1;
    rokwstecz = parseInt(rok) - 1;
    rokk = [rokwstecz, rok, rokprzod];
    for (i = 0; i < 12; i++) {
      for (j = 1; j <= 31; j++) {
        for (k = 0; k < 3; k++) {
          position2 = data.match("wgrane_pliki/" + rokk[k] + miesiace[i] + j + ".pdf");
          if (position2 != null) {
            link = "http://www.weeia.p.lodz.pl/" + position2 + "#page=5";
            document.getElementById("planlekcji").src = link;


          }
        }
      }
    }
  });

function Plan() {
  window.open(link, 'newwindow', 'width=1200,height=600');
}
/*
    function showhide() {
        var x = document.getElementById("plan");
        var tab = ["tab1","tab2","tab3","tab4","tab5","tab6","tab7","tab8"];
        if (x.style.opacity === "1") {
          x.style.opacity = "0";
          for(i=0;i<=7;i++){
            y = document.getElementById(tab[i]);
          y.style.opacity = "1";
          y.style.pointerEvents = "auto";
          }
        } else {
          x.style.opacity = "1";
          for(i=0;i<=7;i++){
            y = document.getElementById(tab[i]);
          y.style.opacity = "0";
          y.style.pointerEvents = "none";
          }
        }
      }
*/