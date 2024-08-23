const mongoose=require('mongoose')

const tokenSchema=mongoose.Schema({
   userId:{type:String},
   blockToken:{type:String}
})

const tokenModel=mongoose.model('token',tokenSchema);

module.exports=tokenModel;