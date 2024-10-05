import express from "express"
import {postJobs,viewJobs,viewJobsById,applyToJob, myAppliedJobs, viewApplicants, downloadResume, applicationAction} from "../controllers/jobController"
import {validateJobPostBody} from "../middlewares/schemaValidator"
import {authorizeRecruiter} from "../middlewares/authorization"
import { authenticateUser } from "../middlewares/authenticate"
import path from "node:path"
import multer from "multer"


console.log(__dirname)
const PATH_TO_UPLOAD = path.join(__dirname,'../../uploads/')
console.log(PATH_TO_UPLOAD)
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, PATH_TO_UPLOAD) // where files will be saved
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname) // using the file's original name
    }
  })
const upload = multer({storage:storage})
const router = express.Router()

router.post('/post_job',authorizeRecruiter,validateJobPostBody,postJobs)
router.get('/jobs',viewJobs)
router.get('/my_jobs/:id',authorizeRecruiter,viewJobsById)
router.post('/apply_to_job',authenticateUser,upload.single('resume'),applyToJob)
router.get('/my_applied_job',authenticateUser,myAppliedJobs)
router.get('/view_applicants/:id',authorizeRecruiter,viewApplicants)
router.get('/download_resume',downloadResume),
router.get('/change_status',authorizeRecruiter,applicationAction)
export default router