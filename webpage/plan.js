const day = ["pon", "wt", "sr", "czw", "pt"]

fetch("https://raw.githubusercontent.com/Bazyliii/Bazyliii.github.io/main/plan6AiSR4.json")
	.then((response) => response.json())
	.then((data) => {
		data.forEach((element) => {
			const mainElem = document.getElementById(day[element.Day])
			const newDiv = document.createElement("div")
			newDiv.appendChild(document.createTextNode(element.SubjectName))
			newDiv.style.gridColumnStart = element.Start + 1
			newDiv.style.gridColumnEnd = element.End + 1
			newDiv.className = "plan-elem"
			mainElem.appendChild(newDiv)
		})
	})
