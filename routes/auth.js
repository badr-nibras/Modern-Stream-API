var express = require('express');
var router = express.Router();
const passport = require('passport');
const jwt = require('../helpers/jwt_helper');
const auth = require('../authProvider/local')

require('../authProvider/jwt');
require('../authProvider/local');
require('../authProvider/google');
require('../authProvider/facebook');


const successLoginUrl = process.env.UI_URL + "/success"
const errorLoginUrl = process.env.UI_URL + "/failure"

async function generateUserToken(req, res) {
    try {
        const userId = req.user.uid
        const accessToken = await jwt.signAccessToken(userId)
        const refreshToken = await jwt.signRefreshToken(userId)
        // If deployed under the same domaine name
        // localStorage.setItem("accessToken", accessToken)
        // localStorage.setItem("refreshToken", refreshToken)
        res.send({ accessToken, refreshToken, userId })
        //req.session.destroy()
    } catch (error) {
        console.log(error)
        next()
    }
    
}
router.post('/local/signup', auth.signup)

router.post('/local/login', auth.signin)


router.get('/google/start',
    passport.authenticate('google', { scope: ['openid', 'profile', 'email'] }))
router.get('/google/redirect',
    passport.authenticate('google', {
        failureMessage: "Cannot login to Google, please try again later!",
        failureRedirect: errorLoginUrl,
        successRedirect: successLoginUrl,
    }))

router.get('/facebook/start',
    passport.authenticate('facebook', {scope: ['public_profile'] }))
router.get('/facebook/redirect',
    passport.authenticate('facebook', {
        failureMessage: "Cannot login to Facebook, please try again later!",
        failureRedirect: errorLoginUrl,
        successRedirect: successLoginUrl
    }),
    function(req, res) {
        console.log(req)
        console.log(req.session)
        console.log(req.user)
    })

router.get('/user', (req, res) => { 
    if(req.user){
        generateUserToken(req, res)
    } else {
        res.status(401).send("Not allowed")
    }
    
})

module.exports = router
