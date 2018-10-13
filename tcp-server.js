const fs = require('fs');
const path = require('path');
const net = require('net');
const child_process = require('child_process');

const port = 8124;
let worker = {};
let workers = [];
let pworkers = [];


const server = net.createServer((client) => {
    
    client.on('data', (data) => {
        if(data.indexOf('start')==0)
        {
            let clientID = Date.now();
            console.log('--------------- Connected client: ' + (clientID) + ' ---------------');  
            let pathToClient = clientID + ".json";
            worker.id = Math.floor(Math.random()*15+230);
            let myChildProcess = child_process.spawn("node", [ "worker.js", pathToClient, data]);
            pworkers.push(myChildProcess);
            client.write('done');
        }else if(data == 'getWorkers'){           
            rwp();
            let obj = {};
            obj.process = workers;
            let workersJson = JSON.stringify(obj);
            client.write('workers'+workersJson);
        }else if(data.indexOf('kill')==0){  
                     
            let req = (data.toString()).slice(4, data.length);
            for(let i=0; i< pworkers.length; i++){
                if(pworkers[i]!==undefined){
                    if(req == pworkers[i].pid ){
                        pworkers[i].kill();
                        delete pworkers[i];
                        rwp();
                        if(workers.length==0){
                            workers.push('empty');
                        }
                        console.log(JSON.stringify(workers));
                        client.write('done' + JSON.stringify(workers));
                    }
                }
            }            
        }
    });
});

server.listen(port, () => {
    console.log(`Server listening on localhost:${port}`);
});


function rwp(){
    workers = [];
    pworkers.forEach((p)=>{
        workers.push(p.pid);
    });
}