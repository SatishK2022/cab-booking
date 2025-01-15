import { Router } from "express";
import { changeCurrentPassword, loginUser, logoutUser, refreshAccessToken } from "../controllers/user.controller";
import { verifyJWT } from "../middlewares/auth.middleware";

const router: Router = Router();

router.post("/login", loginUser);
router.post("/logout", verifyJWT, logoutUser);
router.post("/change-password", verifyJWT, changeCurrentPassword);
router.post("/refresh-token", verifyJWT, refreshAccessToken);

export default router;