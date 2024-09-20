import { Request,Response,NextFunction } from "express"
function catchAsyncError(fn:(req:Request,res:Response,next:NextFunction)=>{}){
    return function(req:Request,res:Response,next:NextFunction){
        return Promise.resolve(fn(req,res,next)).catch(next)
    }
}

export default catchAsyncError