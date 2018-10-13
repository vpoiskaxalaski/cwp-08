const http = require('http');
const net = require('net');
const fs = require("fs");

const hostname = '127.0.0.1';
const port = 3000;

const handlers = {
    '/sendNumber': sendNumber,
    '/workers': getWorkers
}

let workerList = [];

const server = http.createServer((req, res) => {

    const handler = getHandler(req.url);
    let data;
    if(req.method == 'GET'){
        res.statusCode = 200;
        if(req.url=='/workers'){
            res.setHeader("Content-Type", "text/html");
            data = fs.readFileSync(".\\public\\workers.html");
        }else{
            res.setHeader("Content-Type", "text/html");
            data = fs.readFileSync(".\\public\\index.html");
        }
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
    console.log('sendNumber');
    const client = new net.Socket();

    client.connect(8124, function () {
        client.write('start'+ payload.number);

    });

    client.on('close', function () {
        workerList = [];
        console.log('Connection closed');
    });

   cb(null,{"msg":"ok"});
}
 
function getWorkers(req, res, payload, cb) {
    console.log('getWorkers');
    const client = new net.Socket();

    client.connect(8124, function () {
        client.write('getWorkers');
    });

    client.on('data', (data) => {
        
        if(data.indexOf('workers')==0){
            let d = data.slice(7,data.length);
            let d1 = JSON.parse(d);
            workerList= Array.from(d1.process);
            cb(null, JSON.stringify(workerList));   
        }if(payload.msg == "stop"){
            console.log('ask to kill');
            client.write('kill'+ payload.id);
        }if(data.indexOf('done')==0){ 
            console.log('done');
            let aswr = (data.toString()).slice(4,data.length);
            console.log(aswr);
            let obj = JSON.parse(aswr);  
            console.log(obj);              
            workerList = obj;
        }
          
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

