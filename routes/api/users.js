// bring in dependencies

const express = require('express')
const router = express.Router()

// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
// @Route                                    Get api/users @@
// @Description                              Test Route    @@
// @Access                                   Public        @@
router.get('/', (req, res) => res.send('User Route '))

// export
module.exports = router
