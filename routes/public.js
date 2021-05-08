//this should serve any pages that can be viewed while not logged in.

const express = require('express');
const movieData = require('../data/movies');
const discussionData = require('../data/discussions');
const router = express.Router();

//HomePage
router.get('/', async (req, res) =>{

    //Fetch Trending Movies from DB

    let trendingMovies;
    let recentDiscussions;

    try {
        trendingMovies = await movieData.GetTrendingMovies();
        recentDiscussions = await discussionData.GetRecentDiscussions();
    } catch (error) {
        console.log(error);
        //deal with error somehow
    }
    

    let pageData = {
        trending: trendingMovies,
        recentDiscussions: recentDiscussions
    }

    res.render("home", {data: pageData});
})


router.get('/movie/:movieID', async(req, res)=>{

    let movie;
    let discussions;

    try {
        movie = await movieData.GetMovieByID(req.params.movieID);
        discussions = await discussionData.GetDiscussionsByMovieID(req.params.movieID); 
    } catch (error) {
        console.log(error);
    }
    

    let pageData = {
        movie: movie,
        discussions: discussions
    }

    res.render('publicMovie', {data: pageData});

});

module.exports = router;