const mongoCollections = require('../config/mongoCollections');
const movies = mongoCollections.movies;
const axios = require("axios");

const API_KEY = "f800afc56a41eeb52666b5b8657cea5e";

async function getPopularMovies(){
    const { data } = await axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=en-US&page=1`);
    return data; // this will be the array of shows objects
}

async function GetTrendingMovies(){
    /* Send a Request to the movie database api for top movies (https://developers.themoviedb.org/3/movies/get-popular-movies) 
        For each movie it returns in the array, check if our database has that movie:
            If it doesn't, then add it where _id in mongo is the tmdbID
        Return an array of the tmdbIDs */
    

    const moviesCollection = await movies();
    let idArray = [];

    const movieList = await getPopularMovies();

    for(show of movieList.results)
    {
        await moviesCollection.findOne({tmdbID: show.id}).then((movie) => {
            if(!movie){
                let newMovie = {
                    "tmdbID": show.id,
                    "reviews": [],
                    "averageRating": "0"
                };
                const insertInformation = moviesCollection.insertOne(newMovie);
                if(insertInformation.insertedCount === 0){
                    throw "Movie not inserted successfully";
                }
                else{
                    let _id=newMovie.tmdbID;
                    idArray.push(_id);
                }
            }
            else{
                idArray.push(movie.tmdbID);
            }
        });
    }

    return idArray;
};

async function GetMovieByID(id){
    // Returns the movie document with the id

    // Error checking for id
    if(!id){
        throw 'No id parameter is given to the GetMovieByID(id) function.';
    }
    if(typeof id !== 'string'){
        throw 'Input id in GetMovieByID(id) is not of type string.';
    }
    if(id.length == 0){
        throw 'Input id in GetMovieByID(id) length is 0, empty string.';
    }
    if(id.replace(/\s/g, '').length == 0) {
        throw 'Input id in GetMovieByID(id) is only empty spaces.';
    }

    const moviesCollection = await movies();
    const movie = await moviesCollection.findOne({ tmdbID: id });
    if(!movie){
        throw 'Movie not found.';
    }
    else{
        let final = movie;
        final._id=movie._id.toString();
        return final;
    }
}

module.exports = {
    GetTrendingMovies,
    GetMovieByID
}