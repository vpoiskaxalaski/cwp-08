const fs = require('fs');
const path = require('path');
const net = require('net');

const port = 8124;

const server = net.createServer((client) => {
    console.log('--------------- Connected client: ' + (++id) + ' ---------------');
    client.setEncoding('utf8');
});

server.listen(port, () => {
    console.log(`Server listening on localhost:${port}`);
});