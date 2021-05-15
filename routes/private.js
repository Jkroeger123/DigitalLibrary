//this should serve views that can only be viewed when logged in
const express = require('express');
const movieData = require('../data/movies');
const discussionData = require('../data/discussions');
const userData = require('../data/users');
const router = express.Router();
const xss = require('xss');

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
    for(id of discussionList)
    {
        discussions.push(await discussionData.GetDiscussionByID(id));
    }

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

    if(!req.params.movieID || req.params.movieID.trim() == "") return res.send("No Parameter Movie ID Provied!");

    try {
        await userData.AddToWatchList(xss(req.params.movieID), req.session.user.username);
        res.send("Added");
    } catch (error) {
        console.log(error);
        res.send(error);
    }
    
});

router.post('/watchlist/remove/:movieID', async(req, res) =>{

    if(!req.params.movieID || req.params.movieID.trim() == "") return res.send("No Parameter Movie ID Provied!");

    try {
        await userData.RemoveFromWatchList(xss(req.params.movieID), req.session.user.username);
        res.send("Added");
    } catch (error) {
        res.send(error);
    }
});

router.get('/discussion/:discussionID', async(req, res)=>{

    try {
        let discussion = await discussionData.GetDiscussionByID(req.params.discussionID);
        res.render('privateDiscussion', {data: discussion}); 
    } catch (error) {
        res.status(400);
        res.redirect('/');
    }

});

router.get('/trending', async(req, res)=>{
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

    res.render("userTrending", {data: pageData});
});

//Route To Create a discussion
router.post('/discussion/:movieID', async (req, res)=>{
    
    let {discussionTitle, discussionContent, isSpoiler} = req.body;

    if(isSpoiler == undefined) isSpoiler = "off";

    if(isSpoiler == undefined || !discussionTitle || !discussionContent || discussionContent.trim() == "" || discussionTitle.trim() == "") return res.send("Error");
    

    discussionTitle = xss(discussionTitle);
    discussionContent = xss(discussionContent);

    try {
        let discussion = await discussionData.CreateDiscussion(req.session.user.username, xss(req.params.movieID), discussionTitle, discussionContent, isSpoiler);
        res.send(discussion._id.toString());
    } catch (error) {
        console.log(error);
        res.send(error);
    }
    
});


router.get('/rating', async(req, res)=>{
    let user = await userData.GetUserByUserName(req.session.user.username);
    res.json({data: user.userReviews});
})

router.post('/rate/:movieID', async (req, res)=>{

    let {review, rating} = req.body;

    if(parseInt(rating) > 10) rating = 10;

    if(parseInt(rating) < 1) rating = 1;

    if(!review || !rating || typeof(review) != 'string' || review.trim() == "") return res.send("Error");

    review = xss(review);
    rating = xss(rating);

    try {
        let newRating = await userData.RateMovie(xss(req.params.movieID), rating, req.session.user.username);
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

router.post('/comment/:discussionID', async (req, res)=>{
    let {comment} = req.body;

    if(!comment || typeof(comment) != "string" || comment.trim() == "") return res.send("Error");

    comment = xss(comment);

    try {
        await discussionData.CreateDiscussionReply(xss(req.params.discussionID.toString()), req.session.user.username, comment);
        res.json({username: req.session.user.username});
    } catch (error) {
        res.send(error);
        console.log(error);
    }
    

})

module.exports = router;