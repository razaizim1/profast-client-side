import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import useAuth from '../../../hook/useAuth';
import { Link, useNavigate } from 'react-router';
import SocialLogin from '../SocialLogin/SocialLogin';
import axios from 'axios';
import useAxios from '../../../hook/useAxios';

const Registration = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { createUser, updateUserProfile } = useAuth();
    const navigate = useNavigate();
    const [profilePic, setProfilePic] = useState('');
    const axiosInastance = useAxios();

    const onSubmit = async (data) => {

        try {
            // Create Firebase user
            await createUser(data.email, data.password);

            // Prepare user data
            const userInfo = {
                email: data.email,
                name: data.name,
                role: 'user', // default role
                createdAt: new Date().toISOString(),
                lastLogin: new Date().toISOString(),
            };

            // Save user info to your server
            const userRes = await axiosInastance.post('/users', userInfo);
            console.log(userRes.data);

            // Update Firebase profile
            await updateUserProfile({
                displayName: data.name,
                photoURL: profilePic,
            });
            console.log('Profile updated');

            // Navigate to home
            navigate('/');
        } catch (error) {
            console.error(error);
        }
    };


    const handleImageUpload = async (e) => {
        const image = e.target.files[0];
        console.log(image)

        const formData = new FormData();
        formData.append('image', image);

        const url = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_upload}`;
        const res = await axios.post(url, formData);
        setProfilePic(res.data.data.url);
    }
    return (
        <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
            <div className="card-body">
                <h1 className="text-5xl font-bold">Create Account</h1>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <fieldset className="fieldset">
                        {/* name field */}
                        <label className="label">Your Name</label>
                        <input type="text"
                            {...register('name', { required: true })}
                            className="input" placeholder="Your Name" />
                        {
                            errors.email?.type === 'required' && <p className='text-red-500'>Name is required</p>
                        }
                        {/* name field */}
                        <label className="label">Your Name</label>
                        <input type="file"
                            onChange={handleImageUpload}
                            className="input" placeholder="Your Profile picture" />

                        {/* email field */}
                        <label className="label">Email</label>
                        <input type="email"
                            {...register('email', { required: true })}
                            className="input" placeholder="Email" />
                        {
                            errors.email?.type === 'required' && <p className='text-red-500'>Email is required</p>
                        }
                        {/* password field*/}
                        <label className="label">Password</label>
                        <input type="password" {...register('password', { required: true, minLength: 6 })} className="input" placeholder="Password" />
                        {
                            errors.password?.type === 'required' && <p className='text-red-500'>Password is required</p>
                        }
                        {
                            errors.password?.type === 'minLength' && <p className='text-red-500'>Password must be 6 characters or longer</p>
                        }

                        <div><a className="link link-hover">Forgot password?</a></div>
                        <button className="btn btn-primary text-black mt-4">Register</button>
                    </fieldset>
                    <p><small>Already have an account? <Link className="btn btn-link" to="/login">Login</Link></small></p>
                </form>
                <SocialLogin></SocialLogin>
            </div>
        </div>
    );
};

export default Registration;