const express = require('express');
const app = express();

const {connectMongodb,Admin} = require('./database.js');
const PORT = 3000;
const passport = require("passport");
const {initializingPassport,isAuthenticated} = require('./passportconfig.js')
const expressSession = require('express-session')

app.use(expressSession({secret:"secret",resave:false,saveUninitialized:false}))
app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(passport.session());
app.use(passport.initialize());

connectMongodb();
initializingPassport(passport);


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

// login required
app.get('/profile',isAuthenticated,(req,res)=>{
    res.send(req.admin)
})

app.listen(PORT || process.env.PORT,()=>{
    process.stdout.write(`listening on http://localHost ${PORT}\n`);
})