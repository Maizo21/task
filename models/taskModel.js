const fs = require('fs');
exports.readData = function() {
    const data = fs.readFileSync(`${__dirname}/../dev-data/task.json`, 'utf-8');
    const dataObjt = JSON.parse(data);
    return dataObjt;
}

exports.writeData = function(dataObjt, callback) {
    fs.writeFile(`${__dirname}/../dev-data/task.json`, JSON.stringify(dataObjt), 'utf-8', (err)=>{
        if(err){ return callback(err);}
        callback(null);
    })
}
    