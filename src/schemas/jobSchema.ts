import {z} from "zod"

const postJobSchema = z.object({
    companyName:z.string(),
    jobRole:z.string(),
    jobLocation:z.string(),
    openTill:z.string().date(),
    noOfOpenings:z.number().min(1,{message:'Minimum 1 openings is required'}),
    technologies:z.array(z.string())
    
})



export {postJobSchema}