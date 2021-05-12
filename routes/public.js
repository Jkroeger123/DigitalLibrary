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

    let moviesObjects = [];

    try {
        trendingMovies = await movieData.GetTrendingMovies();

        for(id of trendingMovies)
        {
            let data = await movieData.GetTMDBMovie(id);
            moviesObjects.push(data);
        }

        recentDiscussions = await discussionData.GetRecentDiscussions();
    } catch (error) {
        console.log(error);
        //deal with error somehow
    }
    

    let pageData = {
        trending: moviesObjects,
        recentDiscussions: recentDiscussions
    }

    res.render("home", {data: pageData});
})


router.get('/movie/:movieID', async(req, res)=>{

    let movie;
    let discussions;
    let tmdbMovie;

    try {
        movie = await movieData.GetMovieByID(req.params.movieID);
        tmdbMovie = await movieData.GetTMDBMovie(req.params.movieID);
        discussions = await discussionData.GetDiscussionsByMovieID(req.params.movieID); 
        if(movie.averageRating == 0) movie.averageRating = "No Ratings Yet!";
    } catch (error) {
        console.log(error);
    }

    let pageData = {
        movie: movie,
        discussions: discussions,
        tmdbMovie: tmdbMovie
    }

    res.render('publicMovie', {data: pageData});

});

router.get('/discussion/:discussionID', async(req, res)=>{

    try {
        let discussion = await discussionData.GetDiscussionByID(req.params.discussionID);
        res.render('publicDiscussion', {data: discussion}); 
    } catch (error) {
        res.status(400);
        console.log(error);
    }

});

module.exports = router;