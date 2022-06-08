// potrebno napisati
const express = require('express');
const app = express();
var path = require('path');

const homeRouter = require('./routes/home.routes');
const itemRouter = require('./routes/item.routes');
const orderRouter = require('./routes/order.routes');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({ extended: true }));
app.use('/', homeRouter);
app.use('/item', itemRouter);
app.use('/order', orderRouter);


app.listen(3000);