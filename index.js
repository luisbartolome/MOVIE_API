const express = require('express');

//To import morgan into my package
morgan = require('morgan');
//This ariable is what I will use to route my HTTP request and responses
const app = express();
//Invoke Morgan middleware function
app.use(morgan("common"));
// Data Top Ten Movies
let topMovies = [{

        title: " The Shining",
        director: "Stanley Kubrik",
        releaseDate: 1980,
    },
    {
        title: "Apocalypse Now",
        director: "Francis Ford Coppola",
        releaseDate: 1979,
    }, {
        title: "Taxi Driver",
        director: "Martin Scorsese",
        releaseDate: 1976,
    }, {
        tittle: "Inception",
        director: "Christopher Nolan",
        releaseDate: 2010,
    }, {
        tittle: "Super Bad",
        director: "Greg Mottola",
        releaseDate: 2007,
    }, {
        tittle: "The Big Lewosky",
        director: "Joel David Coen",
        releaseDate: 1998,
    }, {
        tittle: "Raiders Of The Lost Arc",
        director: "Steven Spielberg",
        releaseDate: 1981,
    }, {
        tittle: "Goodfellas",
        director: "Martin Scorsese",
        releaseDate: 1990,
    }, {
        tittle: "Eyes Wide Shut",
        director: "Stanley Kubrick",
        releaseDate: 1999,
    }, {
        tittle: "The Godfather",
        director: "Francis Ford Coppola",
        releaseDate: 1972,
    }
];

//Serving static files
app.use(express.static('public'));

// GET route located at the endpoint "/" that return a default textual respomse
app.get("/", (req, res) => {
    res.send("Welcome to my movie API!");
});
//GET route located at the endpoint "/documentation"
app.get("/documentation", (req, res) => {
    res.sendFile("public/documentation.html", { root: __dirname });
});
//Express GET route located at the endpoint "/movies" that return a JSON object containing data about my top ten movies
app.get("/movies", (req, res) => {
    res.json(topMovies);
});

app.get("/movies/:title", (req, res) => {
    res.send("Successful GET request returning movie title");
});

app.get("/directors", (req, res) => {
    res.send("Successful GET requestreturning list of directors");
});

app.post("/users", (req, res) => {
    res.send("Successful POST request for user register");
});

app.delete("/users", (req, res) => {
    res.send("Successful DELETE request for user unregister");
});

app.get("/users/:username/favorites", (req, res) => {
    res.send("Successful GET request returning favorite movies");
});

app.delete("/users/:username/favorites/:movie", (req, res) => {
    res.send("Successful DELETE request for favorite movies");
});

app.post("/login", (req, res) => {
    res.send("Successful POST request for user login");
});

// Error Handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("Ups! Something is not working!");
});

// determine the port to listen on by checking PORT first and giving it a value
const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`Your app is listening on port ${port}`);
});