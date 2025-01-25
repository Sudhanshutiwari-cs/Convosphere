import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
import { Post } from "../models/post.model.js";
//register user code start
export const register =async(req,res)=>{
    try {
        const{username,email,password}=req.body;
        if(!username || !email || !password)
            return res.status(401).json({
                message:"Something Is Mission",
                success:false
        });
        const user =await User.findOne({email});
        if(user){
            return res.status(401).json({
                message:"User Already Exists",
                success:false
            });
        };
        const hashedPassword=await bcrypt.hash(password,10);
        await User.create({
            username,
            email,
            password:hashedPassword
        });
        res.status(200).json({
            message:"User Created Successfully",
            success:true
        });
    } catch (error) {
        console.log(error);
        
    }
}
//register user code end

//Login user code start
export const login = async(req,res)=>{
  try {
    //get email and password from frontend
    const{email,password}=req.body;
    if(!email || !password){
        return res.status(401).json({
            message:"Enter Email and Password",
            success:false
        });
    }
    //check user
    let user= await User.findOne({email});
    if(!user){
        return res.status(401).json({
            message:"invalid email",
            success:false
        });
    }
    //check password
    const passwordmatch=await bcrypt.compare(password,user.password);
    if(!passwordmatch){
        return res.status(401).json({
            message:"Invalid password",
            success:false
        });
    };
    //send user data to frontend
    const token= await jwt.sign({userId:user._id},process.env.JWT_SECRET,{expiresIn:"1d"});
    const populatedPosts=await Promise.all(
        user.posts.map(async(postId)=>{
            const post=await Post.findById(postId);
            if(post.author.equals(user._id)){
                return post;
            }
            return null;
        })
    )
    user={
        _id:user._id,
        username:user.username,
        email:user.email,
        followers:user.followers,
        following:user.following,
        profilePicture:user.profilePicture,
        bio:user.bio,
        posts:user.posts,
        bookmarks:user.bookmarks
    };
    //send token to frontend
   
    res.cookie("token",token,{httpOnly:true,sameSite:"strict",maxAge:24*60*60*1000}).json({
        message:`Welcome Back ${user.username}`,
        success:true,
        user
    });

    

  } catch (error) {
    console.log(error);
    
  }
};
//Login user code end

//Logout user code start

export const logout = async(_,res)=>{
    try {
        return res.cookie("token","",{maxAge:0}).json({
            message:"Logged Out Successfully",
            success:true
        });
    } catch (error) {
        console.log(error);
        
    }
};
//Logout user code end

//getprofile code start
export const getprofile = async(req,res)=>{
    try {
        const userId=req.params.id;
        let user=await User.findById(userId).populate({path:"posts",createdAt:-1}).populate('bookmarks').select("-password");
        if(user){
            return res.status(200).json({
                message:"User Found",
                success:true,
                user
            });
        }
        return res.status(404).json({
            message:"User Not Found",
            success:false
        });
        
    } catch (error) {
        console.log(error);
        
    }
};                      
//getprofile code end

//edit profile code start

export const editProfile = async(req,res)=>{

    try {
        const UserId=req.id; //userId from middleware
        const {bio,  gender}=req.body; //bio and gender from frontend
        const profilePicture=req.file; //profile picture from frontend
        let cloudResponse; //cloudinary response
        //if profile picture is present then upload it to cloudinary
        if(profilePicture){
            const fileUri=getDataUri(profilePicture);
            cloudResponse=await cloudinary.uploader.upload(fileUri);
        }
        //find user by id
        const user= await User.findById(UserId).select("-password");
        if(!user){
            return res.status(404).json({
                message:"User Not Found",
                success:false
            })
        };
        //update user bio and gender
        if(bio) user.bio=bio;
        if(gender) user.gender=gender;
        //update user profile picture
        if(profilePicture) user.profilePicture=cloudResponse.secure_url;
        //save user
         await user.save();
         return res.status(200).json({
            message:"Profile Updated Successfully",
            success:true,
            user
         })
    } catch (error) {
        console.log(error);
        
        
    }
}

//edit profile code end

//suggest user code start

export const getSuggestedUsers= async (req,res) => {
    try {
        const SuggestedUsers= await User.find({_id:{$ne:req.id}}).select("-password");
        if(!SuggestedUsers){
            return res.status(401).json({
                message:"No Suggestions Found"
            })
        };
        return res.status(200).json({
            success:true,
            users:SuggestedUsers
        })

    } catch (error) {
        console.log(error);
        
    }
    
}
//suggest user code end

//follow and unfollow user code start

export const followOrUnfollow = async (req,res) => {
    try {
        const followKrneWala= req.id;
        const jiskeLiyeFollowKarnaHai = req.params.id;
        if(followKrneWala === jiskeLiyeFollowKarnaHai){
            return res.status(401).json({
                message:"You cannot follow yourself",
                success:false
            })
        }
        const user= await User.findById(followKrneWala);
        const targetUser = await User.findById(jiskeLiyeFollowKarnaHai);
        if(!user || !targetUser){
            return res.status(404).json({
                message:"User not found",
                success:false
            })
        }
        //check if user is already following the target user
        const isFollowing= user.following.includes(jiskeLiyeFollowKarnaHai);
        if(isFollowing){
            await Promise.all([
                User.updateOne({_id:followKrneWala},{$pull:{following:jiskeLiyeFollowKarnaHai}}),
                User.updateOne({_id:jiskeLiyeFollowKarnaHai},{$pull:{followers:followKrneWala}})
            ])
            return res.status(200).json({
                message:"Unfollowed Successfully",
                success:true
            })
        }
        else{
            await Promise.all([
                User.updateOne({_id:followKrneWala},{$push:{following:jiskeLiyeFollowKarnaHai}}),
                User.updateOne({_id:jiskeLiyeFollowKarnaHai},{$push:{followers:followKrneWala}})
            ])
            return res.status(200).json({
                message:"Followed Successfully",
                success:true
            })
        }  
    } catch (error) {
        console.log(error);
    }
}