const express = require('express');
const router = express.Router();
const cart = require('../models/CartModel');
const cartExistence = require('./helpers/cart-existence');
const cartSanitizer = require('./helpers/cart-sanitizer');
const db = require('../db')

// Ulančavanje funkcija međuopreme
router.get('/', cartSanitizer, function (req, res, next) {
    //####################### ZADATAK #######################
    // prikaz košarice uz pomoć cart.ejs
    
    if (req.session.cart === undefined) {
        req.session.cart = cart.createCart();
    }

    res.render('cart', {
        title: 'Cart',
        cart: req.session.cart,
        linkActive: 'cart',
        err: undefined,
        user: req.session.user
    });

    //#######################################################
});


router.get('/add/:id', function (req, res, next) {
    //####################### ZADATAK #######################
    //dodavanje jednog artikla u košaricu

    let itemId = parseInt(req.params.id);

    cart.addItemToCart(req.session.cart, itemId, 1);
    let sql = `INSERT INTO cart (user_id, inventory_id, items) VALUES ($1, $2, $3)`;
    db.query(sql, [req.session.user.id, itemId, req.session.cart.items[itemId].quantity]);

    res.render('cart', {
        title: 'cart',
        cart: req.session.cart,
        linkActive: 'cart',
        err: undefined,
        user: req.session.user
    });
    //#######################################################


});

router.get('/remove/:id', function (req, res, next) {
    //####################### ZADATAK #######################
    //brisanje jednog artikla iz košarice

    let itemId = parseInt(req.params.id);
    cart.removeItemFromCart(req.session.cart, itemId, 1);
    res.render('cart', {
        title: 'cart',
        cart: req.session.cart,
        linkActive: 'cart',
        err: undefined,
        user: req.session.user
    })
    //#######################################################


});

module.exports = router;