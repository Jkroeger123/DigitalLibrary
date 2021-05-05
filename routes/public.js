//this should serve any pages that can be viewed while not logged in.

const express = require('express');
const movieData = require('../data/movies');
const discussionData = require('../data/discussions');
const router = express.Router();

//HomePage
router.get('/', async (req, res) =>{
    
    //Fetch Trending Movies from DB
    let trendingMovies = await movieData.GetTrendingMovies();
    let recentDiscussions = await discussionData.GetRecentDiscussons();

    let pageData = {
        trending: trendingMovies,
        recentDiscussions: recentDiscussions
    }

    res.render("home", {data: pageData});
})


router.get('/movie/:movieID', async(req, res)=>{

    let movie = await movieData.GetMovieByID(req.params.movieID);
    let discussions = await discussionData.GetDiscussionsByMovieID(req.params.movieID);

    let pageData = {
        movie: movie,
        discussions: discussions
    }

    res.render('publicMovie', {data: pageData});

});

module.exports = router;