const 
    projectData = {}, // Setup empty JS object to act as endpoint for all routes
    express = require("express"), // Require Express to run server and routes
    app = express(), // Start up an instance of app
    bodyParser = require("body-parser"), /* Dependencies */
    cors = require("cors"), // Cors for cross origin allowance
    PORT = process.env.PORT || 8000; // Setup PORT

app.use(bodyParser.urlencoded({ extended: false })); /* Middleware | Here we are configuring express to use body-parser as middle-ware.*/ 
app.use(bodyParser.json());
app.use(cors()); // using cors
app.use(express.static('website')); // Initialize the main project folder

app.listen(PORT, (error) => { // Setup the server and show errors
    if(error) {
        console.log("There was a problem");
        return;
    }
    console.log(`Server is running on port: ${PORT}`);
});

// Initialize all route with a callback function

// Get Route
app.get("/all", (req, res) => res.send(projectData));

// Post Route to add an entry to the project endpoint
app.post("/addUserWeatherData", (req, res) => {
    projectData.date = req.body.date,
    projectData.temp = req.body.temp,
    projectData.content = req.body.content
    res.end(); // or res.send - the same result to tell the server that's it.
});