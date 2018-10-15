const http = require('http');
const net = require('net');
const fs = require("fs");

const hostname = '127.0.0.1';
const port = 3000;

const handlers = {
    '/workers/add': addWorker,
    '/workers': getWorkers,
    '/workers/remove': removeWorker
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
        }else if (req.url=='/workers/add'){
            console.log('add');
            res.setHeader("Content-Type", "text/html");
            data = fs.readFileSync(".\\public\\index.html");
        } else if (req.url=='/workers/remove'){
            res.setHeader("Content-Type", "text/html");
            data = fs.readFileSync(".\\public\\workers1.html");
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


function addWorker(req, res, payload, cb) {
    console.log('addWorker');
    const client = new net.Socket();

    client.connect(8124, function () {
        console.log('write start');
        client.write('start'+ payload.number);

    });

    client.on('data', function (data) {
        let result;
        if((data.toString()).indexOf('create')==0){
            result = (data.toString()).slice(6, data.length);          
        }
        let w= JSON.parse(result);
        let worker = {}
        worker.id=w.id;
        worker.startedOn = w.startedOn;
        worker.pid = w.pid;

        cb(null, JSON.stringify(worker));
    });

    client.on('close', function () {
        console.log('Connection closed');
    });

   
}
 
function getWorkers(req, res, payload, cb) {
    
    console.log('getWorkers');
    const client = new net.Socket();

    client.connect(8124, function () {
        client.write('getWorkers');
    });

    client.on('data', (data) => {
        let  result;
        if(data.indexOf('workers')==0){
            result = (data.toString()).slice(7,data.length);    
                   
        }
        
        let workers = Answer(JSON.parse(result));
        cb(null, JSON.stringify(workers));  
    });

    client.on('close', function () {
        console.log('Connection closed');
    });
    
  // cb(null, workerList);  
}

function removeWorker(req, res, payload, cb) {
    console.log('removeWorkers');
    const client = new net.Socket();

    client.connect(8124, function () {
        client.write('kill'+ payload.id);
    });

    client.on('data', (data) => {
        let result;
        if(data.indexOf('done')==0){ 
          result =JSON.parse((data.toString()).slice(4,data.length));
        }
        let w= result;
        let worker = {}
        worker.id=w.id;
        worker.startedOn = w.startedOn;
        worker.pid = w.pid;
        worker.numbers = (fs.readFileSync(w.numbers)).toString();

        cb(null, JSON.stringify(worker));  
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

function Answer(w){

    let workers = Array.from(w);
    let newWorkers = [];

    workers.forEach(element => {
        let worker = {}
        worker.id=element.id;
        worker.startedOn = element.startedOn;
        worker.pid = element.pid;
        worker.numbers = (fs.readFileSync(element.numbers)).toString();
        newWorkers.push(worker);
    });
    return newWorkers;
}

function Answ(w){
    
    worker.numbers = (fs.readFileSync(w.numbers)).toString();
    return worker;
}