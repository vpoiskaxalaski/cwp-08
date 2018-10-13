const http = require('http');
const net = require('net');
const fs = require("fs");

const hostname = '127.0.0.1';
const port = 3000;

const handlers = {
    '/sendNumber': sendNumber
}

const server = http.createServer((req, res) => {
    console.log(req.url);
    console.log(req.body);
    const handler = getHandler(req.url);

    if(req.method == 'GET'){
        res.statusCode = 200;
        res.setHeader("Content-Type", "text/html");
        let data = fs.readFileSync(".\\public\\index.html");
        res.end(data);
    }else if(req.method == 'POST'){
        
        parseBodyJson(req, (err, payload) => {
            handler(req, res, payload, (err, result) => {
              if (err) {
                res.statusCode = err.code;
                res.setHeader('Content-Type', 'application/json');
                res.end( JSON.stringify(err) );
                return;
              }
              console.log('!err');
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.end( JSON.stringify(result) );
            });
        });
    }
   
});


server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});

function getHandler(url) {
    return handlers[url] || notFound;
}

function sendNumber(req, res, payload, cb) {

    const client = new net.Socket();

    client.connect(8124, function () {
        client.write(payload.number);
    });

    client.on('close', function () {
        console.log('Connection closed');
    });
}
  
  function notFound(req, res, payload, cb) {
    cb({ code: 404, message: 'Not found'});
  }
  
  function parseBodyJson(req, cb) {
    let body = [];
  
    req.on('data', function(chunk) {
      body.push(chunk);
    }).on('end', function() {
      body = Buffer.concat(body).toString();
  
      let params = JSON.parse(body);
      
      cb(null, params);
    });
  }

