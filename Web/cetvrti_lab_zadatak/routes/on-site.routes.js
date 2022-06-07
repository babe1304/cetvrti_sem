const express = require('express');
const router = express.Router();
const authHandler = require('./helpers/auth-handler');
const Helper = require('./helpers/helper');
const Order = require('../models/OrderModel');
const Address = require('../models/AddressModel');
const authHandler = require('./helpers/auth-handler');
const cartExistence = require('./helpers/cart-existence');

router.get('/', authHandler, (req, res, next) => {

    if (req.session.form === undefined) {
        req.session.form = {
            deliveryDate: undefined,
            delivaryAdress: undefined,
            deliveryAlternative: undefined
        };
    }
    
    res.render('view', {
        linkActive: 'cart',
        title: 'Optional items',
        user: req.session.user,
        helper: new Helper(req.session.form)
    })

});

router.post('/reset', (req, res, next) => {

    req.session.form = {
        deliveryDate: undefined,
        delivaryAdress: undefined,
        deliveryAlternative: undefined
    };

    res.render('view', {
        linkActive: 'cart',
        title: 'Optional items',
        user: req.session.user,
        helper: new Helper(req.session.form)
    })
});

router.post('/checkout', cartExistence, authHandler, (req, res, next) => {

    if (req.session.cart !== undefined) {
        req.session.cart.invalid = true;
    }

    req.session.form = {
        deliveryDate: undefined,
        delivaryAdress: undefined,
        deliveryAlternative: undefined
    };

    (async () => {

        //dohvaćanje primarne adrese korisnika
        let addresses = await Address.fetchByUser(req.session.user);
        let address = addresses[0];


        //stvaranje zapisa narudžbe u tablici order
        let order = new Order(req.session.user, address, req.session.cart);
        await order.persist();

        res.render('checkout', {
            title: 'Cart Checkout',
            linkActive: 'cart',
            user: req.session.user,
            cart: req.session.cart,
            err: undefined
        });
    })()

});

router.post('/save', (req, res, next) => {

    req.session.form = {
        deliveryDate: req.body["delivery-date"],
        delivaryAdress: req.body.address,
        deliveryAlternative: req.body["delivery-alternative"]
    };

    res.render('cart', {
        title: 'cart',
        cart: req.session.cart,
        linkActive: 'cart',
        err: undefined,
        user: req.session.user
    });
});

module.exports = router;