const mongoose = require('mongoose');
const uri = 'mongodb://localhost:27017/user_cred';

exports.connectMongodb=()=>{
    mongoose.connect(uri,{})
    .then(e=>{
        process.stdout.write(`Connect to MongoDB Successfully: ${e.connection.port}`)
    })
    .catch(e=>{
        process.stdout.write(`Error DB connectivity ${e}`);
    })
}


const adminSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true,
    },
    password:String,
});


exports.Admin = mongoose.model("Admin",adminSchema);

const userSchema = new mongoose.Schema({
    user_id: {
        type: Number,
        required: true,
        unique: true,
    },
    name: {
        type: String,
    },
    password: {
        type: String,
        required: true,
    },
    dispImage: {
        type: String, 
    },
    uploaded: {
        type: Boolean,
        default:false,
        
    },
    approval: {
        type: Boolean,
        default:false,
    },
});

exports.User = mongoose.model("User", userSchema);
