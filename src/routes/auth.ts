import { Router } from "express";
import { obtainAuthToken } from "../controllers/auth";

const router = Router();

router.get('/redirect', obtainAuthToken);

export default router;
