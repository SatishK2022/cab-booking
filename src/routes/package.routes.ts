import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware";
import { createPackage, deletePackage, getPackage, getPackages, updatePackage } from "../controllers/package.controller";
import { upload } from "../middlewares/multer.middleware";

const router: Router = Router();

router
    .route("/")
    .post(verifyJWT, upload.single("image"), createPackage)
    .get(verifyJWT, getPackages);

router
    .route("/:id")
    .get(verifyJWT, getPackage)
    .patch(verifyJWT, updatePackage)
    .delete(verifyJWT, deletePackage);

export default router;