const mongoCollections = require('../config/mongoCollections');
const discussions = mongoCollections.discussions;
const users = mongoCollections.users;
const movies = mongoCollections.movies;

let { ObjectId } = require('mongodb');

async function GetRecentDiscussions(){
    /* Query the database for discussion documents sorted by data posted
        Return first N discussions */

    const discussionsCollection = await discussions();

    let discussionList = await discussionsCollection.find({}).toArray();

    let sortedDiscussionList=discussionList.sort((a, b) => a.dateOfReview - b.dateOfReview);
    let result = [];

    // Just an example N=20, is subject to change
    for(let i=0; i< Math.min(sortedDiscussionList.length, 20); i++){
        result.push(sortedDiscussionList[i]);
    }

    return result;
}

async function GetDiscussionsByMovieID(id){
    // Query the database for all discussions from a movie id
    let discussionsMovieId = [];

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

    const discussionsCollection = await discussions();

    let discussionList = await discussionsCollection.find({}).toArray();

    discussionList.forEach((discussion) => {
        if(discussion.movieId === id){
            let final = discussion;
            final._id=discussion._id.toString();
            discussionsMovieId.push(final);
        }
    })

    return discussionsMovieId;
}

async function GetDiscussionByID(id){
    // Return the discussion document with an _id of id

    id = id.toString();

    // Error checking for id
    if(!id){
        throw 'No id parameter is given to the GetDiscussionByID(id) function.';
    }
    if(typeof id !== 'string'){
        throw 'Input id in GetDiscussionByID(id) is not of type string.';
    }
    if(id.length == 0){
        throw 'Input id in GetDiscussionByID(id) length is 0, empty string.';
    }
    if(id.replace(/\s/g, '').length == 0) {
        throw 'Input id in GetDiscussionByID(id) is only empty spaces.';
    }

    let parsedId = ObjectId(id);

    if(!(parsedId instanceof ObjectId)){
        throw 'Input id in GetDiscussionByID(id) is not an instance of an ObjectId.';
    }

    const discussionsCollection = await discussions();
    const discussion = await discussionsCollection.findOne({ _id: parsedId });
    if(!discussion){
        throw 'Discussion not found.';
    }
    else{
        let final = discussion;
        final._id=discussion._id.toString();
        return final;
    }
}

async function CreateDiscussion(username, movieID, discussionTitle, discussionContent, isSpoiler){
    /* Create a discussion document with the provided parameters
        Fill in the unprovided schema values such as the date. Replies array, etc. */

    if(!isSpoiler) isSpoiler = false;

    // Error checking
    if(!username){
        throw 'No username parameter is given to the CreateDiscussion(username, movieID, discussionTitle, discussionContent) function.';
    }
    if(typeof username !== 'string'){
        throw 'Input username in CreateDiscussion(username, movieID, discussionTitle, discussionContent) is not of type string.';
    }
    if(username.length == 0){
        throw 'Input username in CreateDiscussion(username, movieID, discussionTitle, discussionContent) length is 0, empty string.';
    }
    if(username.replace(/\s/g, '').length == 0) {
        throw 'Input username in CreateDiscussion(username, movieID, discussionTitle, discussionContent) is only empty spaces.';
    }
    if(!movieID){
        throw 'No movieID parameter is given to the CreateDiscussion(username, movieID, discussionTitle, discussionContent) function.';
    }
    if(typeof movieID !== 'string'){
        throw 'Input movieID in CreateDiscussion(username, movieID, discussionTitle, discussionContent) is not of type string.';
    }
    if(movieID.length == 0){
        throw 'Input movieID in CreateDiscussion(username, movieID, discussionTitle, discussionContent) length is 0, empty string.';
    }
    if(movieID.replace(/\s/g, '').length == 0) {
        throw 'Input movieID in CreateDiscussion(username, movieID, discussionTitle, discussionContent) is only empty spaces.';
    }
    if(!discussionTitle){
        throw 'No discussionTitle parameter is given to the CreateDiscussion(username, movieID, discussionTitle, discussionContent) function.';
    }
    if(typeof discussionTitle !== 'string'){
        throw 'Input discussionTitle in CreateDiscussion(username, movieID, discussionTitle, discussionContent) is not of type string.';
    }
    if(discussionTitle.length == 0){
        throw 'Input discussionTitle in CreateDiscussion(username, movieID, discussionTitle, discussionContent) length is 0, empty string.';
    }
    if(discussionTitle.replace(/\s/g, '').length == 0) {
        throw 'Input discussionTitle in CreateDiscussion(username, movieID, discussionTitle, discussionContent) is only empty spaces.';
    }
    if(!discussionContent){
        throw 'No discussionContent parameter is given to the CreateDiscussion(username, movieID, discussionTitle, discussionContent) function.';
    }
    if(typeof discussionContent !== 'string'){
        throw 'Input discussionContent in CreateDiscussion(username, movieID, discussionTitle, discussionContent) is not of type string.';
    }
    if(discussionContent.length == 0){
        throw 'Input discussionContent in CreateDiscussion(username, movieID, discussionTitle, discussionContent) length is 0, empty string.';
    }
    if(discussionContent.replace(/\s/g, '').length == 0) {
        throw 'Input discussionContent in CreateDiscussion(username, movieID, discussionTitle, discussionContent) is only empty spaces.';
    }

    const discussionsCollection  = await discussions();

    const usersCollection = await users();
    const user = await usersCollection.findOne({ userName: username });
    if(!user){
        throw 'User not found.';
    }

    const moviesCollection = await movies();
    const movie = await moviesCollection.findOne({ tmdbID: parseInt(movieID) });
    if(!movie){
        throw 'Movie not found.';
    }

    //Throw exception if discussionTitle is in use
    await discussionsCollection.findOne({discussionTitle: discussionTitle}).then((discussion) => {
        if (discussion) throw "Discussion Title Already Used";
    });

    let today = new Date();

    /*let day = (today.getDate().toString()).padStart(2, '0');
    let month = ((today.getMonth()+1).toString()).padStart(2, '0');
    let year = today.getFullYear().toString();
    today=month+'/'+day+'/'+year;*/

    let newDiscussion = {
        postCreatorUserName: user.userName,
        movieId: movieID,
        discussionTitle: discussionTitle,
        discussionContent: discussionContent,
        dateOfPosting: today,
        isSpoiler: isSpoiler,
        replies: []
    };

    const insertInformation = await discussionsCollection.insertOne(newDiscussion);

    user.userPosts.push(newDiscussion._id);
    usersCollection.updateOne({ userName: username }, { $set: user });

    if(insertInformation.insertedCount === 0){
        throw "Discussion not inserted successfully";
    }
    else{
        return newDiscussion;
    }
}

