const express = require('express')
//created the router for the whole website
const router = express.Router()

router.get('/', (req,res) =>{
    var app = req.app;
    const allMoviesArray = (app.get('allMovies'))
    let query = allMoviesArray.find(movie => movie.title == req.query.title)
    console.log(query.title)
    //this ^ works just have to find a way to use regex to query the data and then pass into movie shit
    // if(req.query.title != null && req.query.title != ''){
    //     query = query.regex('title', new RegExp(req.query.title, 'i'))
    // }

    // try{
    //     const movie = await query.exec()
    //     res.render('movies/index',
    //     {movie: movie, 
    //     searchOptions: req.query})

    // } catch{
    //     res.redirect('/')
    // }
})

router.get('/:_id', async (req, res) => {
    var app = req.app;
    const allMoviesArray = (app.get('allMovies'))
    
    //why does strict equality not work
    await allMoviesArray.forEach(movie => {
        if(movie._id == req.params._id){
            res.render('movies/index',{movie: movie})
        }
    })
})

//exports the router so server can read it
module.exports = router