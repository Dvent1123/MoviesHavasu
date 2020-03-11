const express = require('express')
//created the router for the whole website
const router = express.Router()
let newMovieArray = []

router.get('/sort', async (req, res) =>{
    var app = req.app;
    const allMoviesArray = (app.get('allMovies'))

    try{
      newSortedArray = await pageRenderSort(req.query.userSubmit, allMoviesArray)
      console.log(newSortedArray)
      res.render('movies/sort', {allMoviesArray: newSortedArray, userQuery: req.query.userSubmit})
    }catch{
      res.redirect('/')
    }
})

async function pageRenderSort(userQuery, arrayOfMovies){
  if(userQuery != null){
    newMovieArray = sortChoice(userQuery, arrayOfMovies)
  }
  return newMovieArray
}


router.get('/search', (req,res) =>{
    var app = req.app;
    const allMoviesArray = (app.get('allMovies'))

    //makes new regular expression using user input
    var re = new RegExp(req.query.title, 'i')
    var result = allMoviesArray.filter(movie =>{
        return re.test(movie.title)
    })
    console.log(result)
    res.render('movies/search',{allMoviesArray: result, userSubmit: req.query.title})
})

router.get('/', async (req, res) => {
    var app = req.app;
    const allMoviesArray = (app.get('allMovies'))
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