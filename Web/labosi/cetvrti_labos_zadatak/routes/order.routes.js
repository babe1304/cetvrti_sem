const express = require('express');
const router = express.Router();
const db = require('../db');
const cart = require('../models/CartModel');

router.get('/', async function (req, res, next) {
    const sqlCategories = `SELECT * FROM categories ORDER BY id;`;
    const sqlInventory = `SELECT * FROM inventory ORDER BY categoryid, id;`;

    if (req.session.cart === undefined || Object.entries(req.session.cart).length === 0) {
        req.session.cart = cart.createCart();
    }
    
    try {
        const resultCategories = (await db.query(sqlCategories, [])).rows;
        const resultInventory = (await db.query(sqlInventory, [])).rows;
        let categoryItemMap = {};
        for (let category of resultCategories) {
            categoryItemMap[category.id] = [];
        }
        for (let item of resultInventory) {
            categoryItemMap[item.categoryid].push(item);
        }
        res.render("order", {
            title: 'Order',
            categories: resultCategories,
            categoryItemMap: categoryItemMap,
            user: req.session.user,
            linkActive: 'order',
        });
    } catch (err) {
        console.log(err);
    }
});

module.exports = router;