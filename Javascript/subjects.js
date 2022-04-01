fetch("Javascript/data.json") 
	.then(response => response.json()) 
	.then(parsed => {
const subjectsGrid = document.getElementById('subjects-grid')
for(var i=0; i<parsed.subjects.length; i++){
    var newItem = document.createElement('div')
    newItem.classList.add('task')
    newItem.setAttribute('onclick',"window.location.href = '"+parsed.subjects[i].link+"'")
    newItem.innerHTML = parsed.subjects[i].ikona + parsed.subjects[i].nazwa
    subjectsGrid.appendChild(newItem)
    }
})
