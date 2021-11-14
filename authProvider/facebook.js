const passport = require('passport');
const passportFacebook = require('passport-facebook');
const config = require('../config');
const User = require('../models/user');

const passportConfig = {
    clientID: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    callbackURL: process.env.BASE_URL + '/api/authentication/facebook/redirect',
    profileFields: ['id', 'displayName', 'name', 'gender', 'picture.type(large)']
};

if (passportConfig.clientID) {
    passport.use(new passportFacebook.Strategy(passportConfig, function (accessToken, refreshToken, profile, done) {
        User.findOne({ 'provider': 'facebook', 'uid': profile.id })
            .then((user) => {
                    if (!user) {
                        // TODO: Check if the username already exixsts
                        User.create({
                            username: profile.displayName.split(" ").map(name => name.toLowerCase()).join("."),
                            name: profile.displayName,
                            provider: 'facebook',
                            uid: profile.id,
                            photoUrl: profile.photos[0].value,
                            coverUrl: 'https://modernstream-images.s3.eu-west-1.amazonaws.com/image-1629372094193-background_profil.jpg'
                        }).then((user) => {
                            return done(null, user)
                        })
                    } else {
                        return done(null, user);
                    }

            })
    }));

    passport.serializeUser((user, done) => {
        console.log("aqui2")
        done(null, user);
    });

    passport.deserializeUser(async (data, cb) => {
        console.log("aqui")
        const user = await User.findOne({ 'provider': 'facebook', 'uid': data.uid }).catch((err) => {
            console.log("Error deserializing", err);
            cb(err, null);
        });
        if (user) cb(null, user);
    });
}


