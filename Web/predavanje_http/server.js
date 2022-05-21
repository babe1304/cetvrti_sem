var http = require('http');

//req - zahtjev

//resp - odgovor

http.createServer((req, res) => {
    console.log(req);
    console.log("\n");
    console.log(req.url);
    res.writeHead(200, {
        'Content-type':"text/html"
    });
    res.write('Hello world!');
    res.end();
}).listen(1000);