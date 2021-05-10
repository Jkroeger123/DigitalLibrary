//this should serve views that can only be viewed when logged in

const express = require('express');
const movieData = require('../data/movies');
const discussionData = require('../data/discussions');
const userData = require('../data/users');
const router = express.Router();

router.get('/', async(req, res) =>{
    
    let user = await userData.GetUserByUserName(req.session.user.username);

    //Fetch User Watchlist  
    let watchList = user.movieList;
    let movies = [];

    //Build Movie Object Array from array of movie IDs
    watchList.forEach(id => {
        movies.push(movieData.GetMovieByID(id));
    });

    //Fetch User Discussions
    let discussionList = user.userPosts;
    let discussions = [];

    //Build Discussion Object Array from array of discussion IDs
    discussionList.forEach(id => {
        discussions.push(discussionData.GetDiscussionByID(id));
    });


    let pageData = {
        watchList: movies,
        discussions: discussions,
        userData: user
    }

    res.render("userHome", {data: pageData});

})

router.get('/movie/:movieID', async (req, res) =>{
    let user = await userData.GetUserByUsername(req.session.user.username);
    let movie = await movieData.GetMovieByID(req.params.movieID);
    let discussions = await discussionData.GetDiscussionsByMovieID(req.params.movieID);

    let pageData = {
        movie: movie,
        discussions: discussions,
        userData: user
    }

    res.render('privateMovie', {data: pageData});
});

router.post('/watchlist/:movieID', async (req, res)=>{
    await userData.AddToWatchList(req.params.movieID, req.session.user.username);
});

router.post('/discussion/:movieID', async (req, res)=>{
    //TODO
});

router.post('/rate/:movieID', async (req, res)=>{
    await userData.RateMovie(req.params.movieID, req.body.rating, req.session.user.username);
});

module.exports = router;