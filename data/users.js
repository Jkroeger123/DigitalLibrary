const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users;
const movies = mongoCollections.movies;


async function GetUserByUserName(username){
    // Return the user document with username

    // Error checking
    if(!username){
        throw 'No username parameter is given to the GetUserByUserName(username) function.';
    }
    if(typeof username !== 'string'){
        throw 'Input username in GetUserByUserName(username) is not of type string.';
    }
    if(username.length == 0){
        throw 'Input username in GetUserByUserName(username) length is 0, empty string.';
    }
    if(username.replace(/\s/g, '').length == 0) {
        throw 'Input username in GetUserByUserName(username) is only empty spaces.';
    }

    const usersCollection = await users();
    const user = await usersCollection.findOne({ userName: username });
    if(!user){
        throw 'User not found.';
    }
    else{
        let final = user;
        final._id=user._id.toString();
        return final;
    }
}

async function AddToWatchList(movieID, username){
    // Adds the provided movieID to the watchlist array of user with username

    // Error checking
    if(!movieID){
        throw 'No movieID parameter is given to the AddToWatchList(movieID, username) function.'
    }
    if(!username){
        throw 'No username parameter is given to the AddToWatchList(movieID, username) function.';
    }
    if(typeof movieID !== 'string'){
        throw 'Input movieID in AddToWatchList(movieID, username) is not of type string.';
    }
    if(movieID.length == 0){
        throw 'Input movieID in AddToWatchList(movieID, username) length is 0, empty string.';
    }
    if(movieID.replace(/\s/g, '').length == 0) {
        throw 'Input movieID in AddToWatchList(movieID, username) is only empty spaces.';
    }
    if(typeof username !== 'string'){
        throw 'Input username in AddToWatchList(movieID, username) is not of type string.';
    }
    if(username.length == 0){
        throw 'Input username in AddToWatchList(movieID, username) length is 0, empty string.';
    }
    if(username.replace(/\s/g, '').length == 0) {
        throw 'Input username in AddToWatchList(movieID, username) is only empty spaces.';
    }

    const usersCollection = await users();
    const moviesCollection = await movies();
    const user = await usersCollection.findOne({ userName: username });
    if(!user){
        throw 'User not found.';
    }
    else{

        await moviesCollection.findOne({tmdbID: parseInt(movieID)}).then((movie) => {
            if(!movie)  throw "Movie Not Found";
            user.movieList.push(movieID);
            usersCollection.updateOne({ userName: username }, { $set: user });
        });
        
    }
    
}

async function RemoveFromWatchList(movieID, username){
    // Adds the provided movieID to the watchlist array of user with username

    // Error checking
    if(!movieID){
        throw 'No movieID parameter is given to the AddToWatchList(movieID, username) function.'
    }
    if(!username){
        throw 'No username parameter is given to the AddToWatchList(movieID, username) function.';
    }
    if(typeof movieID !== 'string'){
        throw 'Input movieID in AddToWatchList(movieID, username) is not of type string.';
    }
    if(movieID.length == 0){
        throw 'Input movieID in AddToWatchList(movieID, username) length is 0, empty string.';
    }
    if(movieID.replace(/\s/g, '').length == 0) {
        throw 'Input movieID in AddToWatchList(movieID, username) is only empty spaces.';
    }
    if(typeof username !== 'string'){
        throw 'Input username in AddToWatchList(movieID, username) is not of type string.';
    }
    if(username.length == 0){
        throw 'Input username in AddToWatchList(movieID, username) length is 0, empty string.';
    }
    if(username.replace(/\s/g, '').length == 0) {
        throw 'Input username in AddToWatchList(movieID, username) is only empty spaces.';
    }

    const usersCollection = await users();
    const moviesCollection = await movies();
    const user = await usersCollection.findOne({ userName: username });
    if(!user){
        throw 'User not found.';
    }
    else{

        await moviesCollection.findOne({tmdbID: parseInt(movieID)}).then((movie) => {
            if(!movie)  throw "Movie Not Found";

            //Remove movieID from array
            let idx = user.movieList.indexOf(movieID);
            if (idx > -1) user.movieList.splice(idx, 1);

            usersCollection.updateOne({ userName: username }, { $set: user });
        });
        
    }
    
}


