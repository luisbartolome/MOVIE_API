const express = require('express');
const bodyParser = require('body-parser');
uuid = require("uuid");
//To import morgan into my package
const morgan = require('morgan');
//This ariable is what I will use to route my HTTP request and responses
const app = express();
// import mongoose
const mongoose = require('mongoose');
const Models = require('./models/models.js');

const Movies = Models.Movie;
const Users = Models.User;

mongoose.connect('mongodb://localhost:27017/test', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

//Serving static files middleware

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(morgan('common'));

// GET route located at the endpoint "/" that return a default textual respomse
app.get("/", (req, res) => {
    res.send("Welcome to my movie API!");
});

//return JSON object when at /movies
app.get('/movies', (req, res) => {
    Movies.find()
        .then((movies) => {
            res.status(200).json(movies);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

// GETS JSON movie info when looking for specific title
app.get('/movies/:Title', (req, res) => {
    Movies.findOne({ Title: req.params.Title })
        .then((movie) => {
            res.status(200).json(movie);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

//Return data about a genre (description) by name/title (e.g., "Drama")
app.get('/movies/genres/:Genre', (req, res) => {
    Movies.findOne({ 'Genre.Name': req.params.Genre })
        .then((genre) => {
            res.status(200).json(genre.Genre);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

//get info on director when looking for specific director
app.get('/movies/director/:Name', (req, res) => {
    Movies.findOne({ 'Director.Name': req.params.Name })
        .then((director) => {
            res.status(200).json(director.Director);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

// Get all users
app.get('/users', (req, res) => {
    Users.find()
        .then((users) => {
            res.status(200).json(users);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});
// Add Users
app.post('/users', (req, res) => {
    // check if a user with the username provided by the client already exists
    Users.findOne({ Username: req.body.Username })
        .then((user) => {
            if (user) {
                return res.status(409).send(req.body.Username + 'already exists');
            } else {
                Users.create({
                        Username: req.body.Username,
                        Password: req.body.Password,
                        Email: req.body.Email,
                        Birthday: req.body.Birthday,
                    })
                    .then((user) => {
                        //this callback, send a response back to the client that contains both a status code and the document (called “user”) just created
                        res.status(201).json(user);
                    })
                    .catch((error) => {
                        console.error(error);
                        res.status(500).send('Error: ' + error);
                    });
            }
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send('Error: ' + error);
        });
});

// Get a user by username
app.get('/users/:Username', (req, res) => {
    Users.findOne({ Username: req.params.Username })
        .then((user) => {
            res.json(user);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});
// Update a user's info, by username
/* We’ll expect JSON in this format
{
  Username: String,
  (required)
  Password: String,
  (required)
  Email: String,
  (required)
  Birthday: Date
}*/

app.put('/users/:username', (req, res) => {
    Users.findOneAndUpdate(
        //First parameter
        { Username: req.params.Username },
        //Second parameter
        {
            //SET new values that extracted from the request body (meaning that they come from a request sent by the user).
            $set: {
                Username: req.body.Username,
                Password: req.body.Password,
                Email: req.body.Email,
                Birthday: req.body.Birthday,
            },
        },
        //Third parameter
        { new: true }, // This line makes sure that the updated document is returned
        //Fourth parameter that itself have two parameters (any errors that might have occured + represents the document that was just updated )
        (err, updatedUser) => {
            if (err) {
                console.error(err);
                res.status(500).send('Error: ' + err);
            } else {
                res.json(updatedUser);
            }
        }
    );
});

// Add a movie to a user's list of favorites
app.post('/users/:Username/favorites/:MovieID', (req, res) => {
    Users.findOneAndUpdate({ Username: req.params.Username }, {
            $push: { FavoriteMovies: req.params.MovieID }
        }, { new: true }, // This line makes sure that the updated document is returned
        (err, updatedUser) => {
            if (err) {
                console.error(err);
                res.status(500).send('Error: ' + err);
            } else {
                res.json(updatedUser);
            }
        });
});

// “Allow users to remove a movie from their list of favorites” endpoint
app.delete('/users/:Username/favorites/:MovieID', (req, res) => {
    Users.findOneAndUpdate({ Username: req.params.Username }, {
            $pull: { FavoriteMovies: req.params.MovieID },
        }, { new: true }, // This line makes sure that the updated document is returned
        (err, updatedUser) => {
            if (err) {
                console.error(err);
                res.status(500).send('Error: ' + err);
            } else {
                res.json(updatedUser);
            }
        }
    );
});
// Delete a user by username
app.delete('/users/:Username', (req, res) => {
    Users.findOneAndRemove({ Username: req.params.Username })
        .then((user) => {
            if (!user) {
                res.status(400).send(req.params.Username + ' was not found');
            } else {
                res.status(200).send(req.params.Username + ' was deleted.');
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
    // Error Handling
    app.use((err, req, res, next) => {
        console.error(err.stack);
        res.status(500).send('Ups! Something is not working!');
    });
});

// determine the port to listen on by checking PORT first and giving it a value
const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`
        Your app is listening on port $ { port }
        `);
});