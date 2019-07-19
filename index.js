//Setting the Express.js
const express = require('express');
const app = express();
const path = require('path');

const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');

//Setting the Template Engine
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: false}));
app.use(express.json());

//Setting the PORT
const PORT = process.env.PORT || 4000;

//Setting the Static folder
app.use(express.static(path.join(__dirname,'public')));


//Setting the Express Sessions
  app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
  }))   

  //Setting the Express Messages
  app.use(require('connect-flash')());
  app.use(function (req, res, next) {
    res.locals.messages = require('express-messages')(req, res);
    next();
  });
  

  //Setting the Express Validator
  app.use(express.json());
    app.post('/user', (req, res) => {
    User.create({
        username: req.body.username,
        password: req.body.password
    }).then(user => res.json(user));
  });

  const { check, validationResult } = require('express-validator');
    app.post('/user', [
    // username must be an email
    check('username').isEmail(),
    // password must be at least 5 chars long
    check('password').isLength({ min: 5 })
    ], (req, res) => {
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    User.create({
        username: req.body.username,
        password: req.body.password
    }).then(user => res.json(user));
    });
    

//Setting the mongoose
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/storebase');
const db = mongoose.connection;

//Check Connection
db.once('open', () => {
    console.log('Connected to MongoDB')
})

//Check for DB errors
db.on('error',(err) => {
    console.log(err);
});


// -------------------------------------------------------------------------------------


// Bringing the DB data
let Articles = require('./models/articles');

//Displaying all the articles
app.get('/articles', (req, res) => {
    Articles.find({}, (err, articles) => {
        res.render('article_list', {
            blogs: articles
        });
    });
});

//Adding articles to DB
app.get('/articles/add', (req, res) => {
    res.render('add_articles');
})
app.post('/articles/add', (req, res) => {
    let articles = new Articles();
    articles.title = req.body.title;
    articles.author = req.body.author;
    articles.content = req.body.content;
    articles.save((err) => {
        if(err) {
            console.log(err);
        } else {
            req.flash('success','article added');
            res.redirect('/articles');
        }
    });
});

//Displaying single article from DB
app.get('/articles/:id', (req, res) => {
    Articles.findById(req.params.id, (err, data) => {
        res.render('each_data', {
            particularData: data
        })
    });
});

//Updating the single article from DB
app.get('/articles/edit/:id', (req, res) => {
    Articles.findById(req.params.id, (err, data) => {
        res.render('edit_articles', {
            updateData: data
        });
    });
});

app.post('/articles/edit/:id', (req, res) => {
    let articles = {};
    articles.title = req.body.title;
    articles.author = req.body.author;
    articles.content = req.body.content;

    let query = {_id:req.params.id};

    Articles.update(query, articles, function(err){
        if(err) {
            console.log(err);
        } else {
            res.redirect('/articles');
        }
    });
});

// Deleting the single article from the DB
app.get('/articles/delete/:id', (req, res) => {

    let query = {_id:req.params.id};

    Articles.remove(query,(err) => {
        if(err) {
            console.log(err);
        } else {
            res.redirect('/articles');
        }
    })
})

//Home page
app.get('/', (req,res) => {
    res.render('home', {
        title: 'dynamic rendering'
    });
});

//Listening for the PORT
app.listen(PORT, () => {
    console.log('Server is running successfully');
});