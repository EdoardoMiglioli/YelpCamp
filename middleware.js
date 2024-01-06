// this meddleware is used in routed to verify wheteher user is logged in or not
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        // undifined
        console.log(req.session.returnTo)
        req.session.returnTo = req.originalUrl; // add this line
        console.log(req.session.returnTo)
        req.flash('error', 'You must be signed in first!');
        return res.redirect('/login');
    }
    next();
}

module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        console.log(res.locals.returnTo)
        res.locals.returnTo = req.session.returnTo;
        console.log(res.locals.returnTo)
    }
    next();
}

