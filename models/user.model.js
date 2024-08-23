const { default: mongoose } = require("mongoose");


const userSchema=mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    age:{type:Number,required:true},
    role:{type:String,default:"user",enum:["admin","user"]}
},{
    versionKey:false,
    timestamps:true
})

const userModel=mongoose.model('user',userSchema)

module.exports=userModel;