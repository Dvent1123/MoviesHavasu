const express = require('express')
//created the router for the whole website
const router = express.Router()


router.get('/', (req, res) => {
    res.render('rewards/index')
})

//exports the router so server can read it
module.exports = router