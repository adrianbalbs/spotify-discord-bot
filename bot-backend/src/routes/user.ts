import { Router } from "express";
import {
  removeUserAndToken,
  getDiscordUser,
  getUserTokenFromState,
  registerDiscordUser,
  testTokenRefresh,
  getUserTopArtists,
  getUserTopTracks,
} from "../controllers/user";

const router = Router();

router.get("/user/token", getUserTokenFromState);
router.post("/user/register", registerDiscordUser);
router.get("/user/discord", getDiscordUser);
router.get("/user/refreshTest", testTokenRefresh);
router.get("/user/toptracks", getUserTopTracks);
router.get("/user/topartists", getUserTopArtists);
router.delete("/user/remove", removeUserAndToken);
export default router;
