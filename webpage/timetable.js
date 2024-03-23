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
let touchstartX = 0
let touchendX = 0
const minSwipeDistance = 100

fetch("https://raw.githubusercontent.com/Bazyliii/Bazyliii.github.io/main/plan6AiSR4.json")
	.then((response) => response.json())
	.then((data) => {
		let lol = 1
		const weekData = data.filter((element) => element.Day === weekNumber - lol)
		processData(weekData)

		// previousButton.addEventListener("click", () => {
		// 	lol += 1
		// 	const weekData = data.filter((element) => element.Day === weekNumber - lol)
		// 	processData(weekData)
		// })

		// nextButton.addEventListener("click", () => {
		// 	lol -= 1
		// 	const weekData = data.filter((element) => element.Day === weekNumber - lol)
		// 	processData(weekData)
		// })

		document.addEventListener("touchstart", (e) => {
			touchstartX = e.changedTouches[0].screenX
		})

		document.addEventListener("touchend", (e) => {
			touchendX = e.changedTouches[0].screenX
			const distance = Math.abs(touchendX - touchstartX)
			if (distance >= minSwipeDistance) {
				if (touchendX < touchstartX) {
					lol -= 1
					const weekData = data.filter((element) => element.Day === weekNumber - lol)
					processData(weekData)
				}
				if (touchendX > touchstartX) {
					lol += 1
					const weekData = data.filter((element) => element.Day === weekNumber - lol)
					processData(weekData)
				}
			}
		})
	})
