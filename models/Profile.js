// dependencies
// bring in mongoose depenency
const mongoose = require('mongoose')

// create profile schema
const ProfileSchema = new mongoose.Schema({
  // every profile associated to a user
  user: {
    // connects to the user model scehma created in user.js
    type: mongoose.Schema.Types.ObjectId,
    // refereences the user model we created
    ref: 'user'
  },
  // these are all the things we are putting into the profiles
  company: {
    type: String
  },
  website: {
    type: String
  },
  location: {
    type: String
  },
  status: {
    type: String,
    // this is required which means it wont proceed unless its included
    required: true
  },
  skills: {
    // is in bracket because it is an array of strings, not just one string
    type: [String],
    // this is required which means it wont proceed unless its included

    required: true
  },
  bio: {
    type: String
  },
  githubusername: {
    type: String
  },
  // this is adding an array called experience that is made up of entered informaiton
  experience: [
    // these are the different parts of the array
    {
      // first part
      title: {
        type: String,
        required: true
      },
      // second part... etc
      company: {
        type: String,
        required: true
      },
      location: {
        type: String,
        required: true
      },
      from: {
        // type of date because its easier to hold dates as date type than as a string
        type: Date,
        required: true
      },
      to: {
        // type of date because its easier to hold dates as date type than as a string
        type: Date
        // not required because they could be currently working there
      },
      current: {
        // boolean because they can only have true or fals for if they work there currently
        type: Boolean,
        // this is set to default false because they would most likely not work there currently unless they specfically say they do
        default: false
      },
      description: {
        // not required because we dont know if they want to include a description or not
        type: String

      }
    }

  ],
  // add another array for education
  education: [{
    school: {
      type: String,
      required: true
    },
    degree: {
      type: String,
      required: true
    },
    fieldofstudy: {
      type: String,
      required: true
    },
    from: {
      // easier to do date for dates
      type: Date,
      required: true
    },
    to: {
      // easier to do date for dates
      type: Date
    },
    current: {
      // boolean because they can only have true or fals for if they work there currently
      type: Boolean,
      // this is set to default false because they would most likely not work there currently unless they specfically say they do
      default: true
    },
    description: {

      // not required because we dont know if they want to include a description or not
      type: String

    }
  }
  ],
  // array for social media
  social: {
    youtube: {
      type: String
    },
    twitter: {
      type: String
    },
    facebook: {
      type: String
    },
    linkedin: {
      type: String
    },
    instagram: {
      type: String
    }
  },
  // will give current date
  date: {
    // date type is for dates
    type: Date,
    // will pull current date
    default: Date.now
  }

})

// Exports
// set profile variable to mongoose model of profile which is a ProfileSchema
module.exports = Profile = mongoose.model('profile', ProfileSchema)
