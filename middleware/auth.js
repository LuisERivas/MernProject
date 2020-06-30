// dependencies

// bring in jwt
const jwt = require('jsonwebtoken')

// bring in stuff from config
const config = require('config')

// export
// we will export this function with 3 things, the request being done, the response, and the next action to take
module.exports = function (req, res, next) {
  // get token from header
  const token = req.header('x-auth-token')
  // check if no token
  if (!token) {
    // if no token, send out this message in json format
    return res.status(401).json({ msg: 'No token, auth denied dude' })
  }
  // if token is available verify token
  try {
    // decodes the token so we can use it. requires token and secret with is found by using config
    const decoded = jwt.verify(token, config.get('jwtSecret'))
    // set req.user as user with the decoding being done to it(this allows us to use req.user for any future protected routes)
    req.user = decoded.user
    // this is to tell middleware to move on to the next thing if the token is correct
    next()
    // if the token provided is not valid
  } catch (err) {
    // if there is an error with the toek
    res.status(401).json({ msg: 'Token is not valid my dude' })
  }
}
