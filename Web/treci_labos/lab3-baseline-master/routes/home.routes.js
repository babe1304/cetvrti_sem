// potrebno napisati
const db = require('./../db');
var express = require('express');
var router = express.Router();

router.get('/', (req, res, next) => {
    res.render('home', {
        linkActive: 'home'
    });
});

module.exports = router;