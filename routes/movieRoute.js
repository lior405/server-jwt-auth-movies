const express = require('express');
const router = express.Router();
const User = require('../models/user');
const passport = require('passport');
const jwt = require('jsonwebtoken');

const {getToken, COOKIE_OPTIONS, getRefreshToken, verifyUser} = require('../authenticate');

router.post("/saveMovie", verifyUser,(req,res,next) => {
    //res.send({title: req.body.title});
    const newMovie = {
        "title": req.body.title,
        "poster_path": req.body.poster_path,
        "overview": req.body.overview,
        "vote_average": req.body.vote_average,
        "release_date": req.body.release_date,
        "id": req.body.id
    }
    User.findById(req.user._id).then( (user) => {
        let movieIndex = -1;
        user.movies.findIndex( item => {
            if(item.id === req.body.id) { movieIndex = 1 }
        });

        if(movieIndex === -1) {
            user.movies.push(newMovie);
            user.save( (err,user) => {
                if(err){
                    res.statusCode = 500;
                    res.send(err);
                } else {
                    res.send({message: "added to db successfully."});
                }   
            }) 
        } else { res.send({message: "movie already saved!"})}
    }, 
    (err)=> next(err) 
    )
});

router.get("/favorites", verifyUser, (req, res, next) => {
    User.findById(req.user._id).then( (user) => {
        const favoriteMovieList = user.movies;
        // console.log(favoriteMovieList);
        res.send({movieList: favoriteMovieList});
    }, 
    (err)=> next(err)
    );
});


module.exports = router;