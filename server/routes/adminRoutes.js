import { Router } from "express";
import { adminLogin } from "../controllers/authcontoller.js";
import { verifyAdmin } from "../middleware/verifyAdmin.js";
import { createSub } from "../controllers/subController.js";

const router = Router();

router.route('/login').post(adminLogin);
router.route('/addSub').post(verifyAdmin, createSub);

export default router
