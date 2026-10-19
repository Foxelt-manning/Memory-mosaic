import express from "express";
import { createMosaic, getMosaic, addContribution } from "../controllers/mosaicController.js";
import upload from "../middleware/upload.js";


const router = express.Router();

router.post("/", createMosaic);
router.get("/:sharedCode", getMosaic);
router.post("/:sharedCode/contributions",
    upload.single("media"),
     addContribution);

export default router;