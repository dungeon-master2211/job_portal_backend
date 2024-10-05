import catchAsyncError from "../utils/catchAsyncError";
import { Request,Response,NextFunction,ErrorRequestHandler } from "express";
const errorMiddleware :ErrorRequestHandler= async(err:any,req:Request,res:Response,next:NextFunction)=>{
    if(err){
        console.log(err)
        return res.status(500).send({
            message:err.message,
            status:false
        })
    }
    next()
}

export default errorMiddleware