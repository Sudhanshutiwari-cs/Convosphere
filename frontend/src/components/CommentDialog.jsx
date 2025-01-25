import React, { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Link } from 'react-router-dom'
import { MoreHorizontal } from 'lucide-react'
import { Button } from './ui/button'
import { useDispatch, useSelector } from 'react-redux'
import Comment from './Comment'
import { toast } from 'sonner'
import axios from 'axios'
import { setPosts } from '@/redux/postSlice'

const CommentDialog = ({ open, setOpen }) => {
    const [text, setText] = useState('');
    const { selectedPost , posts } = useSelector(store => store.post);
    const [comment, setComment] = useState([]);
    const dispatch = useDispatch();
    useEffect(() => {
        if (selectedPost) {
          setComment(selectedPost.comments);
        }
      }, [selectedPost]);
    
    const changeEventHandler = (e) => {
        const inputText = e.target.value;
        if (inputText.trim().length > 0) {
            setText(inputText);
        } else {
            setText('');
        }
    }
    const sendMessageHandler = async () => {
        try {
            const res = await axios.post(`https://convosphere-xczk.onrender.com/api/v1/post/${selectedPost?._id}/comment`, { text }, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });
            if (res.data.success) {
                const updatedCommentData = [...comment, res.data.comment];
                setComment(updatedCommentData);

                const updatedPostData = posts.map(p =>
                    p._id === selectedPost._id ? { ...p, comments: updatedCommentData } : p
                );

                dispatch(setPosts(updatedPostData));
                toast.success(res.data.message);
                setText('');
            }
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <Dialog open={open}>
            <DialogContent onInteractOutside={() => setOpen(false)} className='max-w-5xl flex flex-col p-0'>
                <div className='flex flex-1'>
                    <div className='w-1/2'>
                        <img src={selectedPost?.image} alt="post image" className='w-full h-full object-cover' />
                    </div>
                    <div className='w-1/2 flex flex-col justify-between'>
                        <div className='flex items-center justify-between p-4'>
                            <div className='flex items-center gap-3'>
                                <Link>
                                    <Avatar>
                                        <AvatarImage src={selectedPost?.author?.profilePicture} />
                                        <AvatarFallback>CN</AvatarFallback>
                                    </Avatar>
                                </Link>
                                <div>
                                    <Link className='font-semibold text-xs'>{selectedPost?.author?.username} </Link>
                                </div>
                            </div>
                            <Dialog>
                                <DialogTrigger asChild>
                                    <MoreHorizontal />
                                </DialogTrigger>
                                <DialogContent className='flex flex-col items-center text-center text-sm'>
                                    <Button variant='ghost' className=' w-[80%] font-bold text-[#ED4956] rounded-xl hover:border-1 border-black'>Follow</Button>
                                    <Button variant='ghost' className=' w-[80%]  rounded-xl '>Save This Post</Button>
                                    <Button variant='ghost' className=' w-[80%]  rounded-xl '>Unfollow</Button>
                                </DialogContent>
                            </Dialog>
                        </div>
                        <hr />
                        <div className='flex-1 overflow-y-auto max-h-96 p-4'>
                            {
                                comment.map((comment) => <Comment key={comment._id} comment={comment} />)
                            }
                        </div>
                        <div className='p-4'>
                            <div className='flex items-center gap-2'>
                                <input type="text" onChange={changeEventHandler} value={text} placeholder='Add a comment...' className='outline-none p-2 rounded w-full border text-sm border-gray-300' />
                                <Button onClick={sendMessageHandler} disabled={!text.trim()} variant='outline' className='text-sm'>Post</Button>
                            </div>
                        </div>

                    </div>
                </div>

            </DialogContent>
        </Dialog>
    )
}

export default CommentDialog