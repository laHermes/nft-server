import express from "express";
import {
  getTokenIdMetadata,
  getTokenIdImage,
} from "../controllers/nftController";

const router = express.Router();

router.get("/", (req, res) => {
  res.send("Welcome to my server!");
});

router.get("/token/:tokenId", getTokenIdMetadata);

router.get("/images/token/:tokenId", getTokenIdImage);

export default router;
