const fs = require('fs');
const path = require('path');
const net = require('net');
const child_process = require('child_process');

const port = 8124;

let clientID = Date.now();
console.log('--------------- Connected client: ' + (clientID) + ' ---------------');
let pathToClient = clientID + ".json";
let myChildProcess = child_process.spawn("node", [ "worker.js", pathToClient, 20]);


const server = net.createServer((client) => {
    let clientID = Date.now();
    console.log('--------------- Connected client: ' + (clientID) + ' ---------------');    

});

server.listen(port, () => {
    console.log(`Server listening on localhost:${port}`);
});