async function RateMovie(movieID, rating, username){
    /* Add the movieID to the user reviewList with username
    Update the movie average rating to account for the new data */

    // Error checking
    if(!movieID){
        throw 'No movieID parameter is given to the RateMovie(movieID, rating, username) function.'
    }
    if(!rating){
        throw 'No rating parameter is given to the RateMovie(movieID, rating, username) function.'
    }
    if(!username){
        throw 'No username parameter is given to the RateMovie(movieID, rating, username) function.';
    }
    if(typeof movieID !== 'string'){
        throw 'Input movieID in RateMovie(movieID, rating, username) is not of type string.';
    }
    if(movieID.length == 0){
        throw 'Input movieID in RateMovie(movieID, rating, username) length is 0, empty string.';
    }
    if(movieID.replace(/\s/g, '').length == 0) {
        throw 'Input movieID in RateMovie(movieID, rating, username) is only empty spaces.';
    }
    if(typeof rating !== 'string'){
        throw 'Input rating in RateMovie(movieID, rating, username) is not of type string.';
    }
    if(rating.length == 0){
        throw 'Input rating in RateMovie(movieID, rating, username) length is 0, empty string.';
    }
    if(rating.replace(/\s/g, '').length == 0) {
        throw 'Input rating in RateMovie(movieID, rating, username) is only empty spaces.';
    }
    if(typeof username !== 'string'){
        throw 'Input username in RateMovie(movieID, rating, username) is not of type string.';
    }
    if(username.length == 0){
        throw 'Input username in RateMovie(movieID, rating, username) length is 0, empty string.';
    }
    if(username.replace(/\s/g, '').length == 0) {
        throw 'Input username in RateMovie(movieID, rating, username) is only empty spaces.';
    }

    movieID = parseInt(movieID);

    const usersCollection = await users();
    const moviesCollection = await movies();
    const user = await usersCollection.findOne({ userName: username });
    const movie = await moviesCollection.findOne({ tmdbID: movieID });
    if(!user){
        throw 'User not found.';
    }
    else if(!movie){
        throw 'Movie not found';
    }
    else{
        user.userReviews.push(movieID);
        const avgRating = parseFloat(movie.averageRating);
        const avgRatingTotal = avgRating * movie.reviews.length;
        movie.reviews.push(user._id.toString());
        const newRatingTotal = avgRatingTotal + parseFloat(rating);
        const newAvgRating = newRatingTotal / movie.reviews.length;
        movie.averageRating = newAvgRating.toString();
        usersCollection.updateOne({ userName: username }, { $set: user });
        moviesCollection.updateOne({ tmdbID: movieID }, { $set: movie });
        return movie.averageRating;
    }
}

