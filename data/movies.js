const mongoCollections = require('../config/mongoCollections');
const movies = mongoCollections.movies;
const axios = require("axios");

const API_KEY = "f800afc56a41eeb52666b5b8657cea5e";

async function getPopularMovies(){
    const { data } = await axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=en-US&page=1`);
    return data; // this will be the array of shows objects
}

async function pullMoviesByName(name){
    const URI = encodeURI(name);
    const { data } = await axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=en-US&query=${URI}&page=1&include_adult=false`);
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
                    "averageRating": "0",
                    "description" : show.overview
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
    const movie = await moviesCollection.findOne({ tmdbID: parseInt(id) });
    
    if(!movie){
        throw 'Movie not found.';
    }
    else{
        let final = movie;
        final._id=movie._id.toString();
        return final;
    }
}

async function GetTMDBMovie(id)
{
    let {data} = await axios.get(`https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&language=en-US`);
    return data;
}

async function GetMoviesByName(name){
    /* Send a request to the movie database api with a query of name
        For each movie it returns in the array, check if the database has that movie
        If it doesnt, add it to the database where _id is tmdbID
        Return an array of the tmdbIDs */

    // Error checking for name
    if(!name){
        throw 'No name parameter is given to the GetMoviesByName(name) function.';
    }
    if(typeof name !== 'string'){
        throw 'Input name in GetMoviesByName(name) is not of type string.';
    }
    if(name.length == 0){
        throw 'Input name in GetMoviesByName(name) length is 0, empty string.';
    }
    if(name.replace(/\s/g, '').length == 0) {
        throw 'Input name in GetMoviesByName(name) is only empty spaces.';
    }

    const moviesCollection = await movies();
    let idArray = [];

    const movieList = await pullMoviesByName(name);
    
    for(show of movieList.results)
    {
        await moviesCollection.findOne({tmdbID: show.id}).then((movie) => {
            if(!movie){
                let newMovie = {
                    "tmdbID": show.id,
                    "reviews": [],
                    "averageRating": "0",
                    "description" : show.overview
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

}

module.exports = {
    GetTrendingMovies,
    GetMovieByID,
    GetTMDBMovie,
    GetMoviesByName
}