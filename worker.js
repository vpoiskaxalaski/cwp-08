const fs = require("fs");
let lock = 150;

function writeToFile(path, x){
    setInterval(function() {
        while(lock!==0){
           // fs.appendFile(path, Math.floor(Math.random()*15+12)+"\r", ()=>{});
            lock--;
        }
        
    }, x);
}

writeToFile(process.argv[2], process.argv[3]);