async function CreateUser(userName, hashedPassword, Email, firstName, lastName, City, State, Age)
{
    //TODO: Finish Error Checking

    userName = userName.trim();
    Email = Email.trim();
    firstName = firstName.trim();
    lastName = lastName.trim();
    City = City.trim();
    State = State.trim();

    if(!userName) throw "No Username Provided";
    if(!Email) throw "No Email Provided";
    if(!firstName) throw "No First Name Provided";
    if(!lastName) throw "No Last Name Provided";
    if(!City) throw "No City Provided";
    if(!State) throw "No State Provided";
    if(!hashedPassword) throw "No Password Provided";
    if(!Age) throw "No Age Provided";
    if(typeof userName !== 'string'){
        throw 'Input userName in CreateUser(userName, hashedPassword, Email, firstName, lastName, City, State, Age) is not of type string.';
    }
    if(userName.length == 0){
        throw 'Input userName in CreateUser(userName, hashedPassword, Email, firstName, lastName, City, State, Age) length is 0, empty string.';
    }
    if(userName.replace(/\s/g, '').length == 0) {
        throw 'Input userName in CreateUser(userName, hashedPassword, Email, firstName, lastName, City, State, Age) is only empty spaces.';
    }
    if(typeof hashedPassword !== 'string'){
        throw 'Input hashedPassword in CreateUser(userName, hashedPassword, Email, firstName, lastName, City, State, Age) is not of type string.';
    }
    if(hashedPassword.length == 0){
        throw 'Input hashedPassword in CreateUser(userName, hashedPassword, Email, firstName, lastName, City, State, Age) length is 0, empty string.';
    }
    if(hashedPassword.replace(/\s/g, '').length == 0) {
        throw 'Input hashedPassword in CreateUser(userName, hashedPassword, Email, firstName, lastName, City, State, Age) is only empty spaces.';
    }
    if(typeof Email !== 'string'){
        throw 'Input Email in CreateUser(userName, hashedPassword, Email, firstName, lastName, City, State, Age) is not of type string.';
    }
    if(Email.length == 0){
        throw 'Input Email in CreateUser(userName, hashedPassword, Email, firstName, lastName, City, State, Age) length is 0, empty string.';
    }
    if(Email.replace(/\s/g, '').length == 0) {
        throw 'Input Email in CreateUser(userName, hashedPassword, Email, firstName, lastName, City, State, Age) is only empty spaces.';
    }
    if(typeof firstName !== 'string'){
        throw 'Input firstName in CreateUser(userName, hashedPassword, Email, firstName, lastName, City, State, Age) is not of type string.';
    }
    if(firstName.length == 0){
        throw 'Input firstName in CreateUser(userName, hashedPassword, Email, firstName, lastName, City, State, Age) length is 0, empty string.';
    }
    if(firstName.replace(/\s/g, '').length == 0) {
        throw 'Input firstName in CreateUser(userName, hashedPassword, Email, firstName, lastName, City, State, Age) is only empty spaces.';
    }
    if(typeof lastName !== 'string'){
        throw 'Input lastName in CreateUser(userName, hashedPassword, Email, firstName, lastName, City, State, Age) is not of type string.';
    }
    if(lastName.length == 0){
        throw 'Input lastName in CreateUser(userName, hashedPassword, Email, firstName, lastName, City, State, Age) length is 0, empty string.';
    }
    if(lastName.replace(/\s/g, '').length == 0) {
        throw 'Input lastName in CreateUser(userName, hashedPassword, Email, firstName, lastName, City, State, Age) is only empty spaces.';
    }
    if(typeof City !== 'string'){
        throw 'Input City in CreateUser(userName, hashedPassword, Email, firstName, lastName, City, State, Age) is not of type string.';
    }
    if(City.length == 0){
        throw 'Input City in CreateUser(userName, hashedPassword, Email, firstName, lastName, City, State, Age) length is 0, empty string.';
    }
    if(City.replace(/\s/g, '').length == 0) {
        throw 'Input City in CreateUser(userName, hashedPassword, Email, firstName, lastName, City, State, Age) is only empty spaces.';
    }
    if(typeof State !== 'string'){
        throw 'Input State in CreateUser(userName, hashedPassword, Email, firstName, lastName, City, State, Age) is not of type string.';
    }
    if(State.length == 0){
        throw 'Input State in CreateUser(userName, hashedPassword, Email, firstName, lastName, City, State, Age) length is 0, empty string.';
    }
    if(State.replace(/\s/g, '').length == 0) {
        throw 'Input State in CreateUser(userName, hashedPassword, Email, firstName, lastName, City, State, Age) is only empty spaces.';
    }
    if(typeof Age !== 'string'){
        throw 'Input Age in CreateUser(userName, hashedPassword, Email, firstName, lastName, City, State, Age) is not of type string.';
    }
    if(Age.length == 0){
        throw 'Input Age in CreateUser(userName, hashedPassword, Email, firstName, lastName, City, State, Age) length is 0, empty string.';
    }
    if(Age.replace(/\s/g, '').length == 0) {
        throw 'Input Age in CreateUser(userName, hashedPassword, Email, firstName, lastName, City, State, Age) is only empty spaces.';
    }

    const usersCollection  = await users();

    //Throw exception if email is in use
    await usersCollection.findOne({Email: Email}).then((user) => {
        if (user) throw "Email Already In Use";
    });

    await usersCollection.findOne({userName: userName}).then((user) => {
        if (user) throw "Username Already In Use";
    });


    let newUser = {
        userName: userName,
        encryptedPassword: hashedPassword,
        Email: Email,
        firstName: firstName,
        lastName: lastName,
        City: City,
        State: State,
        Age: Age,
        userPosts: [],
        userReviews: [],
        movieList: []
    };

    const insertInformation = usersCollection.insertOne(newUser);

    if(insertInformation.insertedCount === 0){
        throw "User not inserted successfully";
    }
    else{
        return newUser;
    }

}

module.exports = {
    GetUserByUserName,
    AddToWatchList,
    RateMovie,
    CreateUser,
    RemoveFromWatchList
}