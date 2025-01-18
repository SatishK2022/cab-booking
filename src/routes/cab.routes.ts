import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware";
import { createCab, deleteCab, getCab, getCabs, updateCab } from "../controllers/cab.controller";
import { upload } from "../middlewares/multer.middleware";

const router: Router = Router();

router
    .route("/")
    .post(verifyJWT, upload.array("images", 5), createCab)
    .get(verifyJWT, getCabs);

router
    .route("/:id")
    .get(verifyJWT, getCab)
    .patch(verifyJWT, upload.array("images", 5), updateCab)
    .delete(verifyJWT, deleteCab);

export default router;