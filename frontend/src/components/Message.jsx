import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Link } from 'react-router-dom'
import { Button } from './ui/button'
import useGetAllMessage from '@/hooks/useGetAllMessage'
import { useSelector } from 'react-redux'
import useGetRTM from '@/hooks/useGetRTM'

const Message = ({selectedUser}) => {
    useGetRTM();
    useGetAllMessage();
    const {messages} = useSelector(store=>store.chat);
    const {user} = useSelector(store=>store.auth);
  return (
    <div className='overflow-y-auto flex-1 p-4'>
        <div className='flex justify-center'>
            <div className='flex flex-col items-center justify-center'>
                <Avatar className='h-20 w-20'>
                    <AvatarImage src={selectedUser?.profilePicture} alt='img' />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <span>{selectedUser?.username}</span>
                <Link to={`/profile/${selectedUser?._id}`}><Button variant='secondary' className='h-8  my-2 '>View Profile</Button></Link>
            </div>
        </div>
        <div className='flex flex-col gap-4 mt-4'>
            {
                // Display messages here
                messages && messages.map((msg)=>{
                    return (
                        <div key={msg._id} className={`flex ${msg.senderId === user?._id ? 'justify-end' : 'justify-start'}`}>
                            <div className={`p-2 rounded-xl max-w-xs break-words ${msg.senderId === user?._id ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}>
                                <span>{msg.message}</span>
                            </div>
                        </div>
                    )
                })

            }
        </div>
    </div>
  )
}

export default Message