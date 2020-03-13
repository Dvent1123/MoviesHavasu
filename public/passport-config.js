const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')
const User = require('../models/user')

//getUserByEmail is function that gets user associated to email provide
//getUserByID is function that gets user ID associated to the email provided
async function initialize(passport, getUserByEmail, getUserByID){
    const authenticateUser = async (email, password, done) =>{
        const user = await User.findOne({email: email})
        if(user == null) {
            return done(null, false, {message: 'No user with that email'})
        }

        try{
            if(await bcrypt.compare(password, user.password)){
                return done(null, user)
            } else{
                return done(null, false, {message: 'Password incorrect'})
            }
        }catch(e){
            return done(e)
        }
    }

    passport.use(new LocalStrategy({usernameField: 'email'}, authenticateUser))
    passport.serializeUser((user, done) =>  done(null, user.id))
    passport.deserializeUser((id, done) => {
       return done(null,User.findById(id))
    })

}


module.exports = initialize