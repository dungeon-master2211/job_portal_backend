import {z} from 'zod'
import {Request,Response,NextFunction} from "express"
import userSchema from '../schemas/userSchema'
import loginSchema from '../schemas/loginSchema'
import {postJobSchema} from "../schemas/jobSchema"
import catchAsyncError from '../utils/catchAsyncError'

const validateUserBody = catchAsyncError(async(req:Request,res:Response,next:NextFunction)=>{
    const body= await req.body
    userSchema.parse(body)
    next()
})

const validateLoginBody = catchAsyncError(async(req:Request,res:Response,next:NextFunction)=>{
    const body= await req.body
    loginSchema.parse(body)
    next()
})

const validateJobPostBody = catchAsyncError(async(req:Request,res:Response,next:NextFunction)=>{
    const body = await req.body
    postJobSchema.parse(body)
    next()
})

export {validateUserBody,validateLoginBody,validateJobPostBody}