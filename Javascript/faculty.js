/*const wydzialy = [
    'Centrum E-Learningu', 1
    'BAIS', 2
    'BiNoŻ', 3 
    'Wydział chemiczny',4 
    '',5 
    'Centrum Sportu',7 
    'FTIMS',8 
    '',9
    'KGP',10
    '',11
    'Port',12
    'WIPOS',13
    'WOIZ',14
    'WTMiWT'15
]
const linkiWydzialy = [
    'https://weeia.edu.p.lodz.pl/auth/mnet/jump.php?hostid=4',1
    'https://weeia.edu.p.lodz.pl/auth/mnet/jump.php?hostid=9',2
    'https://weeia.edu.p.lodz.pl/auth/mnet/jump.php?hostid=17',3
    'https://weeia.edu.p.lodz.pl/auth/mnet/jump.php?hostid=11',4
    '',5
    '',6
    'https://weeia.edu.p.lodz.pl/auth/mnet/jump.php?hostid=4&wantsurl=%2Fcourse%2Findex.php%3Fcategoryid%3D31',7
    'https://weeia.edu.p.lodz.pl/auth/mnet/jump.php?hostid=3',8
    '',9
    'https://weeia.edu.p.lodz.pl/auth/mnet/jump.php?hostid=6',10
    '',11
    'https://weeia.edu.p.lodz.pl/auth/mnet/jump.php?hostid=19',
    'https://weeia.edu.p.lodz.pl/auth/mnet/jump.php?hostid=13',
    'https://weeia.edu.p.lodz.pl/auth/mnet/jump.php?hostid=10',
    'https://weeia.edu.p.lodz.pl/auth/mnet/jump.php?hostid=7'
]
const ikonyWydzialy = [
    `<i class="fa-solid fa-gears"></i>`,
    `<i class="fa-solid fa-chart-area"></i>`,
    `<i class="fa-solid fa-plug-circle-plus"></i>`,
    `<i class="fa-solid fa-laptop-code"></i>`,
    `<i class="fa-solid fa-atom"></i>`,
    `<i class="fa-solid fa-language"></i>`,
    `<i class="fa-solid fa-mobile-retro"></i>`
]

const facultyGrid = document.getElementById('faculty-grid')
for(var i=0; i<wydzialy.length; i++){
    var newItem = document.createElement('div')
    newItem.classList.add('task')
    newItem.setAttribute('onclick',"window.location.href = '"+linkiWydzialy[i]+"'")
    newItem.innerHTML = ikonyWydzialy[i] + wydzialy[i]
    facultyGrid.appendChild(newItem)
}
*/


fetch("Javascript/data.json") 
	.then(response => response.json()) 
	.then(parsed => {
const subjectsGrid = document.getElementById('faculty-grid')
for(var i=0; i<parsed.wydzialy.length; i++){
    var newItem = document.createElement('div')
    newItem.classList.add('task')
    newItem.setAttribute('onclick',"window.location.href = '"+parsed.wydzialy[i].link+"'")
    newItem.innerHTML = parsed.wydzialy[i].ikona + parsed.wydzialy[i].nazwa
    subjectsGrid.appendChild(newItem)
    }
})
