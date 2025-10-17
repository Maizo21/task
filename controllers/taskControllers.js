const taskModel = require('../models/taskModel');
const { v4: uuidv4 } = require('uuid');

const dataObjt = taskModel.readData();
const fs = require('fs');



exports.getAllData = ((req, res)=>{
    const id = req.query.id;
    const taskFound = dataObjt.tasks.find(task => task.id === id)

    if(!id || id == ''){
        res.status(200).json(dataObjt)
    }else if(taskFound !== undefined){
        console.log(id)
        console.log(taskFound)
        res.status(200).json(taskFound)
    }else{
        res.status(404).json({Error:'Task dont found'})
    }
});

exports.postTask = ((req, res)=>{

    const newTask = req.body.task;

    if(typeof newTask !== 'string' || newTask.trim() === '') res.status(400).json({Error:'Not valid newTask'});

    if(newTask.length > 150) res.status(413).json({Error:'newTask should be less than 150 characteres'})

    console.log(`'${newTask}' is valid`)

    const task = {
        id: uuidv4(),
        task: newTask
    }

    console.log(task);
    
    dataObjt.tasks.push(task)
    taskModel.writeData(dataObjt, (err) => {
        if(err){ return res.status(500).json({Error:`No fue posible agregar la tarea. ${err}`})}
        console.log(`Agregando tarea con el id ${task.id}`)
        res.set('Location', '/task');
        res.status(201).json(task); 
    })
});

exports.deleteTask = ((req, res)=>{
    const id = req.query.id;
    const indexTaskFound = dataObjt.tasks.findIndex(task => task.id === id);
    
    console.log(dataObjt.tasks[indexTaskFound])
    
    dataObjt.tasks.splice(indexTaskFound,1);

    taskModel.writeData(dataObjt, (err) => {
        if(err){ return res.status(500).json({Error:`No fue posible eliminar la tarea. ${err}`})}
        console.log(`Eliminando tarea con el id ${id}`)
        res.set('Location', '/task');
        res.status(204).json({message: 'Task deleted'});
    })
})

exports.updateTask = ((req, res)=>{

    const {status} = req.body;
    if(typeof status !== 'string' || status.trim() === '') res.status(400).json({Error:'Not valid status'});
    
    if(status.length > 10) res.status(413).json({Error:'Status should be less than 10 characteres'})

    const id = req.query.id;
    const indexTaskFound = dataObjt.tasks.findIndex(task => task.id === id);

    console.log(dataObjt.tasks[indexTaskFound])

    dataObjt.tasks[indexTaskFound]["status"] = status;

    console.log(dataObjt.tasks[indexTaskFound])

    taskModel.writeData(dataObjt, (err) => {
        if(err){ return res.status(500).json({Error:`No fue posible actualizar la tarea. ${err}`})}
        console.log(`Actualizando tarea con el id ${id}`)
        res.set('Location', '/task');
        res.status(200).json(dataObjt.tasks[indexTaskFound]);
    })

})