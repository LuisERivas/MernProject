// Dependencies
// brings in express
const express = require('express')
// bring in server
const connectDB = require('./config/db')

// app uses express
const app = express()
// connect databasee
connectDB()

// server end point (for testing right now)
app.get('/', (req, res) => res.send('Api up and running'))

// ALLOWS US TO MAKE REQUESTS TO ENDPOINTS

// Define Routes (connects the /api/users to the router in the users.js file)
app.use('/api/users', require('./routes/api/users'))
// Define Routes (connects the /api/users to the router in the auth.js file)
app.use('/api/auth', require('./routes/api/auth'))
// Define Routes (connects the /api/users to the router in the users.js file)
app.use('/api/profile', require('./routes/api/profile'))
// Define Routes (connects the /api/users to the router in the users.js file)
app.use('/api/posts', require('./routes/api/posts'))

// set up port for server
// if cant find porn, it will default to 5000
const PORT = process.env.Port || 5000

// look for server port
app.listen(PORT, () => console.log(`Server started on port: ${PORT}`))
