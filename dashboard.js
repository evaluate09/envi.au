//-------------CONSTANTS-------------
const tasks = { //tasks[level][number][0 = task , 1 = points]
    "0" : { 
        0 : ["Share a post online regarding the environment",5],
        1 : ["Turn off the lights when you leave the room",5],
        2 : ["Turn off the air conditioner/fans",5],
        3 : ["Take the stairs instead of the lift for today",10],
        4 : ["Use a metal straw in place of a plastic one",10],
        5 : ["Bring your own bag for shopping",5],
        6 : ["Unplug any outlets that are not in use", 5]
    },
    "1" : { //every-day  at home
        0 : ["Sort your trash into recyclables/non-recyclables",10],
        1 : ["Switch off your phone when it's not in use",10],
        2 : ["Cook a meal with leftover ingredients",10], 
        3 : ["Take a shower that is 4 minutes or less",15],
        4 : ["Buy funny fruit (e.g. Woolworth's Odd Bunch)",15],
        5 : ["Purchase second-hand instead of first-hand",15],

    },
    "2" : { 
        0 : ["Take public transport to work",15],
        1 : ["Buy seasonal produce",20], //
        2 : ["Buy items that have the 'Made in Australia' tag",15],
        3 : ["Avoid buying any unnecessary foods (like treats)", 20],
        4 : ["Return an eligible container at a Return And Earn location",20],
        5 : ["Bring a reusable cup to an eligible cafe",15], 
        
    },
    "3" : { 
        0 : ["Bike or walk to work",20],
        1 : ["Donate any unwanted items to a thrift shop (e.g. Vinnies)",30], 
        2 : ["Purchase your weekly groceries from a farmer's market",30],
        3 : ["Choose a meat alternative for today",20],
        4 : ["Donate to an environmental charity",50],
        5 : ["Volunteer for an environmental charity",100],
        6 : ["Flush the toilet with reused water",30]
        
    }
}
const navmsg = document.getElementById("navmsg");
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
const locationForm = document.getElementById("location-form")
const locationInput = document.getElementById("location-input")
const weatherText = document.getElementById("weather")
const airqText = document.getElementById("airquality")
const storedCity = localStorage.getItem("city")
const emissionsAverage = localStorage.getItem("emissionsAverage")
const emissionsCalculated = localStorage.getItem("emissionsCalculated")
const airqIndex = {
    1 : "Good",
    2 : "Moderate",
    3 : "Unhealthy for sensitive groups",
    4 : "Unhealthy",
    5 : "Very unhealthy",
    6 : "Hazardous"
}

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
//Counts the no. of tasks in the task dictionary - future scalability
function countTasks() {
    let count = []
    for (let i=0;i<Object.keys(tasks).length;i++) {
        count.push(Object.keys(tasks[`${i}`]).length)
    }
    return count
}
const count = countTasks()

//Reset all tasks to 0 (i.e. not complete)
function initialiseTasks() {
    let taskstore = [`${getDate()[0]}`]
    for (let i=0;i<4;i++) {
        taskstore.push([])
        for (j=0;j<count[i];j++) { //initialises the taskstorage array
            taskstore[i+1].push(0) //0 = not complete, 1 = completed
        }
    }
    return taskstore
}

