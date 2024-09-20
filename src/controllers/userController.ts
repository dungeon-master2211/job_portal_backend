import User from "../models/userModel"
import catchAsyncError from "../utils/catchAsyncError"
import { Request,Response,NextFunction } from "express"
import bcrypt from "bcryptjs"
import { user } from "../schemas/userSchema"
import jwt from "jsonwebtoken"

const registerUser = catchAsyncError(async(req:Request,res:Response,next:NextFunction)=>{
    const body = await req.body
    const isExist = await User.findOne({email:body.email})
    if(isExist) return res.status(400).send({
        error:'User already exist',
        status:false
    })
    const givenPwd = body.password
    const salt = await bcrypt.genSalt(10)
    const hashPwd = await bcrypt.hash(givenPwd,salt)
    const user = await User.create({...body,password:hashPwd})
    return res.status(200).send({
        message:'User created Successfully',
        status:true
    })
})

const loginUser = catchAsyncError(async(req:Request,res:Response,next:NextFunction)=>{
    const body = await req.body
    const exist:user|null = await User.findOne({email:body.email})
    if(!exist) return res.status(400).send({
        error:'User does not exist',
        status:false
    })

    const isPasswordMatch = await bcrypt.compare(body.password,exist.password)
    if(!isPasswordMatch) return res.status(400).send({
        error:'Email or Password not correct',
        status:false
    })
    
    const SECRET:string = process.env.secret || 'hgdfjhshfjggewgyuegyuewgytuewytew6tr7ew6t786t'
    const token = await jwt.sign({
        data: exist.id
      }, SECRET , { expiresIn: '1h' });
    
    return res.cookie('jobportal',token).send({
        id:exist.id,
        name:exist.name,
        role:exist.role
    })
})

const logoutUser = catchAsyncError(async(req:Request,res:Response,next:NextFunction)=>{
    return res.clearCookie('jobportal').send({
        message:'logged out',
        status:true
    })
})

export {registerUser,loginUser,logoutUser}