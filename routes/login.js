const express = require('express');
const bcrypt = require('bcrypt');
const userData = require('../data/users');
const router = express.Router();
const xss = require('xss');

router.get('/', (req, res) => {
    
    if (req.session.user) return res.redirect('/private'); 
    
    res.render('login');

});


router.post('/', async (req, res) =>{

    let { username, password } = req.body;

    username = xss(username);
    password = xss(password);

    if(!username || !password || typeof(username) != 'string' || typeof(password) != 'string' || username == "" || password == "")
    {
        res.status(400);
        return res.render('loginError');
    }

    username = username.toLocaleLowerCase();

    let passwordMatch = false;
    
    let foundUser;

    try {
        foundUser = await userData.GetUserByUserName(username);
    } catch (error) {
        res.status(400);
        return res.render('loginError');
    }
    

    //compare the login info
    if(foundUser)
    {
        try {
            passwordMatch = await bcrypt.compare(password, foundUser.encryptedPassword);
        } catch (e) {
            res.status(400);
            res.end();
            return;
        }
    } 

    if(passwordMatch)
    {
        req.session.user = {username: username};
        res.redirect('/private');
    }else
    {
        res.status(401);
        res.render('loginError');
    }


})

module.exports = router;