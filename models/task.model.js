const { default: mongoose } = require("mongoose");


const taskSchema = mongoose.Schema({
    title: { type: String, required: true,unique:true },
    descriptions: { type: String, required: true },
    duedate: { type: Date, required: true },
    status: { type: String, default: "to-do", enum: ["to-do", "progress", "done"] },
    userId:{type:mongoose.Schema.Types.ObjectId,ref:"user",required:true}
},{
    versionKey:false,
    timestamps:true
})

const taskModel = mongoose.model('task', taskSchema)

module.exports = taskModel; 