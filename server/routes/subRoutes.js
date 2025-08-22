import { getAllsubject, getMySubjects } from "../controllers/subController.js";
import userAuth from "../middleware/userAuth.js";
import { Router } from "express";

const router = Router();

router.route('/getMySubs').get(userAuth, getMySubjects);
router.route('/getAllSubs').get(userAuth, getAllsubject)

export default router
