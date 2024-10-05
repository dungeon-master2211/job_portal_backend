import { Request,Response,NextFunction } from "express";
import catchAsyncError from "../utils/catchAsyncError";
import Job from "../models/jobModel"
import JobApplication from "../models/applicationModel"
import { UserRequest } from "../utils/global_interface";
import { jobapplication } from "../schemas/jobSchema"; 
import path from 'node:path'
import crypto from 'crypto'

// recruiter post a job
const postJobs = catchAsyncError(async(req:UserRequest,res:Response,next:NextFunction)=>{
    const body = await req.body
    const recruiterId = req?.user?.id
    const createOpening = await Job.create({...body,recruitedId:recruiterId})
    return res.status(200).send({
        message:'Job posted successfully',
        status:true
    })
})

// all user able to view the jobs
const viewJobs = catchAsyncError(async(req:UserRequest,res:Response,next:NextFunction)=>{
    const allJobs = await Job.find()
    return res.status(200).send({
        jobs:allJobs,
        status:true
    })
})

// view all posted jobs by a recruiter
const viewJobsById = catchAsyncError(async(req:UserRequest,res:Response,next:NextFunction)=>{
    const id = req.params.id
    const jobs = await Job.find({recruitedId:id})
    return res.status(200).send({
        jobs:jobs,
        status:true
    })
})

// view applicants applied to given job
const viewApplicants = catchAsyncError(async(req:Request,res:Response,next:NextFunction)=>{
    const id = req.params.id
    const allAplicants = await JobApplication.find({appliedTo:id}).populate('appliedBy')
    return res.status(200).send({
        applicants:allAplicants,
        status:true
    })
})

// download resume of a candidate

const downloadResume = catchAsyncError(async(req:Request,res:Response,next:NextFunction)=>{
    const appliedBy = req.query.appliedBy
    const appliedTo = req.query.appliedTo
    const application:jobapplication[] = await JobApplication.find({appliedTo:appliedTo,appliedBy:appliedBy})
    const resumePath:string = application[0].resumePath.toString()
    const PATH_TO_UPLOAD = path.join(__dirname,'../../uploads/')
    const resumeFullPath = path.join(PATH_TO_UPLOAD,resumePath)
    return res.download(resumeFullPath)
})

// action on application

const applicationAction = catchAsyncError(async(req:Request,res:Response,next:NextFunction)=>{
    const appliedBy = req.query.appliedBy
    const appliedTo = req.query.appliedTo
    const action:string = (req.query.action) as string
    let actionEnum = ['accepted','rejected']
    if (!actionEnum.includes(action)){
        return res.status(400).send({
            status:false,
            message:"action not applicable"
        })
    }
    const application = await JobApplication.findOneAndUpdate({appliedTo:appliedTo,appliedBy:appliedBy},
        {
            status:action
        },
        {new:true}
    )
    
    return res.status(200).send({
        message:'Action applied successfully',
        status:true
    })
})

// candidates able to view applied jobs

const myAppliedJobs = catchAsyncError(async(req:UserRequest,res:Response,next:NextFunction)=>{
    const id = req?.user?._id
    let companyNameToSearch = (req.query?.companyName || '' ) as string
    companyNameToSearch = companyNameToSearch.trim()
    let allAppliedJobs=[]
    if(companyNameToSearch){
        
        allAppliedJobs = await JobApplication.find({appliedBy:id}).populate({
            path:'appliedTo',
            match:{companyName:{
                $regex:companyNameToSearch,
                $options:'i'
            }}
        })
        allAppliedJobs = allAppliedJobs.filter((item)=>item.appliedTo!=null)
    }else{
        allAppliedJobs = await JobApplication.find({appliedBy:id}).populate('appliedTo')
    }
    return res.status(200).send({
        jobs:allAppliedJobs,
        status:true
    })
})

// apply to a job
const applyToJob = catchAsyncError(async(req:UserRequest,res:Response,next:NextFunction)=>{
    const body = await req.body
    const appliedTo = body.appliedTo
    if(!appliedTo) return res.status(404).send({
        message:'Job Id to apply is not provided',
        status:false
    })
    const appliedBy = req?.user?.id
    if(!appliedBy) return res.status(404).send({
        message:'user Id to apply is not provided',
        status:false
    })
    if(!req.file) return res.status(404).send({
        message:'Provide resume',
        status:false
    })
    const alreadyApplied = await JobApplication.findOne({appliedBy,appliedTo})
    if(alreadyApplied) return res.status(404).send({
        message:'Already applied',
        status:false
    })
    let uid = crypto.randomUUID()
    let resumePath = req?.file.originalname
    resumePath+=uid
    const apply = await JobApplication.create({
        appliedBy,appliedTo,resumePath
    })

    const updateApplicant = await Job.findByIdAndUpdate(appliedTo,
        { $inc: { applicants: 1 } },
        { new: true }
    )
    return res.status(200).send({
        message:'Successfully updated',
        status:true
    })

})

export {postJobs,viewJobs,viewJobsById,applyToJob,myAppliedJobs,viewApplicants,downloadResume,applicationAction}