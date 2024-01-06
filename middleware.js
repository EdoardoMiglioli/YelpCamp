// this meddleware is used in routed to verify wheteher user is logged in or not
module.exports.isLoggedIn = (req, res, next) => {
    // req.user automatically get stored with deserialsed info from the session
    // console.log("REQ.USER.....", req.user)
    if(!req.isAuthenticated()) {
        req.flash('error', 'You must be signed in first');
        return res.redirect('/login'); 
    }
    next();
}

