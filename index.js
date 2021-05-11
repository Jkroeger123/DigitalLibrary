const express = require('express');
const session = require('express-session');
var exphbs = require('express-handlebars');
const app = express();

const configRoutes = require('./routes');

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use(
    session({
        name:"AuthCookie",
        secret:"some secret string!",
        resave:false,
        saveUninitialized:true
    })
);

app.use('/private', async (req, res, next) =>{

    if (req.session.user) return next();

    res.status(403);

    res.redirect(`/public${req.path}`);

});

app.use('/public', async(req, res, next) =>{

    if(!req.session.user) return next();

    res.status(403);
    
    res.redirect(`/private${req.path}`);

});

configRoutes(app);

app.listen(3000, () => {
    console.log('Listening on port 3000')
})