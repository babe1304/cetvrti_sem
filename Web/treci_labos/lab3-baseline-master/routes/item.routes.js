// potrebno napisati
const db = require('./../db');
var express = require('express');
var router = express.Router();

router.get('/:id([0-9]{1,10})', async (req, res, next) => {
    let id = parseInt(req.params.id);

    let item = (await db.query(`SELECT * FROM inventory
    WHERE id = $1`, [id])).rows[0];
    let category = (await db.query(`SELECT * FROM categories
    WHERE id = $1`, [item.categoryid])).rows[0];

    res.render('item', {
        linkActive: 'order',
        item: item,
        category: category.name,
        isSeasonal: category.seasonal
    });
});

router.get('/', (req, res, next) => res.status(404).send("Still in progress..."));

module.exports = router;