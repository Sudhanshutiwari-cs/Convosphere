import React, { useEffect, useState } from 'react' // Importing React library
import { Input } from './ui/input' // Importing Input component from the UI directory
import { Button } from './ui/button' // Importing Button component from the UI directory
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useSelector } from 'react-redux';

// Signup functional component
const Signup = () => {
  const [input, setInput] = useState({
    username: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const {user} = useSelector(store=>store.auth);
  {/* change handler */}
  const changeHandler = (e) => {
    setInput({...input, [e.target.name]: e.target.value});
  }
  {/* submit handler */}
  // Handles the submission of the signup form
const submitHandler = async (e) => {
  // Prevents the default form submission behavior
  e.preventDefault();
  setLoading(true);
   // Logs the current input state to the console for debugging
  console.log(input);
  try {
    // Sends a POST request to the user registration API endpoint with the input data
    const res = await axios.post(
      'http://localhost:8000/api/v1/user/register',
      input,
      {
        headers: {
          'Content-Type': 'application/json', // Specifies the content type of the request
        },
        withCredentials: true, // Indicates whether or not cross-site Access-Control requests should be made using credentials
      }
    );
    // If the registration is successful, display a success toast message
    if (res.data.success) {
      navigate('/login');
      toast.success(res.data.message);
      setInput({
        username: "",
        email: "",
        password: "",
      });
    }
  } catch (error) {
    // Logs any errors that occur during the API request
    console.log(error);
    toast.error(error.response.data.message);
  }finally{
    setLoading(false);
  }
};
useEffect(()=>{
  if(user){
      navigate("/");
  }
},[])
  return (
    <>
      {/* Header section with the application title */}
      <div className='header items-center pb-5 text-4xl font-bold'>ConvoSphere</div> 
      {/* Container for the signup form, centered and styled */}
      <div className='flex justify-center items-center '>
        {/* Signup form with shadow and padding */}
        <form onSubmit={submitHandler} className='shadow-2xl flex flex-col gap-5 p-5 width rounded-lg border-2 border-black-900'>
          {/* Form header with title and description */}
          <div className='my-4'>
            <h1 className='font-medium text-3xl'>Signup</h1>
            <p className='my-4'>Signup to Your Account</p>
          </div>
          {/* Username input field */}
          <div>
            <span className='text-sm font-medium '>Username</span>
            <Input 
              type='text' 
              placeholder='Username' 
              className='focus-visible:ring-transparent my-2 color' 
              required 
              name='username'
              value={input.username}
              onChange={changeHandler}
            />
          </div>
          {/* Email input field */}
          <div>
            <span className='text-sm font-medium '>Email</span>
            <Input 
              type='email' 
              placeholder='Email' 
              className='focus-visible:ring-transparent my-2 color' 
              required
              name='email'
              value={input.email}
              onChange={changeHandler}
            />
          </div>
          {/* Password input field */}
          <div>
            <span className='text-sm font-medium '>Password</span>
            <Input 
              type='password' 
              placeholder='Password' 
              className='focus-visible:ring-transparent my-2 color' 
              required
              name='password'
              value={input.password}
              onChange={changeHandler}
            />
          </div>
          {/* Signup button */}
          {
            loading ? (
              <Button>
                <Loader2 className='mr-2 h-4 w-4 animate-spin'/>
                Please wait...
              </Button>
            ) : (
              <Button type='submit' className='w-full my-4'>Signup</Button>
            )
          }
          
          <span>Already have an account? <Link to='/login' className='text-blue-500'>Login</Link></span>
        </form>
      </div>
    </>
  )
}
export default Signup // Exporting the Signup component as default