const express = require('express')
//created the router for the whole website
const router = express.Router()
const User = require('../models/user')

router.get('/', (req, res) => {
    res.render('rewards/index')
})


router.get('/login', (req, res) =>{
    res.render('rewards/login')
})

router.get('/register', (req, res) => {
    res.render('rewards/register', {user: new User()})
})

//skipping login portion and taking user directly to their homepage
router.post('/register',async (req, res) =>{
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    })
    try{
        const newUser = await user.save()
        //from here redirect to /login->/rewardsMember/:id->/rewardsMember/:id/editUser
        res.redirect(`rewardsMember/${newUser.id}`)
    }catch{
        console.log('Error creating user')
        res.redirect('/register')
    }
})

router.get('/rewardsMember/:id', async (req, res) =>{
    try{
        const user = await User.findById(req.params.id)
        res.render('rewards/rewardsMember', {user: user})
    }catch{
        res.redirect('/login')
    }

})

router.get('/rewardsMember/:id/editUser',async (req, res) =>{
    try{
        const user = await User.findById(req.params.id)
        res.render('rewards/editUser', {user: user})
    }catch{
        res.redirect('/login')
    }
})

router.put('/rewardsMember/:id/editUser',async (req, res) =>{
    let user
    try{
        user = await User.findById(req.params.id)
        user.name = req.body.name
        user.email = req.body.email
        user.password = req.body.password

        await user.save()
        res.redirect(`/rewards/rewardsMember/${user.id}`)
    }catch{
        res.redirect('/login')
    }
})
//exports the router so server can read it
module.exports = router