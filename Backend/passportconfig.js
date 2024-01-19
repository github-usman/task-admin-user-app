const LocalStrategy = require('passport-local').Strategy;
const passport = require('passport');
const { Admin } = require('./database');
const { User } = require('./database');

exports.initializingPassport = (passport) => {
    passport.use(
        new LocalStrategy(async (username, password, done) => {
            try {
                const admin = await Admin.findOne({ username: username });
                if (!admin) {
                    return done(null, false, { message: 'Incorrect username.' });
                }
                if (admin.password !== password) {
                    return done(null, false, { message: 'Incorrect password.' });
                }
                return done(null, admin);
            } catch (err) {
                return done(err);
            }
        })
    );

    passport.serializeUser((admin, done) => {
        done(null, admin.id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const admin = await Admin.findById(id);
            if (!admin) {
                return done(null, false, { message: 'You are not an Admin' });
            }
            done(null, admin);
        } catch (e) {
            done(e, false);
        }
    });
};


exports.isAuthenticated = (req,res,next)=>{
    if(req.admin) return next();
    res.redirect('/');
};


// for user login 
exports.initializingPassport = (passport) => {
    passport.use(
        new LocalStrategy(async (user_id, password, done) => {
            try {
                const user = await User.findOne({ user_id: user_id });
                if (!user) {
                    return done(null, false, { message: 'Incorrect user_id.' });
                }
                if (user.password !== password) {
                    return done(null, false, { message: 'Incorrect password.' });
                }
                return done(null, user);
            } catch (err) {
                return done(err);
            }
        })
    );

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findById(id);
            if (!user) {
                return done(null, false, { message: 'You are not an Admin' });
            }
            done(null, user);
        } catch (e) {
            done(e, false);
        }
    });
};


exports.isAuthenticatedUser = (req,res,next)=>{
    if(req.use) return next();
    res.redirect('/');
};