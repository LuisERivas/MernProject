// bring in dependencies

const express = require('express')
const router = express.Router()

// bring in middleware(this makes the route protected because if the token is not availble it wont proceede)
const auth = require('../../middleware/auth')
const User = require('../../models/User')

// JWT dependency
const jwt = require('jsonwebtoken')
// config dependency
const config = require('config')

// used for checking to see if inputed stuff is correct
const { check, validationResult } = require('express-validator/check')
// Bcrypt dependency
const bcrypt = require('bcryptjs')

// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
// @Route                                    Get api/auth  @@
// @Description                              Test Route    @@
// @Access                                   Public        @@

// in order to make it protected, add the middleware as a second parameter by adding it to router.get path (Make
// async so we can use await)
router.get('/', auth, async (req, res) => {
  // try to asccess database
  try {
    // create user constant by pulling in User Model from models/User and using find by id function based on
    // their password being entered when we created the token (the req.user.id is in the token in the middleware and user.js)
    // select('-password') makes it to where the password is not shown in the information we are asking for
    const user = await User.findById(req.user.id).select('-password')
    // send user in json format
    res.json(user)
    // if cant access database run error
  } catch (err) {
    // show error
    console.error(err.message)
    // show error stat us of 500 and send text to show us what happend
    res.status(500).send('Server error')
  }
})

// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
// @Route                                    POST api/auth @@
// @Description                        auth user/get token @@
// @Access                                  Public         @@
router.post('/',

  // check('*what we are checking*', '*Custom error message*').isEmail()*must be email*
  check('email', 'Please enter a valid email').isEmail(),
  // check('*what we are checking*', '*Custom error message*').isLength({min: '*min length you want*'})*must be certain length*

  check('password', 'please enter pasword').exists(),
  // checking for errors
  async (req, res) => {
    // errors is validation result that takes in information sent in by post request (what comes from the user input)
    const errors = validationResult(req)
    // if the error value is not empty then do the following
    if (!errors.isEmpty()) {
      // send 400 request response (bad request) ** send the request in .json form and pull errors from the check done in the post (array of errors)

      return res.status(400).json({ errors: errors.array() })
    }

    // Pull information out of req.body by destructuring
    const { email, password } = req.body
    // take req.body and try to do these things
    try {
      // see if user exists by searching email(findOne is used to pick a variable to look for)
      let user = await User.findOne({ email })
      // if user is found then run this
      if (!user) {
        // run status error of 400 and bring in json text version of the error array to server
        res.status(400).json({ error: [{ msg: 'Invalid Credentials ' }] })
      }
      // compare the entered pasword by the user to the stored user password we have saved in our data base
      // and if valid make the variable isMatch be true
      const isMatch = await bcrypt.compare(password, user.password)
      // if the entered pass does not match the server password then run this error
      if (!isMatch) {
        // run status error of 400 and bring in json text version of the error array to server
        res.status(400).json({ error: [{ msg: 'Invalid Credentials ' }] })
      }
      // Return Jsonwebtoken
      // this saves the entered user information as a payload for jwt
      const payload = {
        // this pulls user instance and assigns user.id to id which was created by mongo when they were added to the server
        user: {
          id: user.id
        }
      }
      // create jwt token using the payload and the secret that is found in default json throught using config dependency
      jwt.sign(
        // uses payload we created with user id
        payload,
        // uses jwt secret given through config jwtToken
        config.get('jwtSecret'),
        // *optional* gives time limit for token
        { expiresIn: 3600 },
        // possible error, token itself
        (err, token) => {
          // if there is an error
          if (err) throw err
          // if no error send token information
          res.json({ token })
        }
      )
      // if the try fails then run this error
    } catch (err) {
      // console log error message
      console.error(err.message)
      // send error status
      res.status(500).send('Server dun Goofed')
    }
  })

// export
module.exports = router
