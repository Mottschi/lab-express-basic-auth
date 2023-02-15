const { isLoggedIn } = require("../middleware/session-status");

const router = require("express").Router();

router.get('/main', isLoggedIn, (req, res, next) => {
    res.render('private/main')
})

router.get('/private', isLoggedIn, (req, res, next) => {
    res.render('private/private')
})


module.exports = router;