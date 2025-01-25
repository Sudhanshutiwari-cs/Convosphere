import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import upload from "../middlewares/multer.js";
import { getMessages, sendMessage } from "../controllers/message.controller.js";
const router= express.Router();

router.route("/send/:id").post(isAuthenticated,sendMessage);
router.route("/get/:id").get(isAuthenticated,getMessages);

export default router;