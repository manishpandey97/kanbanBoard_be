const mongoose=require('mongoose') 

const userConnet=mongoose.connect(process.env.URL);

module.exports=userConnet;