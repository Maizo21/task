const fs = require('fs')
const express = require('express');
const app = express()
const port = process.env.PORT || 8000;
const { v4: uuidv4 } = require('uuid');

app.use(express.urlencoded({ extended: true }));
app.use(express.json())


const data = fs.readFileSync(`${__dirname}/dev-data/task.json`, 'utf-8');
const dataObjt = JSON.parse(data);

function validateTask(req, res, next){
    let task = req.body.task
    if(typeof task !== 'string' || task.trim() === '') res.status(400).json({Error:'Not valid task'});

    if(task.length > 150) res.status(413).json({Error:'Task should be less than 150 characteres'})

    console.log(`'${task}' is valid`)

    next()
}

function updateStatus(req, res, next){
    let status = req.body.status
    if(typeof status !== 'string' || status.trim() === '') res.status(400).json({Error:'Not valid status'});

    if(status.length > 10) res.status(413).json({Error:'Status should be less than 10 characteres'})

    next()
}

app.get('/', (req, res)=>{
    res.status(200).json(dataObjt)
})

app.get('/task', ((req, res)=>{
    const id = req.query.id;
    const taskFound = dataObjt.tasks.find(task => task.id === id)
    console.log(id)
    console.log(taskFound)
    if(!id || id == ''){
        res.status(200).json(dataObjt)
    }else if(taskFound !== undefined){
        res.status(200).json(taskFound)
    }else{
        res.status(404).json({Error:'Task dont found'})
    }
}))

app.post('/task', validateTask, (req, res)=>{
    
    const newTask = req.body

    const task = {
        id: uuidv4(),
        task: newTask
    }
    
    dataObjt.tasks.push(task)
    fs.writeFile(`${__dirname}/dev-data/task.json`, JSON.stringify(dataObjt), 'utf-8', (err)=>{
        
        if(err){ return res.status(500).json({Error:`No fue posible agregar la tarea. ${err}`})}

        console.log(`Agregando tarea con el id ${task.id}`)
        res.set('Location', '/task');
        res.status(201).json(task); 
    })
});

app.delete('/task', (req, res)=>{
    const id = req.query.id;
    const indexTaskFound = dataObjt.tasks.findIndex(task => task.id === id);
    
    console.log(dataObjt.tasks[indexTaskFound])
    
    dataObjt.tasks.splice(indexTaskFound,1);

    fs.writeFile(`${__dirname}/dev-data/task.json`, JSON.stringify(dataObjt), 'utf-8', (err)=>{
        
        if(err){ return res.status(500).json({Error:`No fue eliminar agregar la tarea. ${err}`})}

        console.log(`Eliminando tarea con el id ${id}`)
        res.set('Location', '/task');
        res.status(201).json(dataObjt); 
    })
})

app.put('/task', updateStatus,  (req, res)=>{
    const id = req.query.id;
    const {status} = req.body;
    const indexTaskFound = dataObjt.tasks.findIndex(task => task.id === id);

    console.log(dataObjt.tasks[indexTaskFound])

    dataObjt.tasks[indexTaskFound]["status"] = status;

    console.log(dataObjt.tasks[indexTaskFound])

    fs.writeFile(`${__dirname}/dev-data/task.json`, JSON.stringify(dataObjt), 'utf-8', (err)=>{
        
        if(err){ return res.status(500).json({Error:`No fue actualizar agregar la tarea. ${err}`})}

        console.log(`Actualizando tarea con el id ${id} al estatus ${status}`)
        res.set('Location', '/task');
        res.status(201).json(dataObjt); 
    })

})

app.listen(port, ()=>{
    console.log(`Listening on port ${port}`)
})