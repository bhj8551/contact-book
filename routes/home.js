// routes/home.js

let express = require('express');
let router = express.Router();

// Home
router.get('/', (req, res) => {
  res.redirect('/contacts');
});

module.exports = router;
