import express from "express";
import { uploadKeystore } from "../keystore/controller";
import { apiKeyGuard } from "../middleware/apiKeyGuard";

const router = express.Router();
router.post("/keystore/upload", apiKeyGuard, uploadKeystore);

export default router;
