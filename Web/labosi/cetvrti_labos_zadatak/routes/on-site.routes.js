const express = require('express');
const router = express.Router();
const authHandler = require('./helpers/auth-handler');
const Helper = require('./helpers/helper');
const Order = require('../models/OrderModel');
const Address = require('../models/AddressModel');
const cartExistence = require('./helpers/cart-existence');

router.get('/', authHandler, (req, res, next) => {

    if (req.session.form === undefined || Object.entries(req.session.form).length === 0) {
        req.session.form = {
            deliveryDate: undefined,
            deliveryAdress: undefined,
            deliveryAlternative: undefined
        };
    }
    console.log(req.session.form);
    
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
        deliveryAdress: undefined,
        deliveryAlternative: undefined
    };

    res.redirect('/view');
});

router.post('/checkout', cartExistence, authHandler, (req, res, next) => {

    req.session.form = {
        deliveryDate: undefined,
        deliveryAdress: undefined,
        deliveryAlternative: undefined
    };

    res.redirect('/checkout');

});

router.post('/save', (req, res, next) => {

    req.session.form = {
        deliveryDate: req.body["delivery-date"],
        deliveryAdress: req.body["address"],
        deliveryAlternative: req.body["delivery-alternative"]
    };

    res.redirect('/cart');
});

module.exports = router;