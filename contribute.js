function getDate() {
    let date = new Date();
    let day = date.toLocaleDateString();
    let time = date.toLocaleTimeString('it-IT');
    return [day, time];
}
//Determines the time of day (morning/afternoon/evening/night) based on the time
function timeOfDay(localtime) {
    let hour = Number(localtime[0] + localtime[1]);
    let output = [];
    if (hour <= 4) { //12am-4am: Night
        output = ["🌱", "Night"];
    }
    else if (hour >= 5 && hour <= 11) { //5am-11am: Morning
        output = ["🌷", "Morning"];
    }
    else if (hour >= 12 && hour <= 16) { //PM (can only be a or p)
        output = ["🌺", "Afternoon"];
    }
    else if (hour <= 21 && hour >= 17) { //5pm-9pm: Evening
        output = ["🌷", "Evening"];
    }
    else { //10pm-12pm: Night
        output = ["🌱", "Night"];
    }
    return `${output[0]} Good ${output[1]}!`;
};

const navmsg = document.getElementById("navmsg");
//Settings

const settings = document.getElementById("settings")
const overlay = document.getElementById("overlay")
const close = document.getElementById("close")
const stateAverages = { //average annual CO2 emissions per person by state in tonnes (AUS)
    "Australian Capital Territory": 3.2,
    "Northern Territory": 66.9,
    "New South Wales": 16.7,
    "Queensland": 25.1,
    "Southern Australia": 12.8,
    "Tasmania": 1.67,
    "Victoria": 17.4,
    "Western Australia": 34.4}
//setting if player is not returning change the settings so that it says "please make a user profile first on the home page"
settings.addEventListener("click", ()=> {
    overlay.style.display = "flex";
    document.getElementById("setting-username-form").addEventListener("submit", (e) => {
        e.preventDefault()
        localStorage.setItem("username", document.getElementById("setting-username-input").value)
        e.target.reset()
        location.reload();
    })
    document.getElementById("setting-state-form").addEventListener("submit", (e) => {
        e.stopImmediatePropagation()
        let state = document.getElementById("setting-state-input").value
        localStorage.setItem("state",state)
        localStorage.setItem("emissionsAverage",stateAverages[state])
        e.target.reset()
        location.reload();
        //use state vs calculated
    })
    document.getElementById("setting-city-form").addEventListener("submit", (e) => {
        e.preventDefault()
        let city = document.getElementById("setting-city-input").value
        localStorage.setItem("city",city)
        e.target.reset()
        location.reload();
        
    })
    document.getElementById("setting-emission-form").addEventListener("submit", (e) => {
        e.preventDefault()
        let emissions = document.getElementById("setting-emission-input").value
        localStorage.setItem("emissionsCalculated",emissions)
        e.target.reset()
        location.reload();
    })
    document.getElementById("setting-reset").addEventListener("click", () => {
        if (confirm("Are you sure you want to wipe your data?")) {
            localStorage.clear();
            location.reload();
        }
    })
})
close.addEventListener("click", ()=> {
overlay.style.display = "none";
})
document.addEventListener("keydown", (e)=>{
if (e.key === "Escape") {
    if (overlay.style.display == "flex") {
        overlay.style.display = "none"
    }
}
})
const offset = document.getElementById("offsetText");

navmsg.innerHTML = timeOfDay(getDate()[1]);

if (localStorage.getItem("emissionsAverage") === null && localStorage.getItem("emissionsCalculated") === null) {
    offset.innerText = "You haven't calculated your emissions yet. Click the plant icon and fill in the forms to do so!"
} else if (localStorage.getItem("emissionsCalculated") === null){
    offset.innerText = `Your state's (${localStorage.getItem("state")}) average CO2 emissions are ${localStorage.getItem("emissionsAverage")} tonnes per year.`
} else {
    offset.innerText = `Your predicted CO2 emissions are ${localStorage.getItem("emissionsCalculated")} tonnes per year.`
}
