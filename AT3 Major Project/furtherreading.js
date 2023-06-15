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

let navmsg = document.getElementById("navmsg");
navmsg.innerHTML = timeOfDay(getDate()[1]);

const settings = document.getElementById("settings")
const overlay = document.getElementById("overlay")
const close = document.getElementById("close")

//setting if player is not returning change the settings so that it says "please make a user profile first on the home page"
settings.addEventListener("click", ()=> {
    overlay.style.display = "flex";
    document.getElementById("setting-username-form").addEventListener("submit", (e) => {
        e.preventDefault()
        localStorage.setItem("username", document.getElementById("setting-username-input").value)
        e.target.reset()
    })
    document.getElementById("setting-state-form").addEventListener("submit", (e) => {
        e.stopImmediatePropagation()
        let location = localStorage.getItem('location').split()
        let emissions = localStorage.getItem('emissions').split()
        localStorage.setItem("location", [document.getElementById("setting-state-input").value,location[1]])
        localStorage.setItem("emissions",[stateAverages[document.getElementById("setting-state-input").value],emissions[1]])
        e.target.reset()
        //use state vs calculated
    })
    document.getElementById("setting-city-form").addEventListener("submit", (e) => {
        e.preventDefault()
        let location = localStorage.getItem('location').split()
        localStorage.setItem("location", [location[0],document.getElementById("setting-city-input").value])
        e.target.reset()
        
    })
    document.getElementById("setting-emission-form").addEventListener("submit", (e) => {
        e.preventDefault()
        let emissions = localStorage.getItem('emissions').split()
        localStorage.setItem("emissions",[emissions[0],stateAverages[document.getElementById("setting-emission-input").value]])
        e.target.reset()
        //use state vs calculated
    })
    document.getElementById("setting-emission-form").addEventListener("submit", (e) => {
        e.preventDefault()
        let emissions = localStorage.getItem('emissions').split()
        localStorage.setItem("emissions",[emissions[0],stateAverages[document.getElementById("setting-emission-input").value]])
        e.target.reset()
        //use state vs calculated
    })
    document.getElementById("setting-reset").addEventListener("click", () => {
        if (confirm("Are you sure you want to wipe your data?")) {
            localStorage.clear();
            location.reload();
        }
        //use state vs calculated
    })
        //use state vs calculated
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