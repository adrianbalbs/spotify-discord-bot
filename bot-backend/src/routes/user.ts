import { Router } from "express";
import { getDiscordUser, getUserTokenFromState, registerDiscordUser } from "../controllers/user";

const router = Router();

router.get('/user/token', getUserTokenFromState);
router.post('/user/register', registerDiscordUser);
router.get('/user/discord', getDiscordUser);
export default router;