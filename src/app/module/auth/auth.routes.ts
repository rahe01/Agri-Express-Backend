import { Router } from "express";

import { validateRequest } from "../../middleware/validateRequest";
import { authValidation } from "./auth.validation";
import { authController } from "./auth.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";





const router = Router();




router.get("/me", checkAuth(Role.ADMIN, Role.USER, Role.VENDOR), authController.getMe);

router.post("/registeruser", validateRequest(authValidation.registerUserZodSchema), authController.register);
router.post("/login", validateRequest(authValidation.loginUserZodSchema), authController.login);
router.post("/verify-email", authController.verifyEmail);
router.post("/change-password", checkAuth(Role.ADMIN, Role.USER, Role.VENDOR), validateRequest(authValidation.changePasswordZodSchema), authController.changePassword);

export const authRoutes = router;