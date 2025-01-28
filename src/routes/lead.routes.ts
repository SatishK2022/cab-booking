import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware";
import { createLead, deleteLead, getAllLeads, getLead, searchLead, updateLead } from "../controllers/lead.controller";

const router: Router = Router();

router
    .route("/")
    .post(verifyJWT, createLead)
    .get(verifyJWT, getAllLeads);

router.get("/search", verifyJWT, searchLead);

router
    .route("/:id")
    .get(verifyJWT, getLead)
    .patch(verifyJWT, updateLead)
    .delete(verifyJWT, deleteLead);

export default router;