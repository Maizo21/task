const express = require('express');
const app = express()
const PORT = Number(process.env.PORT) || 8000;

app.use(express.json());
app.use(express.urlencoded({ extended: true })); 

const taskRouter = require('./routes/taskRoutes')

app.use('/', taskRouter)

app.listen(PORT, '0.0.0.0', ()=>{
    console.log(`Listening on port ${PORT}`)
})