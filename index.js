const express = require('express');

//To import morgan into my package
morgan = require('morgan');
//This ariable is what I will use to route my HTTP request and responses
const app = express();
//Invoke Morgan middleware function
app.use(morgan("common"));
// Data Top Ten Movies
const movies = [{

        title: " The Shining",
        director: "Stanley Kubrik",
        genres: "Psychological Horror",
    },
    {
        title: "Apocalypse Now",
        director: "Francis Ford Coppola",
        genres: "Epic Psychological",
    }, {
        title: "Taxi Driver",
        director: "Martin Scorsese",
        genres: "Drama Thriller",
    }, {
        title: "Inception",
        director: "Christopher Nolan",
        genres: "Fition Action",
    }, {
        title: "Super Bad",
        director: "Greg Mottola",
        genres: "Comedy",
    }, {
        title: "The Big Lewosky",
        director: "Joel David Coen",
        genres: "Comedy",
    }, {
        title: "Raiders Of The Lost Arc",
        director: "Steven Spielberg",
        genres: "Action-Adventure",
    }, {
        title: "Goodfellas",
        director: "Martin Scorsese",
        genres: "Crime",
    }, {
        title: "Eyes Wide Shut",
        director: "Stanley Kubrick",
        genres: "Drama",
    }, {
        title: "The Godfather",
        director: "Francis Ford Coppola",
        genres: "Crime",
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
    res.json(movies);
});

// Gets the data about a single movie, by title
app.get('/movies/:title', (req, res) => {
    res.json(
        movies.find((movie) => {
            return movie.title === req.params.title;
        })
    );
});

app.get('/movies/genres/:genres', (req, res) => {
    res.send('Successful GET request returning a description of the genre');
});

app.get('/movies/directors/:name', (req, res) => {
    res.send('Successful GET request returning a description of the Director');
});

app.post('/users', (req, res) => {
    res.send('Registration succesful!');
});

app.post('/users/:username', (req, res) => {
    res.json(
        'The user: ' + req.params.username + ' ' + 'was successfully updated'
    );
});

app.patch('/users/:username/favourites/:title', (req, res) => {
    res.json('Movie:' + req.params.title + ' ' + 'was added to favourites. ');
});

app.delete('/users/:username', (req, res) => {
    res.json('User' + req.params.username + ' ' + 'was deleted.');
});

app.delete("/users/:username/favorites/:title", (req, res) => {
    res.send("Successful DELETE request for favorite movies");
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