import express from "express"
import dotenv from "dotenv"
import cookieparser from "cookie-parser"
import mongoose from "mongoose"
import errorMiddleware from "./middlewares/errorMiddleware"
import userRouter from "./routers/userRouter"
import jobRouter from "./routers/jobRouter"
const app = express()
app.use(cookieparser())
dotenv.config()
const PORT = process.env.port

app.use(express.json())
app.get('/',async(req,res,next)=>{
    return res.status(200).send({
        message:'server working!'
    })
})
app.use(userRouter)
app.use(jobRouter)
app.use(errorMiddleware)
const DBURI:string = process.env.mongo_uri || ''
mongoose.connect(DBURI).then(res=>console.log(`DB Connected`)).catch(e=>console.log('Error connecting to DB',e)) 
app.listen(PORT,()=>{
    console.log(`App listening on ${PORT}`)
})