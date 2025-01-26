import useGetUserProfile from '@/hooks/userGetUserProfile';
import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { AtSign, Grid, Heart, MessageCircle, Save, User2, User2Icon, UserCircle } from 'lucide-react';

const Prolfile = () => {
  const params = useParams();
  const userId = params.id;
  useGetUserProfile(userId);
  const [activeTab, setActiveTab] = useState('posts');
  const { userProfile ,user } = useSelector(store => store.auth);
  console.log(userProfile);
  const isLoggedInUserProfile = user?._id === userProfile?._id;
  const isFollowing = userProfile?.followers.includes(user?._id);
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };
  const displayedPosts = activeTab === 'posts' ? userProfile?.posts : userProfile?.bookmarks;
  return (
    <div className='max-w-4xl flex justify-center mx-auto pl-10 '>
      <div className='flex flex-col gap-20 p-8'>
        <div className='grid grid-cols-2 '>
          <section className='flex items-center justify-center'>
            <Avatar className='h-36 w-36'>
              <AvatarImage src={userProfile?.profilePicture} alt="" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </section>
          <section>
            <div className='flex flex-col gap-5'>
              <div className='flex items-center gap-3'>
                <span className='font-semibold w-25'>{userProfile?.username}</span>
                {
                  isLoggedInUserProfile ? (
                    <>
                      <Link to='/account/edit'><Button variant='secondary' className='hover:bg-gray-200 h-8'>Edit Profile</Button></Link>
                      <Button variant='secondary' className='hover:bg-gray-200 h-8'>View Archive</Button>
                      <Button variant='secondary' className='hover:bg-gray-200 h-8'>Ad Tools</Button>
                    </>
                  ) : (
                    isFollowing ? (
                      <>
                        <Button variant='secondary' className='hover:bg-gray-300 h-8'>Unfollow</Button>
                        <Button className='bg-[#0095F6] hover:bg-[#3787bd] h-8'>Message</Button>
                      </>
                    ) :
                      (
                        <Button className='bg-[#0095F6] hover:bg-[#3787bd] h-8'>Follow</Button>
                      )

                  )
                }

              </div>
              <div className='flex items-center gap-5'>
                <p>{userProfile?.posts.length} <span className='font-semibold'>Posts</span></p>
                <p>{userProfile?.followers.length} <span className='font-semibold'>Followers</span></p>
                <p>{userProfile?.following.length} <span className='font-semibold'>Following</span></p>
              </div>
              <div className='flex flex-col gap-2'>
                <span className='font-semibold'>{userProfile?.bio || 'Bio here...'}</span>
                <Badge variant={'secondary'} className='w-fit'><AtSign /><span className='pl-1'>{userProfile?.username}</span></Badge>
              </div>
            </div>
          </section>
        </div>
        <div className='border-t border-t-gray-300 '>
          <div className='flex items-center justify-center gap-10 text-sm font-semibold'>
            <span className={`py-3 cursor-pointer flex items-center ${activeTab === 'posts' ? 'font-bold' : ''}`} onClick={() => handleTabChange('posts')}><Grid className='w-3 h-3' />POST</span>
            <span className={`py-3 cursor-pointer flex items-center  ${activeTab === 'saved' ? 'font-bold' : ''}`} onClick={() => handleTabChange('saved')}><UserCircle className='w-4 h-4' />SAVED</span>
          </div>
          <div className='grid grid-cols-3 gap-1'>
            {
              displayedPosts?.map((post) => {
                return (
                  <div key={post?._id} className='relative group cursor-pointer'>
                    <img src={post.image} alt="postimage" className='rounded-sm  w-full aspect-square object-cover' />
                    <div className='absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                      <div className='flex items-center text-white space-x-4'>
                        <button className='flex items-center gap-2 hover:text-gray-300'>
                          <Heart />
                          <span>
                            {post?.likes.length}
                          </span>
                        </button>
                        <button className='flex items-center gap-2 hover:text-gray-300'>
                          <MessageCircle />
                          <span>
                            {post?.comments.length}
                          </span>
                        </button>

                      </div>
                    </div>
                  </div>
                )
              })
            }
          </div>
        </div>
      </div>

    </div>
  )
}

export default Prolfile