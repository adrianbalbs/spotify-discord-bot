import { Router } from "express";
import { getTrackTest } from "../controllers/tracks";

const router = Router();

router.get("/tracks/get", getTrackTest);
export default router;
