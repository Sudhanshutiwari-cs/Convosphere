import  { Post } from "../models/post.model.js";
import sharp from "sharp";
import cloudinary from "../utils/cloudinary.js";
import { User } from "../models/user.model.js";
import { Comment } from "../models/comment.model.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

export const addNewPost = async (req, res) => {
    try {
        const { caption } = req.body;
        const image = req.file;
        const authorId = req.id;

        if (!image) {
            return res.status(400).json({
                message: "Image is required",
                success:false
            });
        }

        const optimizedImageBuffer = await sharp(image.buffer)
            .resize({ width: 800, height: 800, fit: "inside" })
            .toFormat("jpeg", { quality: 80 })
            .toBuffer();

        const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString("base64")}`;

        const cloudResponse = await cloudinary.uploader.upload(fileUri);

        const post = await Post.create({
            caption,
            image: cloudResponse.secure_url,
            author: authorId
        });

        const user = await User.findById(authorId);

        if (user) {
            user.posts.push(post._id);
            await user.save();
        }

        await post.populate({ path: 'author', select: '-password' });

        return res.status(201).json({
            message: "Post created successfully",
            post,
            success: true
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: "An error occurred while creating the post",
            success: false
        });
    }
}

export const getAllPost=async (req,res) => {
    try {
        const posts=await Post.find().sort({createdAt:-1}).populate({path:'author',select:'-password'})
        .populate({path:"author",select:"username profilePicture"})
        .populate({path:"comments",sort:{createdAt:-1},populate:{path:"author",select:"username profilePicture"}});
        return res.status(200).json({
            message:"Posts fetched successfully",
            posts,
            success:true
        })
    } catch (error) {
        console.log(error);
    }
}
//get user posts
export const getUserPosts=async (req,res) => {
    try {
        const authorId=req.id;
        const posts= await Post.find({author:authorId}).sort({createdAt:-1})
        .populate({path:'author',select:'username,profilePicture'})
        .populate({path:"comments"
            ,sort:{createdAt:-1}
            ,populate:{path:"author"
            ,select:"username,profilePicture"}});
            return res.status(200).json({
                message:"Posts fetched successfully",
                posts,
                success:true
            })
    } catch (error) {
        console.log(error);
    }
}
//get user post end

// likepost
export const  likePost = async (req,res) => {
    try {
        const likeKrneWala= req.id;
        const postId=req.params.id;
        const post=await Post.findById(postId);
        if(!post){
            return res.status(400).json({
                message:"No Post Found",
                success:false
            })
        };
    await post.updateOne({$addToSet:{likes:likeKrneWala}});
    await post.save();

    //Implement socket.io for realtime like
    const user = await User.findById(likeKrneWala).select('username profilePicture');
    const postOwnerId = post.author.toString();
    if(postOwnerId !== likeKrneWala){
        // emit a notification event
        const notification = {
            type:'like',
            userId:likeKrneWala,
            userDetails:user,
            postId,
            message:'Your post was liked'
        }
        const postOwnerSocketId = getReceiverSocketId(postOwnerId);
        io.to(postOwnerSocketId).emit('notification', notification);
    }

    return res.status(200).json({
        message:"Post Liked Successfully",
        success:true
    });

    } catch (error) {
      console.log(error);
    }
    
}

// likepost end

// dislike post
export const  dislikePost = async (req,res) => {
    try {
        const dislikeKrneWala= req.id;
        const postId=req.params.id;
        const post=await Post.findById(postId);
        if(!post){
            return res.status(400).json({
                message:"No Post Found",
                success:false
            })
        };
    await post.updateOne({$pull:{likes:dislikeKrneWala}});  
    await post.save();
    

    return res.status(200).json({
        message:"Post Disliked Successfully",
        success:true
    });

    } catch (error) {
      console.log(error);
    }
    
}
// dislike post end

// add comment
export const addComment=async (req,res) => {
    try {
        const postId=req.params.id;
        const authorId=req.id;
        const {text}=req.body;
        const post= await Post.findById(postId);
        if(!text){
            return res.status(400).json({
                message:"Comment is required",
                success:false
            })
        };
        const comment= await Comment.create(
            {
                text,
                author:authorId,
                post:postId
            }
        )
        await comment.populate({path:"author",select:"username profilePicture"});
        post.comments.push(comment._id);
        await post.save();
        return res.status(200).json({
            message:"Comment added successfully",
            comment,
            success:true
        })

    } catch (error) {
        console.log(error);
        
    }
}
// add comment end

//get post comments
export const getPostComments=async (req,res) => {
 try {
    const postId=req.params.id;
    const comments=await Comment.find({post:postId}).populate({path:"author",select:"username profilePicture"});
    if(!comments){
        return res.status(400).json({
            message:"No Comments Found",
            success:false
        })
    };
    return res.status(200).json({
        message:"Comments fetched successfully",
        comments,
        success:true
    })
   
}
   catch (error) {
    console.log(error);
    
 }
}
// get post comments end

// delete post
// deletePost method: Deletes a post and its associated comments
export const deletePost = async (req, res) => {
    try {
        const postId = req.params.id; // Retrieve the post ID from the request parameters
        const authorId = req.id; // Retrieve the author's ID from the request (assumed to be set by authentication middleware)

        // Find the post by its ID
        const post = await Post.findById(postId);
        if (!post) {
            // If the post doesn't exist, return a 400 error
            return res.status(400).json({
                message: "No Post Found",
                success: false
            });
        }

        // Check if the requesting user is the author of the post
        if (post.author.toString() !== authorId) {
            // If not, return a 400 error indicating lack of authorization
            return res.status(400).json({
                message: "You are not authorized to delete this post",
                success: false
            });
        }

        // Delete the post from the database
        await Post.findByIdAndDelete(postId);

        // Find the user who authored the post
        let user = await User.findById(authorId);
        if (user) {
            // Remove the deleted post's ID from the user's list of posts
            user.posts = user.posts.filter(id => id.toString() !== postId);
            await user.save(); // Save the updated user document
        }

        // Delete all comments associated with the deleted post
        await Comment.deleteMany({ post: postId });

        // Respond with a success message
        return res.status(200).json({
            message: "Post deleted successfully",
            success: true
        });

    } catch (error) {
        console.log(error); // Log any errors to the console

        // Respond with a 500 error if something goes wrong
        return res.status(500).json({
            message: "An error occurred while deleting the post",
            success: false
        });
    }
}
// delete post end

// bookmark post
export const bookmarkPost=async (req,res) => {
    try {
        const postId=req.params.id;
        const authorId=req.id;
        
        const post=await Post.findById(postId);
        if(!post){
            return res.status(400).json({
                message:"No Post Found",
                success:false
            })
        }
        const user=await User.findById(authorId);
        if(user.bookmarks.includes(post._id)){
            await user.updateOne({$pull:{bookmarks:post._id}});
            await user.save();
            return res.status(200).json({
                type:"unsaved",
                message:"Post Unbookmarked Successfully",
                success:true
            })
        }else{
            await user.updateOne({$addToSet:{bookmarks:post._id}});
            await user.save();
        return res.status(200).json({
            type:"saved",
            message:"Post Bookmarked Successfully",
            success:true
        })
    }
    } catch (error) {
        console.log(error);
        
}
}

// bookmark post end
