import React from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router';

const Login = () => {
    const { register, handleSubmit, formState: { errors }, } = useForm();
    const onSubmit = data => {
        console.log(data);;
    }
    return (
        <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
            <div className="card-body">
                <h1 className="text-5xl font-bold">Please Login</h1>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <fieldset className="fieldset">

                        <label className="label">Email</label>
                        <input
                            type="email"
                            {...register("email")}
                            className="input" placeholder="Email" />


                        <label className="label">Password</label>
                        <input
                            type="password"
                            {...register("password", { required: true })}
                            className="input" placeholder="Password" />
                        {errors.password?.type === "required" && (
                            <p role="alert">First name is required</p>
                        )}

                        <div><a className="link link-hover">Forgot password?</a></div>

                        <button className="btn btn-primary text-black mt-4">Login</button>
                    </fieldset>
                    <p><small>New to this website? <Link className="btn btn-link" to="/registration">Registration</Link></small></p>
                </form>
            </div>
        </div>
    );
};

export default Login;