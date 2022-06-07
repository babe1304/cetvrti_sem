const express = require('express');
const router = express.Router();
const Address = require('../models/AddressModel')
const Order = require('../models/OrderModel')
const authHandler = require('./helpers/auth-handler');

//prikaz podataka o korisniku (podaci o korisniku, adrese, narudžbe)
// Ulančavanje funkcija međuopreme
router.get('/', authHandler, function (req, res, next) {
    (async () => {
        console.log('Inside func ' + req.session.user);
        //dobavi adresu korisnika
        let address = await Address.fetchByUser(req.session.user);
        console.log(address);
        //dobavi narudžbe korisnika
        let orders = await Order.fetchByUser(req.session.user);
        console.log(orders);
        res.render('user', {
            title: 'User profile',
            user: req.session.user,
            address: address[0],
            orders: orders,
            linkActive: 'user'
        });
    })()
});

module.exports = router;