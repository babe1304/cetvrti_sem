const express = require('express');
const app = express();

app.get('/', function(req, res) {
    res.send('Hello World')
});

app.get('/neka_nova', (req, res) => res.send('Nova stranica'));

app.listen(3000);