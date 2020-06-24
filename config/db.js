// bring in dependecies
// used to have mongo interact with our sever
const mongoose = require('mongoose')
// to access the global settings we set up in the config file
const config = require('config')
// to access a specific variable form the config file
const db = config.get('mongoURI')

// to connect to mongoDB
const connectDB = async () => {
  // try to connect to server
  try {
    await mongoose.connect(db, {
      // fixes because of errors suggested by server
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    console.log('MongoDB Connected to sever bro')
    // if it cant connect to the server
  } catch (err) {
    console.error(err.message)
    // Exit process if it fails
    process.exit(1)
  }
}

// export
module.exports = connectDB
