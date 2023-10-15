import express from "express";
import authController from "../../controllers/auth-controller.js";
import isEmptyBody from "../../middlewares/isEmptyBody.js";
import ValidateBody from "../../decorators/validateBody.js";
import { userSignupSchema, userSignInSchema } from "../../models/User.js";
import authenticated from "../../middlewares/authenticated.js";
const userSignupValidate = ValidateBody(userSignupSchema);
const userSignInValidate = ValidateBody(userSignInSchema);

const authRouter = express.Router();
authRouter.post("/signup",isEmptyBody,userSignupValidate,authController.signup);

authRouter.post("/signin", isEmptyBody, userSignInValidate, authController.signin);

authRouter.get("/current", authenticated, authController.getCurrent);

authRouter.post("/signout", authenticated, authController.signout)
export default authRouter;
