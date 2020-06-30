// dependencies
const mongoose = require('mongoose')

// create schema
const UserSchema = mongoose.Schema({
  // the different parts of the user object schema: name, email, password, avatar, date
  name: {
    // names the kind of object it is, string because its text
    type: String,
    // is required means that the proram will not proceed if it is not included
    required: true
  },
  email: {
    type: String,
    required: true,
    // unique means that it will verify with the other values in the database
    // and make sure what is being created is unique or will not proceed
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  avatar: {
    type: String
  },
  date: {
    type: Date,
    // make it have date of when it is created
    default: Date.now
  }
})

// Export module
module.exports = User = mongoose.model('user', UserSchema)
