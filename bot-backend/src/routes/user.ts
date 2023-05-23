import { Router } from "express";
import {
  removeUserAndToken,
  getDiscordUser,
  getUserTokenFromState,
  registerDiscordUser,
} from "../controllers/user";

const router = Router();

router.get("/user/token", getUserTokenFromState);
router.post("/user/register", registerDiscordUser);
router.get("/user/discord", getDiscordUser);
router.delete("/user/remove", removeUserAndToken);
export default router;
