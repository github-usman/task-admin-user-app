const LocalStrategy = require('passport-local').Strategy;
const passport = require('passport');
const { Admin, User } = require('./database');

exports.initializingPassport = (passport) => {
    // Admin authentication
    passport.use(
        'admin',
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

    // User authentication
    passport.use(
        'user',
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
            const admin = await Admin.findById(id);
            if (admin) {
                return done(null, admin);
            }

            const user = await User.findById(id);
            if (!user) {
                return done(null, false, { message: 'User not found' });
            }
            done(null, user);
        } catch (e) {
            done(e, false);
        }
    });
};
