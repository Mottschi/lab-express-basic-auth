
function isLoggedIn (req, res, next) {
    if (!req.session.currentUser) return res.redirect('/login');
    next();
}

function isLoggedOut (req, res, next) {
    if (req.session.currentUser) return res.redirect('/');
    next();
}

function exposeUserStatusToView (req, res, next) {
    if (req.session.currentUser) {
        res.locals.user = req.session.currentUser;
    }
    next();
}

module.exports = {isLoggedIn, isLoggedOut, exposeUserStatusToView}