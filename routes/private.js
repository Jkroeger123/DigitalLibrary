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
    for(id of watchList)
    {
        let mov = await movieData.GetTMDBMovie(id);
        movies.push(mov);
    }

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

    let user;
    let movie;
    let discussions;
    let tmdbMovie;

    try {
        user = await userData.GetUserByUserName(req.session.user.username);
        movie = await movieData.GetMovieByID(req.params.movieID);
        tmdbMovie = await movieData.GetTMDBMovie(req.params.movieID);
        discussions = await discussionData.GetDiscussionsByMovieID(req.params.movieID);
        if(movie.averageRating == 0) movie.averageRating = "No Ratings Yet!";
    } catch (error) {
        console.log(error);
        res.send(error);
    }
    
   
    let pageData = {
        movie: movie,
        tmdbMovie: tmdbMovie,
        discussions: discussions,
        userData: user
    }

    res.render('privateMovie', {data: pageData});
});

router.get('/watchlist', async(req, res)=>{
    let user = await userData.GetUserByUserName(req.session.user.username);
    res.json({data: user.movieList});
});

router.post('/watchlist/:movieID', async (req, res)=>{
    try {
        await userData.AddToWatchList(req.params.movieID, req.session.user.username);
        res.send("Added");
    } catch (error) {
        console.log(error);
        res.send(error);
    }
    
});

router.post('/watchlist/remove/:movieID', async(req, res) =>{
    try {
        await userData.RemoveFromWatchList(req.params.movieID, req.session.user.username);
        res.send("Added");
    } catch (error) {
        res.send(error);
    }
});

router.post('/discussion/:movieID', async (req, res)=>{
    //TODO
});


router.get('/rating', async(req, res)=>{
    let user = await userData.GetUserByUserName(req.session.user.username);
    res.json({data: user.userReviews});
})

router.post('/rate/:movieID', async (req, res)=>{

    let {review, rating} = req.body;

    try {
        let newRating = await userData.RateMovie(req.params.movieID, rating, req.session.user.username);
        res.json({averageRating: newRating});
    } catch (error) {
        console.log(error);
    }
    
});

//used to access the movies search from the api
router.get('/search/:search_term', async(req, res) =>{

    let search_term = req.params.search_term;
    
    if(search_term == undefined || typeof(search_term) != 'string' || search_term.trim() == "")
    {
        return res.send("No Search Term");
    }

    try {
        let movies = await movieData.GetMoviesByName(search_term);
        
        let movieList = [];

        for(id of movies)
        {
            movieList.push(await movieData.GetTMDBMovie(id));
        }
        
        res.send(movieList);

    } catch (error) {
        res.send(error);
    }
    

    

});

router.get('/search', async(req, res) =>{
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

    res.render("search", {data: pageData});
})

module.exports = router;