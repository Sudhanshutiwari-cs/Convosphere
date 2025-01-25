import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { editProfile, followOrUnfollow, getprofile, getSuggestedUsers, login, logout, register } from "../controllers/user.controller.js";
import upload from "../middlewares/multer.js";
const router= express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/:id/profile").get(isAuthenticated,getprofile);
router.route("/suggested").get(isAuthenticated,getSuggestedUsers);
router.route("/followfollower/:id").post(isAuthenticated,followOrUnfollow);
router.route("/profile/edit").post(isAuthenticated,upload.single("profilePicture"),editProfile);

export default router;