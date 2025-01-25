import React, { useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Avatar, AvatarImage } from './ui/avatar';
import { AvatarFallback } from '@radix-ui/react-avatar';
import { Button } from './ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { setAuthUser } from '@/redux/authSlice';

const EditProfile = () => {
    const imageRef = useRef();
    const { user } = useSelector(store => store.auth);
    const [loading, setLoading] = useState(false);
    const [input, setInput] = useState({
        profilePicture: user?.profilePicture,
        bio:user?.bio,
        gender:user?.gender
    });
    const navigate=useNavigate();
    const dispatch=useDispatch();
    
    const fileChangeHandler = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setInput({...input, profilePicture:file });
        }
    }
    const selectChangeHandler = (value) => {
        setInput({...input, gender:value });
    }
    const editProfileHandler = async (e) => {
        const formData = new FormData();
        formData.append('bio', input.bio);
        formData.append('gener', input.gender);
        if(input.profilePicture) {
            formData.append('profilePicture', input.profilePicture);
        }
        try {
            setLoading(true);
            const res=await axios.post('http://localhost:8000/api/v1/user/profile/edit',formData,{
                headers:{
                    'Content-Type':'multipart/form-data',
                },
                withCredentials: true,
            });
            if(res.data.success){
                const updatedUserData={
                    ...user,
                    bio:res.data.user?.bio,
                    profilePicture:res.data.user?.profilePicture,
                    gender:res.data.user?.gender
                };
                dispatch(setAuthUser(updatedUserData));
                navigate(`/profile/${user?._id}`);
                toast.success('Profile Updated Successfully');

            }
        } catch (error) {
            console.error(error);
            toast.error(error.response.data.message);
            
        } finally {
            setLoading(false);
        }
    }
    return (
        <div className='flex max-w-2xl mx-auto pl-10'>
            <section className='flex flex-col gap-6 w-full my-8'>
                <h1 className='font-bold text-2xl'>Edit Profile</h1>
                <div className='flex items-center justify-between bg-gray-100 p-4 rounded-xl'>
                    <div className='flex items-center gap-3'>

                        <Avatar>
                            <AvatarImage src={user?.profilePicture} />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>


                        <div>
                            <h1 className='font-semibold text-sm'>{user?.username}</h1>
                            <span className='text-gray-600 text-sm'>{user?.bio || 'He/She'}</span>
                        </div>
                    </div>
                    <input ref={imageRef} onChange={fileChangeHandler} type="file" className='hidden' />
                    <Button onClick={() => imageRef.current.click()} className='bg-[#0095F6] h-8 hover:bg-[#327dae]'>Change Profile Photo</Button>
                </div>
                <div>
                    <h1 className='font-semibold text-xl mb-2'>Bio</h1>
                    <Textarea onChange={(e) => setInput({ ...input, bio: e.target.value })} value={input.bio} className='focus-visible:ring-transparent' />
                </div>
                <div>
                    <h1 className='font-semibold text-xl mb-2'>Gender</h1>
                    <Select defaultValue={input.gender} onValueChange={selectChangeHandler}>
                        <SelectTrigger className="w-full">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value='Male'>Male</SelectItem>
                                <SelectItem value="Female">Female</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                <div className='flex justify-end'>
                    {
                        loading ? (
                        <Button className='w-fit bg-[#0095F6] hover:bg-[#2f78a9]'>
                            <Loader2 className='mr-2 h-4 w-4 animate-spin'/>
                            Please Wait...
                        </Button>
                        ) : (
                        <Button onClick={editProfileHandler} className='w-fit bg-[#0095F6] hover:bg-[#2f78a9]'>Submit</Button>
                        )
                    }
                    
                </div>
            </section>
        </div>
    )
}

export default EditProfile