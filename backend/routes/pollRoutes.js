import express from "express";
import { upload } from "../middleware/uploads.js";
import {
  createPoll,
  getPolls,
  votePoll,
} from "../controllers/pollController.js";

const router = express.Router();

// ✅ Create poll WITH image upload
router.post("/", upload.array("images"), createPoll);

// ✅ Get all polls
router.get("/", getPolls);

// ✅ Vote
router.post("/:id/vote", votePoll);

export default router;