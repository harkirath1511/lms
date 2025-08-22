import express from "express";
import userAuth from "../middleware/userAuth.js";
import { createProfile, getProfile, updateProfile, deleteProfile } from "../controllers/profileController.js";

const profileRouter = express.Router();

profileRouter.route("/createProfile").post(userAuth,createProfile);
profileRouter.get("/getProfile",userAuth, getProfile);
profileRouter.patch("/update",userAuth,updateProfile);
profileRouter.delete("/",userAuth,deleteProfile);

export default profileRouter;
