import { Router } from "express";
import { registerUser, loginUser, logoutUser, refreshAccessToken, getCurrentUser, updateAccountDetails } from "../controllers/User.controller.js";
import { verifyJwt } from "../middleware/auth.middleware.js";

const router = Router();

router.route('/register').post(registerUser)
router.route('/login').post(loginUser)
router.route('/logout').post(verifyJwt, logoutUser)
router.route('/refresh-token').post(verifyJwt, refreshAccessToken)
router.route('/current-user').get(verifyJwt, getCurrentUser)
router.route('/update-user').patch(verifyJwt, updateAccountDetails)


export default router


