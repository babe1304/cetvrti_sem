const db = require('../db');
var express = require('express');
var router = express.Router();
var {body, validationResult} = require('express-validator')

router.get('/', async (req, res, next) => {

    let buyers = (await db.query(`SELECT buyers.*, inventory.name AS itemName, categories.name AS categoryName FROM buyers JOIN inventory ON buyers.buyerof = inventory.id
                                    JOIN categories ON inventory.categoryid = categories.id;`)).rows;

    res.render('buyers', {
        title: 'Buyers',
        linkActive: 'buyers',
        buyers: buyers
    });
});

router.get('/update-buyer/:id([0-9]{1,10})', async (req, res, next) => {
    
    let currentID = parseInt(req.params.id);

    let buyer = (await db.query(`SELECT * FROM buyers WHERE id = $1`, [currentID])).rows[0];
    console.log('Buyer:    ',buyer);
    let inventory = (await db.query(`SELECT * FROM inventory`)).rows;
    let item = (await db.query(`SELECT * FROM inventory
                                WHERE id = $1`, [buyer.buyerof])).rows[0];
    console.log('Item', item);

    res.render('update-buyer', {
        title: "Update buyer",
        linkActive: "buyers",
        buyer: buyer,
        itemID: item.id,
        inventory: {
            id: 'itemID',
            name: 'buyerof',
            list: inventory.map(item => ({
                value: item.id,
                name: item.name
            }))
        }    
    });
});

router.post('/update-buyer/:id([0-9]{1,10})', [
    body('name').trim().isLength({min:1, max:17}),
    body('surname').trim().isLength({min:1, max:17}),
    body('country').trim().isLength({min:1, max:19}),
    body('email').trim().isEmail(),
    body('year').isInt(),
    body('year').custom((year) => {
        if (year >= 1909 && year <= 2022) return true;
        else return false
    }),
    body('buyerof').trim().notEmpty()
    ], async (req, res, next) => {
    
    const errors = validationResult(req);
    let personID = parseInt(req.params.id);
    let buyer = (await db.query(`SELECT buyers.id AS id, buyers.buyerof AS buyerof 
                                FROM inventory JOIN buyers ON buyers.buyerof = inventory.id
                                WHERE buyers.id = $1`, [personID])).rows[0];

    if (!errors.isEmpty()) {
        res.render('error', {
            title: "Update buyer",
            linkActive: "buyers",
            itemID: buyer.buyerof,
            errors: errors.array(),
        });
    } else {
        try {
            await db.query(
                `UPDATE buyers
                 SET name = $1, 
                     surname = $2,
                     country = $3,
                     email = $4,
                     buyersince = $5,
                     buyerof = $6
                 WHERE id = $7;`,
                [req.body.name, req.body.surname, req.body.country, req.body.email, req.body.year, req.body.buyerof, personID]
            );
            res.redirect(`/item/${req.body.buyerof}`);
        } catch (err) {
            res.render('error', {
                title: "Update buyer",
                linkActive: "buyers",
                itemID: buyer.buyerof,
                errors: 'none',
                errDB: err.message
            });
        }
    }
});

module.exports = router;