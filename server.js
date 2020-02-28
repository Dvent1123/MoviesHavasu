if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
}
const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts')
const bodyParser = require('body-parser')


//gets the router (control) that was made in routes file
const indexRouter = require('./routes/index')
const rewardsRouter = require('./routes/rewards')
const moviesRouter = require('./routes/movies')

app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout', 'layouts/layout')
app.use(expressLayouts)
app.use(express.static('public'))
app.use(express.json())
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())


//tells the app to use our indexRouter as the control for the app
app.use('/', indexRouter)
app.use('/rewards', rewardsRouter)
app.use('/movies', moviesRouter)


const MongoClient = require('mongodb').MongoClient;
const client = new MongoClient(process.env.DATABASE_URI, { useNewUrlParser: true , useUnifiedTopology: true})


    
client.connect(err => {
        //db_obj is a database object of the test database
        const db_obj = client.db('test')
        const theaterInfo = db_obj.collection('theater')
    
        //movies function gets an array of all the movies playing
        async function movies(){
        const movieDetailsArray = (await theaterInfo.find({})
                        .toArray()
                        .then(result => result)
                        .catch(error => console.log(error)))
        
        //the result is an array of json objects
        const allMovies = await movieDetailsArray
        app.set("allMovies", allMovies)

        return allMovies
        }
        movies()
    });



app.listen(process.env.PORT || 3000)

