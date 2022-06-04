const express = require('express');
const router = express.Router();
const cart = require('../models/CartModel')
const cartSanitizer = require('./helpers/cart-sanitizer');

// Ulančavanje funkcija međuopreme
router.get('/', cartSanitizer, function (req, res, next) {
    //####################### ZADATAK #######################
    // prikaz košarice uz pomoć cart.ejs

    //#######################################################
});


router.get('/add/:id', function (req, res, next) {
    //####################### ZADATAK #######################
    //dodavanje jednog artikla u košaricu

    //#######################################################


});

router.get('/remove/:id', function (req, res, next) {
    //####################### ZADATAK #######################
    //brisanje jednog artikla iz košarice

    //#######################################################


});

module.exports = router;