const express = require('express');
const router = express.Router();
const User = require('../models/UserModel')


router.get('/', function (req, res, next) {
    //####################### ZADATAK #######################
    //vrati login stranicu
    res.render('login', {
        user: req.session.user,
        linkActive: 'login',
        err: undefined
    })
    //#######################################################

});

router.post('/', async function (req, res, next) {
    //####################### ZADATAK #######################
    //postupak prijave korisnika

    if (req.session.user !== undefined) {
        res.render('login', {
            user: req.session.user,
            linkActive: 'login',
            err: "Please log out first"
        });
    }
    
    let user = await User.fetchByUsername(req.body.user);

    if (user.isPersisted() && user.checkPassword(req.body.password)) {
        req.session.user = user;
        res.redirect('/');
    } else {
        res.render('login', {
            user: req.session.user,
            err: "Incorrect username or password",
            linkActive: 'login'
        });
    }
    //#######################################################

});


module.exports = router;