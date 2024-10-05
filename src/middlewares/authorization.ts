import { Request,Response,NextFunction } from "express";
import catchAsyncError from "../utils/catchAsyncError";
import jwt from "jsonwebtoken"
import User from "../models/userModel"
import { UserRequest } from "../utils/global_interface";
const authorizeRecruiter = catchAsyncError(async(req:UserRequest,res:Response,next:NextFunction)=>{
    const cookie  = req.cookies
    console.log(cookie)
    if(!cookie) return res.status(404).send({
        message:'Please Login',
        status:false
    })
    const ISCOOKIEEXIST = cookie['jobportal']
    if(!ISCOOKIEEXIST) return res.status(404).send({
        message:'Please Login',
        status:false
    })
    const SECRET = process.env.secret||''
    try{
        var id = jwt.verify(ISCOOKIEEXIST,SECRET) as jwt.JwtPayload
        
    }
    catch(e){
        return res.status(404).send({
            message:'Please Login',
            status:false
        })
    }
    const user = await User.findById(id.data) 
    if(!user) return res.status(404).send({
        message:'User does not exist',
        status:false
    })
    if(user.role!=='admin') return res.status(404).send({
        message:'Not Authorize to post jobs',
        status:false
    })
    req.user = user
    next()
})


export {authorizeRecruiter}