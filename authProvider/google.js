const passport = require('passport');
const passportGoogle = require('passport-google-oauth');
const config = require('../config');
const User = require('../models/user');

const passportConfig = {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.BASE_URL + '/api/authentication/google/redirect'
};

if (passportConfig.clientID) {
    passport.use(new passportGoogle.OAuth2Strategy(passportConfig, function (request, accessToken, refreshToken, profile, done) {
        User.findOne({ 'provider': 'google', 'uid': profile.id })
            .then((user) => {
                if (!user) {
                    // TODO: Check if the username already exixsts
                    User.create({
                        username: profile.displayName.split(" ").map(name => name.toLowerCase()).join("."),
                        name: profile.displayName,
                        provider: 'google',
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

    passport.serializeUser((user, cb) => {
        cb(null, user.uid);
    });

    passport.deserializeUser(async (uid, cb) => {
        const user = await User.findOne({'uid': uid }).catch((err) => {
            console.log("Error deserializing", err);
            cb(err, null);
        });
        if (user) cb(null, user);
    });
}