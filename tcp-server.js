const fs = require('fs');
const path = require('path');
const net = require('net');
const child_process = require('child_process');

const port = 8124;
let workers = [];


const server = net.createServer((client) => {
    let clientID = Date.now();
    console.log('--------------- Connected client: ' + (clientID) + ' ---------------');  
    
    client.on('data', (data) => {
        let clientID = Date.now();
        let pathToClient = clientID + ".json";
        let myChildProcess = child_process.spawn("node", [ "worker.js", pathToClient, data]);
    });
});

server.listen(port, () => {
    console.log(`Server listening on localhost:${port}`);
});