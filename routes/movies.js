const express = require('express')
//created the router for the whole website
const router = express.Router()
let newMovieArray = []

router.get('/sort', async (req, res) =>{
    var app = req.app;
    const allMoviesArray = (app.get('allMovies'))

    try{
      newSortedArray = await pageRender(req.query.userSubmit, allMoviesArray)
      console.log(newSortedArray)
      res.render('movies/sort', {allMoviesArray: newSortedArray, userQuery: req.query.userSubmit})
    }catch{
      res.redirect('/')
    }
})

async function pageRender(userQuery, arrayOfMovies){
  if(userQuery != null){
    newMovieArray = sortChoice(userQuery, arrayOfMovies)
  }
  return newMovieArray
}

router.get('/search', (req,res) =>{
    var app = req.app;
    const allMoviesArray = (app.get('allMovies'))

    // let searchOptions = {}

    // searchOptions.title = new RegExp(req.query.title, 'i')
    // console.log(searchOptions.title)
    // console.log(searchOptions)
    // //const movie = allMoviesArray.find(searchOptions)

    //console.log(movie)
    
    // let query = allMoviesArray.find(movie => movie.title == req.query.title)
    // console.log(query.title)
    //this ^ works just have to find a way to use regex to query the data and then pass into movie shit
    
    // let regexp
    // let resultMovie 
    // let test = allMoviesArray.find(movie => 
    // {   regexp =  new RegExp(movie.title, 'i')
    //     resultMovie = regexp.exec(req.query.title)
    //     console.log(resultMovie)
    // })
    //code below also works but only when exact words are typed



    //code below makes new regexpression and we want to find what is inside
    //code below will take the query and execute on the string which is what the user input

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

router.get('/', async (req, res) => {
    var app = req.app;
    const allMoviesArray = (app.get('allMovies'))

    //this is rendering this page but it's still at /
    res.render('movies/index', {allMoviesArray: allMoviesArray})

})

async function sortChoice(userChoice, unsortedMovieArray){
    let sortedMovieArray = []
    if(userChoice === 'alphabetical'){
        sortedMovieArray = sortTest('title', unsortedMovieArray)
    }
    if(userChoice === 'rating'){
        sortedMovieArray = sortTest('rating', unsortedMovieArray)
    }
    if(userChoice === 'year'){
        sortedMovieArray = sortTest('release_date', unsortedMovieArray)
    }
    return sortedMovieArray
}

function sortTest(sortBy, unsortedMovieArray){
    let sortedArray = unsortedMovieArray
    return sortedArray.sort(compareValues(sortBy))
}

function compareValues(key, order = 'asc') {
    return function innerSort(a, b) {
      if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
        // property doesn't exist on either object
        return 0;
      }
  
      const varA = (typeof a[key] === 'string')
        ? a[key].toUpperCase() : a[key];
      const varB = (typeof b[key] === 'string')
        ? b[key].toUpperCase() : b[key];
  
      let comparison = 0;
      if (varA > varB) {
        comparison = 1;
      } else if (varA < varB) {
        comparison = -1;
      }
      return (
        (order === 'desc') ? (comparison * -1) : comparison
      );
    };
  }



router.get('/:_id', async (req, res) => {
    var app = req.app;
    const allMoviesArray = (app.get('allMovies'))
    
    //why does strict equality not work
    await allMoviesArray.forEach(movie => {
        if(movie._id == req.params._id){
            res.render('movies/show',{movie: movie})
        }
    })
})

//exports the router so server can read it
module.exports = router