// potrebno napisati
const db = require('./../db');
var express = require('express');
var router = express.Router();

router.get('/', async (req, res, next) => {
    let categories = await db.query('SELECT * FROM categories');
    let inventory = await db.query('SELECT * FROM inventory');

    let mapa = new Map();
    for (let category of categories.rows) {
        let id = category.id;
        mapa.set(id, []);
        for (let item of inventory.rows) {
            if (item.categoryid == id) {
                let list = mapa.get(id);
                list.push(item);
                mapa.set(id, list);
            }
        }
    }
    
    res.render('order', {
        linkActive: 'order',
        categories: categories.rows,
        items: mapa
    });
});

module.exports = router;