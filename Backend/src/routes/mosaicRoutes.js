import express from "express";
import { createMosaic, getMosaic, addContribution } from "../controllers/mosaicController.js";

const router = express.Router();

router.post("/", createMosaic);
router.get("/:sharedCode", getMosaic);
router.post("/:sharedCode/contributions", addContribution);

export default router;