const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const db = require("../models");
const keys = require("../config/keys");

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secretOrKey


module.exports = passport => {
    passport.use(
        new JwtStrategy(opts, (jwt_payload, done) => {
            db.User.findOne({ _id: jwt_payload.id })
                .then(user => {
                    console.log(user)
                    if (user) {
                        return done(null, user);
                    }
                    return done(null, false)
                })
                .catch(err => console.log(err))
        })
    )
}