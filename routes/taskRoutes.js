const express = require('express');

const taskController = require('../controllers/taskControllers');

const router = express.Router();

router.get('/', taskController.getAllData)

router.get('/task', taskController.getAllData)

router.post('/task', taskController.postTask);

router.delete('/task', taskController.deleteTask)

router.put('/task', taskController.updateTask)

module.exports = router;