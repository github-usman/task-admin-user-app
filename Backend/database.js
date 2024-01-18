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