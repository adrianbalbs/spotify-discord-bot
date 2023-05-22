import { Router } from "express";
import { getUserTokenFromState } from "../controllers/user";

const router = Router();

router.get('/user', getUserTokenFromState);
export default router;