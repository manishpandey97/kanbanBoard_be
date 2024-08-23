const mongoose=require('mongoose') 

const taskConnet=mongoose.connect(process.env.URL);

module.exports=taskConnet;