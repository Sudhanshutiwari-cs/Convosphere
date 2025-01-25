
import React, { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog'
import { Bookmark, MessageCircle, MoreHorizontal, Send } from 'lucide-react'
import { Button } from './ui/button'
import { FaHeart, FaRegHeart } from "react-icons/fa";
import CommentDialog from './CommentDialog'
import { toast } from 'sonner'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { setPosts, setSelectedPost } from '@/redux/postSlice'
import { Badge } from './ui/badge'

const Post = ({ post }) => {
    const [text, setText] = useState("");
    const [open, setOpen] = useState(false);
    const { user } = useSelector(store => store.auth);
    const { posts } = useSelector(store => store.post);
    const [comment, setComment] = useState(post.comments)
    const [liked, setLiked] = useState(post.likes.includes(user?._id) || false);
    const [postLike, setPostLike] = useState(post.likes.length)
    const dispatch = useDispatch();
    const changeEventHandler = (e) => {
        const inputText = e.target.value;
        if (inputText.trim().length > 0) {
            setText(inputText);
        } else {
            setText("");
        }
    }
    const likeOrDislikeEventHandler = async () => {
        try {
            const action = liked ? 'dislike' : 'like';
            const res = await axios.get(`http://localhost:8000/api/v1/post/${post._id}/${action}`, { withCredentials: true });
            if (res.data.success) {
                const updatedLikes = liked ? postLike - 1 : postLike + 1;
                setPostLike(updatedLikes);
                setLiked(!liked);
                const updatedPostData = posts.map(p =>
                    p._id === post._id ? {
                        ...p,
                        likes: liked ? p.likes.filter(id => id !== user._id) : [...p.likes, user._id]
                    } : p
                );
                dispatch(setPosts(updatedPostData));
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong");
        }
    }

    const commentHandler = async () => {
        try {
            const res = await axios.post(`http://localhost:8000/api/v1/post/${post._id}/comment`, { text }, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });
            if (res.data.success) {
                const updatedCommentData = [...comment, res.data.comment];
                setComment(updatedCommentData);

                const updatedPostData = posts.map(p =>
                    p._id === post._id ? { ...p, comments: updatedCommentData } : p
                );

                dispatch(setPosts(updatedPostData));
                toast.success(res.data.message);
                setText('');
            }
        } catch (error) {
            console.log(error);
        }
    }
    /**
     * Deletes a post by sending a DELETE request to the server endpoint.
     * On successful deletion, updates the posts state to remove the deleted post
     * and displays a success message. If an error occurs, logs the error and shows
     * an error message.
     */

    const deletePostHandler = async () => {
        try {
            const res = await axios.delete(`http://localhost:8000/api/v1/post/delete/${post?._id}`, { withCredentials: true });
            if (res.data.success) {
                const updatedPostData = posts.filter((postItem) => postItem?._id !== post._id);
                dispatch(setPosts(updatedPostData));
                toast.success(res.data.message);

            }
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong");
        }
    }
    const bookmarkHandler = async () => {
        try {
            const res = await axios.get(`http://localhost:8000/api/v1/post/${post?._id}/bookmark`, {withCredentials:true});
            if(res.data.success){
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <div className='my-8 w-full max-w-sm mx-auto'>
            <div className='flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                    <Avatar>
                        <AvatarImage src={post.author?.profilePicture} />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <div className='flex items-center gap-3'>
                    <h1 className='font-semibold'>{post.author?.username}</h1>
                    {
                        user?._id === post.author?._id && <Badge>Author</Badge>
                    }
                    </div>
                    
                </div>
                <Dialog>
                    <DialogTrigger asChild>
                        <MoreHorizontal className='cursor-pointer' />
                    </DialogTrigger>
                    <DialogContent className='flex flex-col items-center text-center text-sm'>
                        {
                            user && user._id !== post.author?._id &&
                        <Button variant='ghost' className=' w-[80%] font-bold text-[#ED4956] rounded-xl hover:border-1 border-black'>UnFollow</Button>
                    }
                        <Button onClick={bookmarkHandler} variant='ghost' className=' w-[80%]  rounded-xl '>Save This Post</Button>
                        {
                            user && user._id === post.author?._id &&
                             <Button onClick={deletePostHandler} variant='ghost' className=' w-[80%]  rounded-xl '>Delete</Button>
                             
                        }

                    </DialogContent>
                </Dialog>
            </div>
            <img src={post.image} alt="post image" className='rounded-xl my-2 w-full aspect-square object-cover' />
            <div className='flex items-center justify-between my-2'>
                <div className='flex items-center gap-3'>
                    {
                        liked ? <FaHeart onClick={likeOrDislikeEventHandler} size={'24'} className='cursor-pointer text-red-600' /> : <FaRegHeart onClick={likeOrDislikeEventHandler} size={'22px'} className='cursor-pointer hover:text-gray-600' />
                    }

                    <MessageCircle onClick={() => {
                        dispatch(setSelectedPost(post));
                        setOpen(true)
                    }} className='cursor-pointer hover:text-gray-700' />
                    <Send className='cursor-pointer hover:text-gray-700' />
                </div>
                <Bookmark onClick={bookmarkHandler} className='cursor-pointer hover:text-gray-700' />
            </div>
            <span className='font-medium block mb-2'>{postLike} Likes</span>
            <p>
                <span className='font-medium mr-2'>{post.author?.username}</span>
                {post.caption}
            </p>
            <span onClick={() => {
                dispatch(setSelectedPost(post));
                setOpen(true);
            }} className='cursor-pointer text-sm text-gray-400'>View All {comment?.length} Comments</span>
            <CommentDialog open={open} setOpen={setOpen} />
            <div className='flex items-center justify-between'>
                <input type="text"
                    placeholder='Add a comment...'
                    value={text}
                    onChange={changeEventHandler}
                    className='outline-none text-sm w-full' />
                {
                    text && <span onClick={commentHandler} className='text-[#2e8bca] cursor-pointer'>Post</span>
                }

            </div>


        </div>
    )
}

export default Post