const router = require("express").Router();

router.use('/', require('./auth.routes'))

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

module.exports = router;
