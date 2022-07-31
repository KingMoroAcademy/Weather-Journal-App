/* Global Variables */
 const 
    apiKey = '&appid=186dc4a57f55e35aa8c3fac7c5eca036&units=imperial', // Personal API Key for OpenWeatherMap API
    // full url example: https://api.openweathermap.org/data/2.5/weather?zip=${zip}&appid=${apiKey}&units=imperial
    generate = document.querySelector("#generate"), // get the button
    resultsBox = document.querySelector(".resultsContainer"), // get the results container
    dateResult = document.querySelector("#date"), // the result of user usage date
    feelingResult = document.querySelector("#content"), // the result of user feelings
    tempResult = document.querySelector("#temp"); // the result temp from the user area

/* functions */
function getTheDate() { // Get the date Dynamically when user click the generate button
    const 
        d = new Date(),
        newDate = d.getMonth()+1 +'.'+ d.getDate()+'.'+ d.getFullYear(); // getMonth is 0 indexed so we added +1
    return newDate;
}

/* Function to GET Web API Data (The temperature)*/
async function getTheTemp(zip) { // get the tempterature from outside api using apiKey and user input zipcode
    if(isNaN(zip) || zip.length !== 5) {
        const tempInner = "<span class = 'wrong'>Sorry! you need to enter a valid zipcode!!</span>";
        return tempInner;
    } else {
        try {
            const 
                fetchUrl = `https://api.openweathermap.org/data/2.5/weather?zip=${zip}${apiKey}`, // use the zip and apiKey to fetch api url to get the current weather data.
                response = await fetch (fetchUrl), // we used fetch to get the data from the api url, and await to wait for the api to respond because it may be overloaded or taking time get the needed data. and to use the await keyword we need to use async in the containing function (in the event listener).
                convertedData = await response.json(), // then we wait for data and convert the coming streaming data using json() and save it in a variable.
                tempInner = convertedData.main.temp; // save the temperature in a variable to send later to our server.
            return tempInner;
        } catch (err) {
            console.log("Error: ", err); // log any error if happen
        }
    }
}

function getTheFeelings() { // get the feeling function
    const feelings = document.querySelector("#feelings").value;
    if (feelings.length === 0) {
        feelingResult.classList.remove("show");
        feelingResult.classList.add("hide");
        const userFeelings = "";
        return userFeelings;
    } else {
        feelingResult.classList.remove("hide");
        feelingResult.classList.add("show");
        const userFeelings = feelings;
        return userFeelings;
    }
}

/* Function to POST data */
async function thePostData(url, data = {}) { // excuting post route to add the data from the fetched api data on client side to the serverside endpoint
    await fetch (url, {
        method: "POST",
        credentials: "same-origin",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });
}

/* Function to GET Project Data */
async function retrieveData () { // initialize the fetch data function from our server function
    const serverRes = await fetch ("/all");
    try {
        const processedData = await serverRes.json(); // wait for the data to be transformed into json
        // update the UI with the fetched data from our server endpoint
        dateResult.innerHTML = `Current Date: ${processedData.date}`; // put the date in the results box
        feelingResult.innerHTML = `Feeling: ${processedData.content}`; // Put the Feelings in the results box
        let finalTemp = processedData.temp;
        if(isNaN(finalTemp)) {
            finalTemp;
        } else {
            finalTemp = Math.round(processedData.temp);
            finalTemp += " Fahrenheits";
        }
        tempResult.innerHTML = `Temperature: ${finalTemp}`; // Put the temperature in the results box
    } catch (err) {
        console.log("Error: ", err);
    }
}

async function asyncData(e) { /* Function called by event listener */
    e.preventDefault(); // used to prevent dafault action from happening.
    const 
        theNewDate = getTheDate(), // generate the date
        zip = document.querySelector("#zip").value, // get the user zipcode
        temp = await getTheTemp(zip), // use the userzipcode to get the temp
        userFeeling = getTheFeelings(); // get the user feelings
    thePostData("/addUserWeatherData", {date: theNewDate, temp: temp, content: userFeeling});
    retrieveData(); // get all the final processed data from our server endpoint and add it to the UI
    resultsBox.classList.add("show"); // Show the ressults box
}

generate.addEventListener("click", asyncData); // event listener on the generate button with async function on click event