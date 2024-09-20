import express from "express"
import {registerUser,loginUser, logoutUser} from "../controllers/userController"
import {validateUserBody, validateLoginBody} from "../middlewares/schemaValidator"
const router  = express.Router()

router.post('/register',validateUserBody,registerUser)
router.post('/login',validateLoginBody,loginUser)
router.get('/logout',logoutUser)

export default router