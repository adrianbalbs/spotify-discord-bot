import { Router } from "express";
import {
  removeUserAndToken,
  getDiscordUser,
  getUserTokenFromState,
  registerDiscordUser,
  testTokenRefresh,
  getTopTracks,
} from "../controllers/user";

const router = Router();

router.get("/user/token", getUserTokenFromState);
router.post("/user/register", registerDiscordUser);
router.get("/user/discord", getDiscordUser);
router.get("/user/refreshTest", testTokenRefresh);
router.get("/user/toptracks", getTopTracks);
router.delete("/user/remove", removeUserAndToken);
export default router;
