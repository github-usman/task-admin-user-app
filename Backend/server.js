const express = require('express');
const app = express();
const cors = require('cors');
const apiRoutes = require('./routes/get.js');
const {connectMongodb,Admin,User} = require('./database.js');
const PORT = 3000;
const passport = require("passport");
const {initializingPassport,isAuthenticated} = require('./passportconfig.js')
const expressSession = require('express-session')

app.use(expressSession({secret:"secret",resave:false,saveUninitialized:false}))
app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(passport.session());
app.use(passport.initialize());
app.use(cors());
connectMongodb();
initializingPassport(passport);


app.use('/',apiRoutes);
app.get('/login',(req,res)=>{
    res.render("AdminLogin");
})

app.post('/login',passport.authenticate("local",{failureMessage:"Wrong Id Password",
    successMessage:'successfully logged in',
    successRedirect:'http://127.0.0.1:5500/components/admin/AdminProfile.html'}),
    async(req,res)=>{

})




app.post('/register',async(req,res)=>{
    const admin = await Admin.findOne({username:req.body.username});
    if(admin) return res.status(400).send('This admin is already exists');
    const newAdmin = await Admin.create(req.body);
    res.status(201).send(newAdmin);
})

// image multer
const multer = require('multer');
const Storage = multer.diskStorage({
    destination: 'uploadedImages',
    filename: function (req, file, cb) {
        cb(null, file.fieldname + 786 + '-' + '.jpeg');
    },
});

const upload = multer({ storage: Storage }).single('dispImage');

// end images
app.post('/create', async (req, res) => {
    try {
        // Check if the user_id already exists
        
        // If user_id is unique, proceed with image upload and save the new user
        upload(req, res, async (err) => {
            if (err) {
                console.log(err);
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

// const multer = require('multer');
const Storage2 = multer.diskStorage({
    destination: 'uploadedImages',
    filename: function (req, file, cb) {
        // Extract user_id from params or body, prioritizing params
        const user_id = req.params.user_id || req.body.user_id;
        if (!user_id) {
            return cb(new Error('User ID is missing'));
        }
        cb(null, `user_${user_id}.jpeg`);
    },
});
const upload2 = multer({ storage: Storage2 }).single('dispImage');

// end images
app.post('/update/:user_id', async (req, res) => {
    try {
        const { user_id } = req.params;

        // Check if the user with the specified user_id exists
        const existingUser = await User.findOne({ user_id });

        if (!existingUser) {
            return res.status(404).send('User not found');
        }

        // Proceed with image upload and update the existing user's dispImage and name
        upload2(req, res, async (err) => {
            if (err) {
                console.log(err);
                return res.status(500).send('Internal Server Error');
            }

            // Update dispImage and name fields if provided in the request body
            if (req.body.name) {
                existingUser.name = req.body.name;
            }

            if (req.body.user_id) {
                existingUser.dispImage = req.body.user_id;
            }

            // Save the updated user
            await existingUser.save();
            res.send('Successfully updated');
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});


// app.post('/create',async(req,res)=>{
//     const user = await User.findOne({user_id:req.body.user_id});
//     if(user) return res.status(400).send('already exists');
//     const newUser = await User.create(req.body);
//     res.status(201).send(newUser);
// })

// login required
app.get('/profile',isAuthenticated,(req,res)=>{
    res.send(req.admin)
})

app.listen(PORT || process.env.PORT,()=>{
    process.stdout.write(`listening on http://localHost ${PORT}\n`);
})