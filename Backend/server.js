const express = require('express');
const app = express();
const {connectMongodb} = require('./database.js');
const PORT = 3000;

connectMongodb();
app.get("/",(req,res)=>{
    res.send("Hello World");
});

app.post('/register',(req,res)=>{

})

app.listen(PORT || process.env.PORT,()=>{
    process.stdout.write(`listening on http://localHost ${PORT}\n`);
})