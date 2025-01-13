import { Router } from "express";
import { loginUser, logoutUser } from "../controllers/user.controller";
import { verifyJWT } from "../middlewares/auth.middleware";

const router: Router = Router();

router.post("/login", loginUser);
router.post("/logout", verifyJWT, logoutUser);

export default router;