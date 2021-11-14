const passport = require('passport');
const passportJwt = require('passport-jwt');
const User = require('../models/user');

const jwtOptions = {
    jwtFromRequest: passportJwt.ExtractJwt.fromAuthHeaderWithScheme("jwt"),
    secretOrKey: process.env.ACCESS_TOKEN_SECRET,
    issuer: 'modern-stream',
    audience: "public"
};

passport.use(new passportJwt.Strategy(jwtOptions, (payload, done) => {
    User.findOne({ uid: parseInt(payload.aud) }).then((user) => {
        if (user) {
            return done(null, user, payload);
        }
        return done();
    })

}));
