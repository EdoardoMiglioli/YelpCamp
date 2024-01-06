const express = require('express');
const mongoose = require('mongoose');
const path = require('path');      
// npm i ejs-mate
// it adds functionality to the ejs
const ejsMate = require('ejs-mate'); 
// data validator
// const Joi = require('joi');
const session = require('express-session')
const ExpressError = require('./utils/ExpressError')
const flash = require('connect-flash')
// npm i method-override run in terminal
// to use methods from queryString like put(updata), delete etc
const methodOverride = require('method-override')
const passport = require('passport');
const LocalStrategy = require('passport-local')
const User = require('./models/user')
const campgroundRoutes = require('./routes/campgrounds')
const reviewRoutes = require('./routes/reviews')
const userRoutes = require('./routes/users')

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();

// it tells the app to use ejs functionality
app.engine('ejs', ejsMate);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

// The app.use(session(sessionConfig)) line in your code is used to apply the session middleware to your Express.js application. This middleware handles session data, which includes user authentication status and user-specific settings. Here's what each property in the sessionConfig object means:
// secret: This is a string used to sign the session ID cookie. This is important for security because it prevents tampering with the session ID 6.
// resave: This option forces the session to be saved back to the session store, even if the session was never modified during the request. It's generally safe to set this to false 6.
// saveUninitialized: This option forces a session that is "uninitialized" to be saved to the store. An uninitialized session is one that is new but not modified. It's generally safe to set this to false 6.
// cookie: This is an object that defines properties for the session ID cookie. The expires and maxAge properties define the lifetime of the cookie, expressed in milliseconds. In your case, the cookie will expire after 7 days 6.
const sessionConfig = {
    secret: 'thisshouldbeabettersecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        // it does not reveal the cokkie data
        httpOnly: true,
        // a week
        expires: Date.now() +  1000 * 60 * 60 * 24 * 7,
        maxAge:  1000 * 60 * 60 * 24 * 7 
    }
}
app.use(session(sessionConfig));
app.use(flash());

// used for the req.body by the post
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));

app.use(express.static(path.join(__dirname, 'public')))

app.use(passport.initialize());
// if we want persistent login sessions
app.use(passport.session())

passport.use(new LocalStrategy(User.authenticate()))
// how to store users in the session
passport.serializeUser(User.serializeUser())
// how to remove user from the session
passport.deserializeUser(User.deserializeUser())

// it will make the local functionalities
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})


app.use('/', userRoutes)
app.use('/campgrounds', campgroundRoutes)
app.use('/campgrounds/:id/reviews', reviewRoutes)

app.get('/', (req, res) => {
    res.render('home')
})



// for every single request and for every path
// if none of the above route works this will work for sure
// and pass to error middleware
app.all('*', (req, res, next) => {
    next(new ExpressError('Page not found', 404))
})

// error handler middleware
app.use((err, req, res, next) => {
    const { statusCode = 500} = err;
    if(!err.message) err.message = 'Something went wrong!';
    // it will send back a status code
    res.status(statusCode).render('error', {err});
})

app.listen(3000, () => {
    console.log('Serving on port 3000');
})
