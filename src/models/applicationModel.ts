import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
    appliedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    appliedTo:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'job'
    },
    resumePath:{
        type:String,
        required:[true,'resume is required']
    },
    status:{
        type:String,
        default:'pending',
        enum:['pending','accepted','rejected']
    }
})

const applicationModel = mongoose.model('jobapplication',applicationSchema)
export default applicationModel