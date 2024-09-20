import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
    companyName:{
        type:String,
        required:[true,'Company Name is required']
    },
    jobRole:{
        type:String,
        required:[true,'Please specify role of job'],
    },
    jobLocation:{
        type:String,
        required:[true,'Job Location is required']
    },
    openTill:{
        type:Date,
        required:[true,'Application closing time is required']
    },
    noOfOpenings:{
        type:Number,
        required:[true,'Number of opening is required']
    },
    applicants:{
        type:Number,
        default:0
    },
    technologies:{
        type:[String],
        required:[true,'Tech Stack is required']
    },
    postedOn:{
        type:Date,
        default: new Date(Date.now())
    },
    recruitedId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user',
        required:[true,'Recruiter is required']
    }
})

const jobModel = mongoose.model('job',jobSchema)
export default jobModel