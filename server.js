// brings in express
const express = require('express')

// app uses express
const app = express()

// server end point (for testing right now)
app.get('/', (req, res)=> res.send('Api up and running'))

// set up port for server
// if cant find porn, it will default to 5000
const PORT =  process.env.Port || 5000

// look for server port
app.listen (PORT, () => console.log(`Server started on port: ${PORT}`))
