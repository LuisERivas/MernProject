// bring in dependencies

const express = require('express')
const router = express.Router()

// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
// @Route                                    Get api/posts @@
// @Description                              Test Route    @@
// @Access                                   Public        @@
router.get('/', (req, res) => res.send('Posts Route '))

// export
module.exports = router
