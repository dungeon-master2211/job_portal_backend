import mongoose, { Model,Schema } from "mongoose";
import { user } from "../schemas/userSchema"
const userSchema:Schema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,'User Name is required']
    },
    email:{
        type:String,
        required:[true,'Email is required!']
    },
    role:{
        type:String,
        required:[true,'Please specify role of user'],
        enum:['user','admin']
    },
    password:{
        type:String,
        required:[true,'Password is required']
    }
})

const userModel = mongoose.model('user',userSchema)
export default userModel