import express from "express";
import {loginController, registerController, testController,forgotPasswordController} from '../controllers/authController.js'
import { isAdmin, requireSignIn } from "../middlewares/authMiddleWare.js";

//router object
const router = express.Router();

//routing
//register/method post
router.post("/register",registerController)

//login method
router.post("/login",loginController);

//test route
router.get('/test', requireSignIn,isAdmin,testController);

//protected auth route
router.get("/user-auth",requireSignIn,(req,res)=>{
    res.status(200).send({ok:true});
});

//forgot password route
router.post('/forgot-password',forgotPasswordController);

export default router;
