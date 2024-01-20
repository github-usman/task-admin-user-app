const express = require('express');
const app = express();
const cors = require('cors');
const apiRoutes = require('./routes/get.js');
const { connectMongodb, Admin, User } = require('./database.js');
const PORT = 3000;
const passport = require("passport");
const { initializingPassport, isAuthenticated } = require('./passportconfig.js');
const expressSession = require('express-session');

app.use(expressSession({ secret: "secret", resave: false, saveUninitialized: false }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(passport.session());
app.use(passport.initialize());
app.use(cors());
connectMongodb();
initializingPassport(passport);

app.use('/', apiRoutes);

let UPDATE_USER_ID = 0;

function updateUser(id) {
    return new Promise((resolve) => {
        UPDATE_USER_ID = id;
        resolve();
    });
}

app.get('/login', (req, res) => {
    res.render("AdminLogin");
});

app.post('/login', passport.authenticate("admin", {
    failureMessage: "Wrong Id Password",
    successMessage: 'successfully logged in',
    successRedirect: 'http://127.0.0.1:5500/Frontend/components/admin/AdminProfile.html'
}), async (req, res) => {
    // Handle successful admin authentication
});

app.post('/user-login', (req, res, next) => {
    passport.authenticate("user", (err, user, info) => {
        if (err) {
            return next(err);
        }

        if (!user) {
            return res.status(401).json({ message: 'Authentication failed' });
        }

        req.logIn(user, (err) => {
            if (err) {
                return next(err);
            }

            // User is now logged in
            updateUser(req.user.user_id)
                .then(() => {
                    res.redirect('http://127.0.0.1:5500/Frontend/components/users/UserUpdate.html')
                })
                .catch((error) => {
                    console.error(error);
                    res.status(500).json({ message: 'Internal Server Error' });
                });
        });
    })(req, res, next);
});

app.post('/register', async (req, res) => {
    const admin = await Admin.findOne({ username: req.body.username });
    if (admin) return res.status(400).send('This admin is already exists');
    const newAdmin = await Admin.create(req.body);
    res.status(201).send(newAdmin);
});

const multer = require('multer');
const Storage = multer.diskStorage({
    destination: 'uploadedImages',
    filename: function (req, file, cb) {
        cb(null, file.fieldname + 786 + '-' + '.jpeg');
    },
});

const upload = multer({ storage: Storage }).single('dispImage');

app.post('/create', async (req, res) => {
    try {
        upload(req, res, async (err) => {
            if (err) {
                return res.status(500).send('Internal Server Error');
            }
            const existingUser = await User.findOne({ user_id: req.body.user_id });

            if (existingUser) {
                return res.status(400).send('User ID already exists');
            }

            const newImage = new User({
                name: req.body.name || '-',
                password: req.body.password,
                user_id: req.body.user_id,
                dispImage: req.body.user_id,
            });

            await newImage.save();
            res.send('Successfully done');
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

const Storage2 = multer.diskStorage({
    destination: 'uploadedImages',
    filename: function (req, file, cb) {
        const user_id = UPDATE_USER_ID + '';
        if (!user_id) {
            return cb(new Error('User ID is missing'));
        }
        cb(null, `user_${user_id}.jpeg`);
    },
});
const upload2 = multer({ storage: Storage2 }).single('dispImage');

app.post(`/update`, async (req, res) => {
    try {
        const user_id = UPDATE_USER_ID + '';
        const existingUser = await User.findOne({ user_id });

        if (!existingUser) {
            return res.status(404).send('User not found');
        }

        upload2(req, res, async (err) => {
            if (err) {
                return res.status(500).send('Internal Server Error');
            }

            existingUser.name = req.body.name;
            existingUser.dispImage = `user_${UPDATE_USER_ID}`;
            existingUser.uploaded = true;

            await existingUser.save();
            res.redirect('http://127.0.0.1:5500/Frontend/components/users/UserUpdate.html');
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/get-id', (req, res) => {
    res.send({ UPDATE_USER_ID });
});

app.post(`/delete/:user_id`, async (req, res) => {
    try {
        const { user_id } = req.params;
        const existingUser = await User.findOne({ user_id });

        if (!existingUser) {
            return res.status(404).send('User not found');
        }

        existingUser.approval = false;
        existingUser.name = '-';
        existingUser.dispImage = 'dispImage786';
        existingUser.uploaded = false;

        await existingUser.save();
        res.redirect('http://127.0.0.1:5500/Frontend/components/admin/AllUsersForAdmin.html');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

app.post(`/approved/:user_id`, async (req, res) => {
    try {
        const { user_id } = req.params;
        const existingUser = await User.findOne({ user_id });

        if (!existingUser) {
            return res.status(404).send('User not found');
        }

        existingUser.approval = true;
        await existingUser.save();

        res.redirect('http://127.0.0.1:5500/Frontend/components/admin/AllUsersForAdmin.html');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/profile', (req, res) => {
    res.send(req.admin);
});

app.listen(PORT || process.env.PORT, () => {
    process.stdout.write(`listening on http://localHost ${PORT}\n`);
});
