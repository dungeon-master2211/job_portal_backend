import { Request,Response,NextFunction } from "express";
import catchAsyncError from "../utils/catchAsyncError";
import Job from "../models/jobModel"
import JobApplication from "../models/applicationModel"
import { UserRequest } from "../utils/global_interface";

const postJobs = catchAsyncError(async(req:UserRequest,res:Response,next:NextFunction)=>{
    const body = await req.body
    const recruiterId = req?.user?.id
    const createOpening = await Job.create({...body,recruitedId:recruiterId})
    return res.status(200).send({
        message:'Job posted successfully',
        status:true
    })
})

const viewJobs = catchAsyncError(async(req:UserRequest,res:Response,next:NextFunction)=>{
    const allJobs = await Job.find()
    return res.status(200).send({
        jobs:allJobs,
        status:true
    })
})

const viewJobsById = catchAsyncError(async(req:UserRequest,res:Response,next:NextFunction)=>{
    const id = req.params.id
    const jobs = await Job.findById(id)
    return res.status(200).send({
        jobs:jobs,
        status:true
    })
})

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
        error:'already applied',
        status:false
    })
    let resumePath = req?.file.originalname
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

export {postJobs,viewJobs,viewJobsById,applyToJob}