import express from "express";
import {
  loginController,
  refreshTokenController,
  registerController,
  userController,
} from "../controllers";
import auth from "../middlewares/auth";
const router = express.Router();

router.post("/register", registerController.register);
router.post("/login", loginController.login);
router.get("/me", auth, userController.me);
router.post("/refresh", refreshTokenController.refresh);

export default router;
