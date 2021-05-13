const express = require('express');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const userData = require('../data/users');
const { default: xss } = require('xss');
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

    //TODO: Error Checking

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

module.exports = router;