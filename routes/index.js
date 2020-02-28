const express = require('express')
const router = express.Router()



router.get('/', async (req, res) => {
    var app = req.app;
    const allMoviesArray = (app.get('allMovies'))

    res.render('index', {allMoviesArray: allMoviesArray})

})


//exports the router so server can read it
module.exports = router