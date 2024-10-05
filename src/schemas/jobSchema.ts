import {z} from "zod"

const postJobSchema = z.strictObject({
    companyName:z.string(),
    jobRole:z.string(),
    jobLocation:z.string(),
    jobDescription:z.string().min(120,{message:'Job Description should be minimum of 120 chars'}),
    openTill:z.string().date(),
    noOfOpenings:z.number().min(1,{message:'Minimum 1 openings is required'}),
    technologies:z.array(z.string())
    
})

interface jobapplication extends Document{
    appliedBy:string,
    appliedTo:String,
    resumePath:String,
    status:string[]
}


export {postJobSchema,jobapplication}