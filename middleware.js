// this meddleware is used in routed to verify wheteher user is logged in or not
module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()) {
        req.flash('error', 'You must be signed in first');
        return res.redirect('/login'); 
    }
    next();
}

