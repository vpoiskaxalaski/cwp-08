const fs = require('fs');
const path = require('path');
const net = require('net');
const child_process = require('child_process');

const port = 8124;


let workers = [];
let pworkers = [];
let pathToClient ;


const server = net.createServer((client) => {
 
    client.on('data', (data) => {

        if(data.indexOf('start')==0)
        {
            let worker = {};
            const date = new Date();
            worker.id = Date.now();
            pathToClient = worker.id + ".json";
            let num = (data.toString()).slice(5,data.length);
            let myChildProcess = child_process.spawn("node", [ "worker.js", pathToClient, num]);
            console.log(`Spawned child pid: ${myChildProcess.pid}`);
            worker.startedOn= date.getHours()+':'+ date.getMinutes()+ ':'+ date.getSeconds();    
            console.log('--------------- Connected client: ' + (worker.id) + ' ---------------');  
            worker.numbers = pathToClient.toString(); 
            worker.pid = myChildProcess.pid;
            pworkers.push(myChildProcess);                       
            workers.push(worker);
            
            client.write('create' + JSON.stringify(worker) );
        }else if(data == 'getWorkers'){           
            //console.log(workers);  
            client.write('workers'+ JSON.stringify(workers));
        }else if(data.indexOf('kill')==0){  
          //  console.log(workers);
    
            let req = (data.toString()).slice(4, data.length);
   
            for(let i=0; i< pworkers.length; i++){
                if(pworkers[i]!==undefined){
                    if(req == pworkers[i].pid ){
                        pworkers[i].kill();
                        delete pworkers[i];
                        let removeWorker = rwp(req);
                        
                        if(workers.length==0){
                            workers.push('empty');
                        }
                        console.log(removeWorker);
                        client.write('done' + JSON.stringify(removeWorker));
                    }
                }
            }            
        }
    });
});

server.listen(port, () => {
    console.log(`Server listening on localhost:${port}`);
});


function rwp(j){
    let rw;
    for(let k =0; k< workers.length;k++){
        if(workers[k]!== undefined)
        {
            if(workers[k].pid == j)
            {
                rw=workers[k];
                delete workers[k];
            }
        }
                  
    }
    return rw;
    //console.log(workers);
}