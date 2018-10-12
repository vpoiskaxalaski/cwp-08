const fs = require("fs");
let lock = 15;

function writeToFile(path, x){
    setInterval(function() {
        while(lock!=0){
            fs.appendFile(path, Math.floor(Math.random())+"\r", ()=>{});
            lock--;
        }
        
    }, x);
}

writeToFile(process.argv[2], process.argv[3]);0
