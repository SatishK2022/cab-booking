import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware";
import { getLeads, createLead } from "../controllers/lead.controller";

const router: Router = Router();

router
    .route("/")
    .post(verifyJWT, createLead)
    .get(verifyJWT, getLeads);

export default router;