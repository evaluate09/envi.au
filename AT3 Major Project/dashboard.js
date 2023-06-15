//-------------CONSTANTS-------------
const tasks = {
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
        2 : ["Cook a meal with leftover ingredients",10], //stir-fry it, salad it, roast it and sauce it, freeze it
        3 : ["Take a shower that is 4 minutes or less",15],
        4 : ["Buy funny fruit (e.g. Woolworth's Odd Bunch)",15],
        5 : ["Purchase second-hand instead of first-hand",15],

    },
    "2" : { 
        0 : ["Take public transport to work",15],
        1 : ["Buy seasonal produce",20], //https://www.sustainabletable.org.au/journal/seasonal-produce-guide 
        2 : ["Buy items that have the 'Made in Australia' tag",15],
        3 : ["Avoid buying any unnecessary foods (like treats)", 20],
        4 : ["Return an eligible container at a Return And Earn location",20],
        5 : ["Bring a reusable cup to an eligible cafe",15], //https://greencaffeen.com.au/
        
    },
    "3" : { 
        0 : ["Bike or walk to work",20],
        1 : ["Donate any unwanted items to a thrift shop (e.g. Vinnies)",30], //https://www.freecycle.org/
        2 : ["Purchase your weekly groceries from a farmer's market",30],
        3 : ["Choose a meat alternative for today",20],
        4 : ["Donate to an environmental charity",50],
        5 : ["Volunteer for an environmental charity",100],
        6 : ["Flush the toilet with reused water",30]
        
    }
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

function countTasks() {
    let count = []
    for (let i=0;i<Object.keys(tasks).length;i++) {
        count.push(Object.keys(tasks[`${i}`]).length) //count the number of tasks in the task dictionary
    }
    return count
}

const count = countTasks()

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

function generateNewTask(level, max) { //tasklevelcomp is the array[2] of array = [date,[],[]] from extracted tasks
    let randomNum = Math.floor(Math.random()*max)
    if (extractTaskStore()[Number(level)+1].every((e) => {return e == "1"})) { //if the tasks are maxed out
        document.getElementById(`level${level}c`).style.display = 'none'
        document.getElementById(`level${level}s`).style.display = 'none'
        return "You've completed/skipped every task on this level! Tasks reset daily." }
    else {
    while (extractTaskStore()[Number(level)+1][randomNum] == "1") { //if the task has already been completed
        randomNum = Math.floor(Math.random()*max)}
    }
    return [tasks[level][randomNum][0],tasks[level][randomNum][1],randomNum] 
}

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

async function weatherCall(city) {
    const response = await fetch(`http://api.weatherapi.com/v1/current.json?key=5d2d973a6fa2456eb1251816232704&q=${city}&aqi=yes`, {
        method: 'GET',
    });
    if (!response.ok) {
        return ["Error! Please try inputting your city again."]
    }
    const jsonData = await response.json();
    return jsonData;
    
};
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
    //FLAGGING
    //console.log(countTasks(),initialiseTasks(),extractTaskStore())

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
    const locationForm = document.getElementById("location-form")
    const locationInput = document.getElementById("location-input")
    const weatherText = document.getElementById("weather")
    const airqText = document.getElementById("airquality")
    let storedLocation = localStorage.getItem("location").split(',')
    let emissions = localStorage.getItem("emissions").split(',')
    if (emissions[0] == '') { //if not estimated
        document.getElementById("predicted").innerText = `Your annual CO2 emissions are ${emissions[1]}`
    } else { //if estimated
        document.getElementById("predicted").innerText = `Your predicted annual CO2 emissions are ${emissions[0]} tonnes.`

    }
    const airqIndex = {
        1 : "Good",
        2 : "Moderate",
        3 : "Unhealthy for sensitive groups",
        4 : "Unhealthy",
        5 : "Very unhealthy",
        6 : "Hazardous"
    }
    if (storedLocation.length == 1) { //if there is no city inputted
        locationForm.style.display = "inline"

        locationForm.addEventListener("submit", (e) => {
            console.log("uh")
            e.preventDefault
            let city = locationInput.value;
            if (storedLocation.length == 1) {
                storedLocation.push(city)
            } else {
                storedLocation[1] = city
            }
            localStorage.setItem("location",storedLocation)
            })
        }
        (async () => {
            let calledWeather = await weatherCall(storedLocation[1]) //[temperature (celsius), air quality]
            weatherText.innerText = `Temperature: ${calledWeather.current.temp_c}°C | Humidity: ${calledWeather.current.humidity}% | Condition: ${calledWeather.current.condition["text"]}`
            airqText.innerText = `Air quality: ${airqIndex[Number(calledWeather.current.air_quality["us-epa-index"])]} | Location: ${storedLocation[1]}`
            locationForm.style.display = "none"
        })()

}
    //STATS?? total points, how many 
    //Weather API = add a form that makes person enter their own state, catch any errors and notify them that they spelled the state wrong


//NAVIGATION BAR
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

if (localStorage.getItem("returning")) {
    dashboardSequence()
} else {
    document.getElementById("dashbox").style.display = "none"
    document.getElementById("welcome").innerHTML = "<br>"+ "Hi there! It seems like you're new here." + "<br><br>" + "Click the plant icon to go to the home page and create your profile.";
    document.getElementById("welcome").style.fontSize = "1.2vw"
}