async function CreateDiscussionReply(discussionID, username, comment){
    /* Create a comment subdocument under the discussion associated with the discussion id parameter
        Again, fill in any non provided data that the schema calls for. */

    // Error Checking
    if(!discussionID){
        throw 'No discussionID parameter is given to the CreateDiscussionReply(discussionID, username, comment) function.';
    }
    if(typeof discussionID !== 'string'){
        throw 'Input discussionID in CreateDiscussionReply(discussionID, username, comment) is not of type string.';
    }
    if(discussionID.length == 0){
        throw 'Input discussionID in CreateDiscussionReply(discussionID, username, comment) length is 0, empty string.';
    }
    if(discussionID.replace(/\s/g, '').length == 0) {
        throw 'Input discussionID in CreateDiscussionReply(discussionID, username, comment) is only empty spaces.';
    }
    if(!username){
        throw 'No username parameter is given to the CreateDiscussionReply(discussionID, username, comment) function.';
    }
    if(typeof username !== 'string'){
        throw 'Input username in CreateDiscussionReply(discussionID, username, comment) is not of type string.';
    }
    if(username.length == 0){
        throw 'Input username in CreateDiscussionReply(discussionID, username, comment) length is 0, empty string.';
    }
    if(username.replace(/\s/g, '').length == 0) {
        throw 'Input username in CreateDiscussionReply(discussionID, username, comment) is only empty spaces.';
    }
    if(!comment){
        throw 'No comment parameter is given to the CreateDiscussionReply(discussionID, username, comment) function.';
    }
    if(typeof comment !== 'string'){
        throw 'Input comment in CreateDiscussionReply(discussionID, username, comment) is not of type string.';
    }
    if(comment.length == 0){
        throw 'Input comment in CreateDiscussionReply(discussionID, username, comment) length is 0, empty string.';
    }
    if(comment.replace(/\s/g, '').length == 0) {
        throw 'Input comment in CreateDiscussionReply(discussionID, username, comment) is only empty spaces.';
    }

    const discussionsCollection  = await discussions();

    let parsedId = ObjectId(discussionID);

    if(!(parsedId instanceof ObjectId)){
        throw 'Input discussionID in CreateDiscussionReply(discussionID, username, comment) is not an instance of an ObjectId.';
    }

    const discussion = await discussionsCollection.findOne({_id: parsedId});
    if(!discussion){
        throw "Discussion Not Found";
    }

    const usersCollection = await users();
    const user = await usersCollection.findOne({ userName: username });
    if(!user){
        throw 'User not found.';
    }

    let today = new Date();
    /*let day = (today.getDate().toString()).padStart(2, '0');
    let month = ((today.getMonth()+1).toString()).padStart(2, '0');
    let year = (today.getFullYear()).toString();
    let today=month+'/'+day+'/'+year;*/

    let newComment = {
        commentorUsername: user.userName,
        dateOfPosting: today,
        comment: comment
    }

    discussion.replies.push(newComment);

    discussionsCollection.updateOne({ _id: parsedId }, { $set: discussion });

    return newComment;
}

module.exports = {
    GetRecentDiscussions,
    GetDiscussionsByMovieID,
    GetDiscussionByID,
    CreateDiscussion,
    CreateDiscussionReply
}