//Necessary to extract and format the taskstore from localstorage
function extractTaskStore() { //turn a linear array e.g. [date,0,0,0,0,0,0,0,0] into [date,[0,0],[0,0]] etc.
    let tasks = localStorage.getItem("taskstore").split(',');
    let extractedTasks = [tasks[0],[],[],[],[]]
    let total = 0
    for (let i=1;i<count.length+1;i++) {
        for (let j=0; j<count[i-1]; j++) { //read the values of the local storage 
            total += 1
            extractedTasks[i].push(tasks[total])
        }
    } 
    return extractedTasks
}
//Generates a new task by factoring in the task's level and the max number
function generateNewTask(level, max) {
    let randomNum = Math.floor(Math.random()*max)
    if (extractTaskStore()[Number(level)+1].every((e) => {return e == "1"})) { //if the tasks are maxed out
        document.getElementById(`level${level}c`).style.display = 'none'
        document.getElementById(`level${level}s`).style.display = 'none'
        return "You've completed/skipped every task on this level! Tasks reset daily." }
    else {
    while (extractTaskStore()[Number(level)+1][randomNum] == "1") { //if the task has already been completed
        randomNum = Math.floor(Math.random()*max)} //keep generating numbers until a task is found which has not been completed
    }
    return [tasks[level][randomNum][0],tasks[level][randomNum][1],randomNum] 
}
//Displays the generated task to the html page
function displayNewTask(level) {
    let associatedText = document.getElementById(`level${level}`)
    let newTaskArray = generateNewTask(level,count[level])
    let extractedTasks = extractTaskStore()
    if (typeof newTaskArray === "string") { //If the newtask sees that all tasks have been completed
        associatedText.innerText = newTaskArray
        return [false] //then return false
    } else {
        associatedText.innerText = `${newTaskArray[0]} (${newTaskArray[1]} points)` //generates new tasks and displays them
        extractedTasks[Number(level)+1][newTaskArray[2]] = "1"
        return [true, newTaskArray[1],extractedTasks]
    }
}
//API call
async function weatherCall(city) {
    const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=5d2d973a6fa2456eb1251816232704&q=${city}&aqi=yes`, {
        method: 'GET',
    });
    if (!response.ok) {
        return ["Error! Please try inputting your city again."]
    }
    const jsonData = await response.json();
    return jsonData;
    
};
//MAIN FUNCTION
function dashboardSequence() {
    document.getElementById("totalpoints").innerText = `Total points: ${localStorage.getItem("points")}`
    document.getElementById("welcome").innerText = `Welcome back, ${localStorage.getItem("username")}! Earn points by completing daily tasks and help lessen your impact on the environment!`

    //DAILY RESET OF TASKS
    if (localStorage.getItem("taskstore").split(',')[0] != `${getDate()[0]}`) {
        localStorage.setItem("taskstore",initialiseTasks())
    }
    //GENERATE INITIAL TASKS
    let newTask = []
    for (let i=0;i<count.length;i++) {
        newTask.push(displayNewTask(i))
    }

    //COMPLETE/SKIP BUTTONS ON TASK LIST
    let taskbuttons = document.getElementsByClassName("taskbuttons");
    for (let singlebutton of taskbuttons) {
        singlebutton.addEventListener('click', (e) => {
            let elementID = e.target.id //e.g. level0c or level0s
            let buttonLevel = elementID[5]
            if (elementID[6] == 'c') { //if it is a complete button
                let points = Number(localStorage.getItem("points"))
                points += newTask[buttonLevel][1]
                localStorage.setItem("points", points)
                document.getElementById("totalpoints").innerText = `Total points: ${points}`
                for (let i=0;i<count.length;i++) {
                    newTask[i][2] = newTask[buttonLevel][2]
                } //ensures that all instances of the new task is the same (more of a bandaid fix though)
                localStorage.setItem("taskstore",newTask[buttonLevel][2])
            } 
            newTask[buttonLevel] = displayNewTask(buttonLevel)
        })
    }

    //Emissions display priority
    if (emissionsCalculated === null) { //if the state average is used
        document.getElementById("predicted").innerText = `Your annual CO2 emissions are ${emissionsAverage} tonnes`
    } else {  //if the accurate calculation has been provided
        document.getElementById("predicted").innerText = `Your estimated annual CO2 emissions are ${emissionsCalculated} tonnes.`
    }

    if (storedCity === null) { //if there is no city inputted
        locationForm.style.display = "inline" //show the form that allows you to input a city
        locationForm.addEventListener("submit", (e) => {
            e.preventDefault()
            let city = locationInput.value;

        (async () => { //fetch the weather api data
            let calledWeather = await weatherCall(city) //[temperature (celsius), air quality]
            if (calledWeather.length == 1) {
                weatherText.innerText = calledWeather[0]
            } else {
                localStorage.setItem("city",city)
                weatherText.innerText = `Temperature: ${calledWeather.current.temp_c}°C | Humidity: ${calledWeather.current.humidity}% | Condition: ${calledWeather.current.condition["text"]}`
                airqText.innerText = `Air quality: ${airqIndex[Number(calledWeather.current.air_quality["us-epa-index"])]} | Location: ${city}`
                locationForm.style.display = "none"
            }
            
        })()
    }) 
    }   else {
            (async () => {
                let calledWeather = await weatherCall(storedCity) //[temperature (celsius), air quality]
                if (calledWeather.length == 1) {
                    weatherText.innerText = calledWeather[0]
                } else {
                    weatherText.innerText = `Temperature: ${calledWeather.current.temp_c}°C | Humidity: ${calledWeather.current.humidity}% | Condition: ${calledWeather.current.condition["text"]}`
                    airqText.innerText = `Air quality: ${airqIndex[Number(calledWeather.current.air_quality["us-epa-index"])]} | Location: ${storedCity}`
                    locationForm.style.display = "none"
                }
                
            })()
    }
}

//-------------MAIN SEQUENCE-------------
if (localStorage.getItem("returning")) { //If the user is not new, show the dashboard
    dashboardSequence()
} else { //Otherwise, only show text that redirects new user to home page
    document.getElementById("dashbox").style.display = "none"
    document.getElementById("welcome").innerHTML = "<br>"+ "Hi there! It seems like you're new here." + "<br><br>" + "Click the plant icon to go to the home page and create your profile.";
    document.getElementById("welcome").style.fontSize = "1.2vw"
}

//-------------NAVIGATION BAR-------------
navmsg.innerHTML = timeOfDay(getDate()[1]);

//-------------SETTINGS-------------
settings.addEventListener("click", ()=> { //Change username
    overlay.style.display = "flex";
    document.getElementById("setting-username-form").addEventListener("submit", (e) => {
        e.preventDefault()
        localStorage.setItem("username", document.getElementById("setting-username-input").value)
        e.target.reset()
        location.reload();
    })
    document.getElementById("setting-state-form").addEventListener("submit", (e) => { //Change state
        e.stopImmediatePropagation()
        let state = document.getElementById("setting-state-input").value
        localStorage.setItem("state",state)
        localStorage.setItem("emissionsAverage",stateAverages[state])
        e.target.reset()
        location.reload();
    })
    document.getElementById("setting-city-form").addEventListener("submit", (e) => { //Change city
        e.preventDefault()
        let city = document.getElementById("setting-city-input").value
        localStorage.setItem("city",city)
        e.target.reset()
        location.reload();
        
    })
    document.getElementById("setting-emission-form").addEventListener("submit", (e) => { //Change calculated emissions amount
        e.preventDefault()
        let emissions = document.getElementById("setting-emission-input").value
        localStorage.setItem("emissionsCalculated",emissions)
        e.target.reset()
        location.reload();
    })
    document.getElementById("setting-reset").addEventListener("click", () => { //Wipe all data
        if (confirm("Are you sure you want to wipe your data?")) {
            localStorage.clear();
            location.reload();
        }
    })
})
close.addEventListener("click", ()=> { //leave settings
overlay.style.display = "none";
})
document.addEventListener("keydown", (e)=>{ //Leave settings
if (e.key === "Escape") {
    if (overlay.style.display == "flex") {
        overlay.style.display = "none"
    }
}
})