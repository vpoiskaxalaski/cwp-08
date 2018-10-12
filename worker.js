const fs = require("fs");

function writeToFile(path, x){
    setInterval(function() {
        fs.appendFileSync(path, Math.floor(Math.random())+"\r");
    }, x);
}

writeToFile("worker.json", 5);