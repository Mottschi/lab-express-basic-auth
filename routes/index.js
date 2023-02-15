const router = require("express").Router();

const { isLoggedIn } = require('../middleware/session-status.js');

router.use('/', require('./auth.routes'));
router.use('/', require('./private.routes'));

/* GET home page */
router.get("/", isLoggedIn, (req, res, next) => {
  res.render("index");
});

module.exports = router;
