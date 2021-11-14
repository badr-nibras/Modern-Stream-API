const passport = require('passport');
const passportLocal = require('passport-local');
const User = require('../models/user');
const {
  verifyPasswords,
  hashPassword
} = require("../helpers/password");
const jwt = require('../helpers/jwt_helper');
const createError = require('http-errors')
var bcrypt = require('bcryptjs')
var ObjectId = require('mongodb').ObjectId


/* to use passport 
passport.use(new passportLocal.Strategy(
  function (username, password, done) {
    User.findOne({ 'provider': 'local', 'username': username }, function (err, user) {
      console.log(user)
      if (err) { return done(err) }
      if (!user) { return done(null, false) }
      if (!verifyPasswords(password, user.password)) { return done(null, false) }
      try {
        return done(null, user)
      } catch (err) {
        return done(err)
      }
    });
  }
));*/


// TODO: uid
// User.create({
//   username: profile.displayName,
//   provider: 'local',
//   password: hashPassword(password)
// })

exports.signup = async (req, res) => {
  try {
    var isEmpty = req.body.username == undefined || req.body.email == undefined || req.body.phoneNumber == undefined;
    if (isEmpty) {
      res.send(createError.InternalServerError("Please fill all the fields !"))
    } else {
      User.findOne({
        username: req.body.username.toLowerCase()
      }).exec((err, user) => {
        if (err) {
          res.send(createError.InternalServerError(err))
        }
        if (user) {
          res.send("Username is already in use!")
        } else {
          User.findOne({
            email: req.body.email.toLowerCase()
          }).exec(async (err, user) => {
            if (err) {
              res.send(createError.InternalServerError(err))
            }
            if (user) {
              res.send("Email is already in use!")
            } else {
              const hashedPass = await hashPassword(req.body.password);
              const signedUpUser = new User({
                username: req.body.username.toLowerCase(),
                photoUrl: "https://modernstream-images.s3.eu-west-1.amazonaws.com/image-1629371247542-profil.jpg",
                coverUrl: "https://modernstream-images.s3.eu-west-1.amazonaws.com/image-1629372094193-background_profil.jpg",
                email: req.body.email.toLowerCase(),
                phoneNumber: req.body.phoneNumber,
                password: hashedPass
              })
              signedUpUser.save(async (err, response) => {
                if (err) {
                  res.send(createError.InternalServerError(err))
                } else {
                  var u_id = new ObjectId(response._id);
                  await User.updateOne({
                    _id: u_id
                  }, {
                    $set: {
                      uid: response._id
                    }
                  })
                  uid = response._id
                  console.log(response)
                  const accessToken = await jwt.signAccessToken(response._id)
                  const refreshToken = await jwt.signRefreshToken(response._id);
                  res.send({
                    accessToken: accessToken,
                    refreshToken: refreshToken,
                    userId: response._id
                  })
                }
              })
            }
          })
        }
      })
    }
  } catch (error) {
    res.send(createError.InternalServerError(error))
  }
}

exports.signin = async (req, res) => {
  try {
    User.findOne({
      email: req.body.email.toLowerCase()
    }).exec(async (err, user) => {
      if (err) {
        console.log(err)
        res.send(createError.InternalServerError(err))
      }
      if (!user) {
        res.send("You dont have an account yet")
      } else {
        var passwordIsValid = await bcrypt.compareSync(req.body.password, user.password);
        if (!passwordIsValid) {
          res.send("password incorrect")
        } else {
          const accessToken = await jwt.signAccessToken(user._id)
          const refreshToken = await jwt.signRefreshToken(user._id);
          res.send({
            accessToken: accessToken,
            refreshToken: refreshToken,
            userId: user._id
          })
        }
      }
    })
  } catch (error) {
    res.send(createError.InternalServerError(error))
  }
}
