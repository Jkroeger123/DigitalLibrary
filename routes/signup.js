const express = require('express');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const userData = require('../data/users');
const xss = require('xss');
const router = express.Router();

router.get('/', (req, res) =>{

    if (req.session.user) return res.redirect('/private'); 
    
    res.render('signup');

});

router.post('/', async (req, res) =>{

    let {userName, password, firstName, lastName, Email, City, State, Age} = req.body;

    userName = xss(userName);
    password = xss(password);
    firstName = xss(firstName);
    lastName = xss(lastName);
    Email = xss(Email);
    City = xss(City);
    State = xss(State);
    Age = xss(Age);

    //Error Checking
    try {
        errorCheck(userName, password, Email, firstName, lastName, City, State, Age)
    } catch (error) {
        console.log(error);
        res.status(400);
        return res.render('signupError', {error: error});
    }

    userName = userName.toLowerCase();
    Email = Email.toLowerCase();

    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    try {
        user = await userData.CreateUser(userName, hashedPassword, Email, firstName, lastName, City, State, Age);
        res.status(200);
        req.session.user = {username: userName};
        res.redirect('/private');
    } catch (error) {
        console.log(error);
        res.status(400);
        return res.render('signupError', {error: error});
    }

});


function errorCheck(userName, hashedPassword, Email, firstName, lastName, City, State, Age)
{
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
}

module.exports = router;