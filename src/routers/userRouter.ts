import express from "express"
import {registerUser,loginUser, logoutUser} from "../controllers/userController"
import {validateUserBody, validateLoginBody} from "../middlewares/schemaValidator"
import { authenticateSession } from "../middlewares/authenticate"
const router  = express.Router()

router.post('/register',validateUserBody,registerUser)
router.post('/login',validateLoginBody,loginUser)
router.get('/logout',logoutUser)
router.get('/user_session',authenticateSession)

export default router