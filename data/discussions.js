const mongoCollections = require('../config/mongoCollections');
const discussions = mongoCollections.discussions;

let { ObjectId } = require('mongodb');

async function GetRecentDiscussions(){
    /* Query the database for discussion documents sorted by data posted
        Return first N discussions */

    let discussionList=[]
    const discussionsCollection = await discussions();

    discussionsCollection.forEach((discussion) => {
        discussionList.push(discussion);
    });
    let sortedDiscussionList=discussionList.sort((a, b) => new Date(b.dateOfReview) - new Date(a.dateOfReview));
    let result = [];
    // Just an example N=20, is subject to change
    for(let i=0; i<20; i++){
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
    discussionsCollection.forEach((discussion) => {
        if(discussion.movieId === id){
            let final = discussion;
            final._id=discussion._id.toString();
            discussionsMovieId.push(final);
        }
    })
    return discussionsMovieID;
}

async function GetDiscussionByID(id){
    // Return the discussion document with an _id of id

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

module.exports = {
    GetRecentDiscussions,
    GetDiscussionsByMovieID,
    GetDiscussionByID
}