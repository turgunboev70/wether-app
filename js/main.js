const wrapper = document.querySelector(".wrapper")
const inputPart = wrapper.querySelector(".input-part")
const infoText = inputPart.querySelector(".info-txt")
const inputField = inputPart.querySelector("input")
const locationBtn = inputPart.querySelector("button")
const weatherIcon = document.querySelector(".weather-part img")
const backToHomeIcon = wrapper.querySelector("header i")
let api;

inputField.addEventListener("keyup", e => {
    if (e.key == "Enter" && inputField.value != "") {
        requestApi(inputField.value)
    }
})

locationBtn.addEventListener("click", () => {
    if (navigator.geolocation) {        // if browser support geolocation api
        navigator.geolocation.getCurrentPosition(onSuccess, onError)
    } else {
        alert("Your browser isn't support geolocation")
    }
})
function onSuccess(position) {
    const { latitude, longitude } = position.coords /// getting long and lat of user device from cords obj
    api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=b39650ed10a7cc52baaa57ae3694a236  `
    fetchData()
}

function onError(error) {
    infoText.innerHTML = error.message
    infoText.classList.add("error")
}

function requestApi(city) {
    api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=b39650ed10a7cc52baaa57ae3694a236`
    fetchData()
}

function fetchData() {
    infoText.innerHTML = "Getting weather details..."
    infoText.classList.add("pending")
    fetch(api).then(res => res.json()).then(result => weatherDetails(result))
}

function weatherDetails(info) {
    if (info.cod == "404") {
        infoText.innerHTML = `${inputField.value} isn't valid city name`
        infoText.classList.replace("pending", "error")
    } else {
        const city = info.name
        const country = info.sys.country
        const { id, description } = info.weather[0]
        const { feels_like, humidity, temp } = info.main;

        if (id == 800) {
            weatherIcon.src = "icons/clear.svg"
        } else if (id >= 200 && id <= 232) {
            weatherIcon.src = "icons/storm.svg"
        } else if (id >= 300 && id <= 321) {
            weatherIcon.src = "icons/rain.svg"
        } else if (id >= 801 && id <= 804) {
            weatherIcon.src = "icons/cloud.svg"
        } else if (id >= 600 && id <= 622) {
            weatherIcon.src = "icons/snow.svg"
        } else if (id >= 701 && id <= 781) {
            weatherIcon.src = "icons/haze.svg"
        }

        wrapper.querySelector(".temp .num").innerText = Math.floor(temp)
        wrapper.querySelector(".weather").innerText = description
        wrapper.querySelector(".location span").innerText = `${city}, ${country}`
        wrapper.querySelector(".temp .num-2").innerText = Math.floor(feels_like)
        wrapper.querySelector(".humidity span").innerText = `${humidity}%`

        infoText.classList.remove("pending", "error")
        wrapper.classList.add("active")
        console.log(info);

        
    }
}


backToHomeIcon.addEventListener("click", () => {
    wrapper.classList.remove("active")
    inputField.value = ""
})
