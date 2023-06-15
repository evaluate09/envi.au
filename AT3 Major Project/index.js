//-------------VARIABLES-------------
const usernameForm = document.getElementById("username-form");
const usernameInput = document.getElementById("username-input");
const locationForm = document.getElementById("location-form");
const locationInput = document.getElementById("location-input");
const welcome = document.getElementById("welcome");
const welcome2 = document.getElementById("welcome2");
const externalCalculator = document.getElementById("external-calc");
const stateAverageButton = document.getElementById("state-average");
const calcAverageForm = document.getElementById("calcaverage-form");
const calcAverageInput = document.getElementById("calcaverage-input");
const stateAverages = { //average annual CO2 emissions per person by state in tonnes (AUS)
    "Australian Capital Territory": 3.2,
    "Northern Territory": 66.9,
    "New South Wales": 16.7,
    "Queensland": 25.1,
    "Southern Australia": 12.8,
    "Tasmania": 1.67,
    "Victoria": 17.4,
    "Western Australia": 34.4}
//-------------FUNCTIONS-------------
//Returns date and time as an array
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
function completeForms() {
    welcome.innerHTML = `Hey, ${localStorage.getItem("username")}!` + "<br><br>" + `You've earned ${localStorage.getItem("points")} points.` + "<br>" 
    welcome2.innerHTML =  "Use the navigation bar to go to your dashboard and complete tasks to get more points!";
    externalCalculator.style.display = "none";
    stateAverageButton.style.display = "none";
    calcAverageForm.style.display = "none";
    usernameForm.style.display = "none";
}
//------Body Div------
//Determines whether the user has inputted a username (necessary for data to be stored)
function usernameEstablished() { //set a limit of 1-20 characters
    if (!localStorage.getItem("returning")) {
        document.getElementById("welcome").innerHTML = "<br>"+ "Hi there! It seems like you're new here." + "<br><br>" + "Enter a username below to get started.";
    }
    else {
        completeForms();
    };
};
//-------------MAIN PAGE-------------
//------Navigation Bar------
//Navigation Message
const navmsg = document.getElementById("navmsg");
navmsg.innerHTML = timeOfDay(getDate()[1]);
//Settings
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

locationForm.style.display = "none";
usernameEstablished();
usernameForm.addEventListener("submit", (e) => {
    e.preventDefault();
    localStorage.setItem("username", usernameInput.value);
    localStorage.setItem("returning", true)
    localStorage.setItem("points",0)
    localStorage.setItem("taskstore",[getDate()[0]])
    e.target.reset()
    welcome.innerHTML = `Welcome ${localStorage.getItem("username")}!`;
    usernameForm.style.display = "none";
    locationForm.style.display = "inline-block";
  });
locationForm.addEventListener("submit", (e) => {
    e.preventDefault();
    localStorage.setItem("location", locationInput.value);
    welcome.innerHTML = "Finally, let's calculate your carbon footprint." + "<br>" +"You can use your state's average.";
    welcome2.innerHTML = "Or you can calculate it below and enter the number you got in tonnes.";
    locationForm.style.display = "none";
    externalCalculator.style.display = "inline-block";
    stateAverageButton.style.display = "inline-block";
    calcAverageForm.style.display = "flex";
});
stateAverageButton.addEventListener("click", () => {
    localStorage.setItem("emissions",[stateAverages[localStorage.getItem("location")],""])
    completeForms();
});
calcAverageForm.addEventListener("submit", (e) => {
    e.preventDefault();
    localStorage.setItem("emissions", ["",calcAverageInput.value]); 
    completeForms();
});

