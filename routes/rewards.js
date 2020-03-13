const express = require('express')
//created the router for the whole website
const router = express.Router()
const User = require('../models/user')
const passport = require('passport')
const bcrypt = require('bcrypt')
const initializePassport = require('../public/passport-config')
const flash = require('express-flash')


initializePassport(
    passport,
    async email => {await User.findOne({email: email})},
    async id => {await User.findById(id)}
)

router.get('/',checkNotAuthenticated,(req, res) => {
    res.render('rewards/index')
})


router.get('/login',checkNotAuthenticated ,(req, res) =>{
    res.render('rewards/login')
})


router.post('/login',checkNotAuthenticated ,passport.authenticate('local', {
    failureRedirect: '/rewards/login',
    failureFlash: true
}),async (req, res) =>{
    if(req.isAuthenticated() === true){
        try{
            const user = await User.findOne({email: req.body.email})
            res.redirect(`/rewards/rewardsMember/${user.id}`)
        }catch{
            res.redirect('/rewards/login')
        }
    }
    if(req.isAuthenticated === false){
        res.redirect('/rewards/register')
    }
})

router.get('/register',checkNotAuthenticated, (req, res) => {
    res.render('rewards/register', {user: new User()})
})

//skipping login portion and taking user directly to their homepage
router.post('/register',checkNotAuthenticated, async (req, res) =>{
    try{
        const hashedPassword = await bcrypt.hash(req.body.password, 10)

        const user = new User({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        })

        const newUser = await user.save()
        //from here redirect to /login->/rewardsMember/:id->/rewardsMember/:id/editUser
        res.redirect(`rewardsMember/${newUser.id}`)
    }catch{
        console.log('Error creating user')
        res.redirect('/register')
    }
})

router.get('/rewardsMember/:id',checkAuthenticated, async (req, res) =>{
    try{
        const user = await User.findById(req.params.id)
        res.render('rewards/rewardsMember', {user: user})
    }catch{
        res.redirect('/rewards/login')
    }

})

router.get('/rewardsMember/:id/editUser',checkAuthenticated,async (req, res) =>{
    try{
        const user = await User.findById(req.params.id)
        res.render('rewards/editUser', {user: user})
    }catch{
        res.redirect('/rewards/login')
    }
})

router.put('/rewardsMember/:id/editUser',checkAuthenticated,async (req, res) =>{
    //going to have to fix how we update password because going to have to unhash then rehash password
    let user
    try{
        user = await User.findById(req.params.id)
        user.name = req.body.name
        user.email = req.body.email
        user.password = req.body.password

        await user.save()
        res.redirect(`/rewards/rewardsMember/${user.id}`)
    }catch{
        res.redirect('/rewards/login')
    }
})

router.delete('/rewardsMember/:id/editUser', checkAuthenticated,async (req, res) =>{
    let user
    try{
        user = await User.findById(req.params.id)
        await user.remove()
        res.redirect('/rewards/register')
    }catch{
        res.redirect(`/rewards/rewardsMember/${user.id}`)
    }
})

router.delete('/rewardsMember/:id/logout', (res, req) =>{
    req.logOut()
    res.redirect('/rewards/login')
})

function checkAuthenticated( req, res, next) {
    if(req.isAuthenticated()){
        return next()
    }

    res.redirect('/rewards/login')
}

function checkNotAuthenticated(req, res, next){
    if( req. isAuthenticated()){
       return res.redirect('/rewards')
    }
    next()
}
//exports the router so server can read it
module.exports = router