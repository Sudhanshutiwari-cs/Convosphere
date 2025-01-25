import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { addComment, addNewPost, bookmarkPost, deletePost, dislikePost, getAllPost, getPostComments, getUserPosts, likePost } from "../controllers/post.controller.js";
import upload from "../middlewares/multer.js";
const router=express.Router();

router.route("/addpost").post(isAuthenticated,upload.single("image"),addNewPost);
router.route("/allposts").get(isAuthenticated,getAllPost);
router.route("/userpost/all").get(isAuthenticated,getUserPosts);
router.route("/:id/like").get(isAuthenticated,likePost);
router.route("/:id/dislike").get(isAuthenticated,dislikePost);
router.route("/:id/comment").post(isAuthenticated,addComment);
router.route("/:id/comment/all").post(isAuthenticated,getPostComments);
router.route("/delete/:id").delete(isAuthenticated,deletePost);
router.route("/:id/bookmark").get(isAuthenticated,bookmarkPost);

export default router;