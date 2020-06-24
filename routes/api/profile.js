// bring in dependencies

const express = require('express')
const router = express.Router()

// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
// @Route                                  Get api/profile @@
// @Description                            Test Route      @@
// @Access                                 Public          @@
router.get('/', (req, res) => res.send('Profile Route '))

// export
module.exports = router
