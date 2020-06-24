// bring in dependencies

const express = require('express')
const router = express.Router()

// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
// @Route                                    Get api/auth  @@
// @Description                              Test Route    @@
// @Access                                   Public        @@
router.get('/', (req, res) => res.send('Auth Route '))

// export
module.exports = router
