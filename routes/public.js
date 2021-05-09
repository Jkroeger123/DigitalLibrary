//this should serve any pages that can be viewed while not logged in.

const express = require('express');
const movieData = require('../data/movies');
const discussionData = require('../data/discussions');
const axios = require('axios');
const router = express.Router();
const API_KEY = "f800afc56a41eeb52666b5b8657cea5e";


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
            let {data} = await axios.get(`https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&language=en-US`);
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