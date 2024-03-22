const weekNumber = new Date().getDay()
const contentWrapper = document.querySelector(".content")
const nextButton = document.getElementById("next")
const previousButton = document.getElementById("previous")

const processData = (weekData) => {
	contentWrapper.innerHTML = ""
	weekData.forEach((element) => {
		const newDiv = document.createElement("p")
		newDiv.textContent = element.SubjectName
		newDiv.style.gridRowStart = element.Start + 1
		newDiv.style.gridRowEnd = element.End + 1
		newDiv.className = "subject"
		contentWrapper.append(newDiv)
	})
}

fetch("https://raw.githubusercontent.com/Bazyliii/Bazyliii.github.io/main/plan6AiSR4.json")
	.then((response) => response.json())
	.then((data) => {
		let lol = 1
		const weekData = data.filter((element) => element.Day === weekNumber - lol)
		processData(weekData)

		previousButton.addEventListener("click", () => {
			lol += 1
			const weekData = data.filter((element) => element.Day === weekNumber - lol)
			processData(weekData)
		})

		nextButton.addEventListener("click", () => {
			lol -= 1
			const weekData = data.filter((element) => element.Day === weekNumber - lol)
			processData(weekData)
		})
	})
