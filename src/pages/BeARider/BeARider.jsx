import React, { useState } from 'react';
import { useLoaderData } from 'react-router';
import useAuth from '../../hook/useAuth';
import { useForm } from 'react-hook-form';
import useAxiosSecure from '../../hook/useAxiosSecure';
import Swal from 'sweetalert2';

const BeARider = () => {
    const { user } = useAuth();
    const serviceCenters = useLoaderData();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();

    const [selectedRegion, setSelectedRegion] = useState("");
    const axiosSecure = useAxiosSecure();

    const regions = [...new Set(serviceCenters.map((s) => s.region))];
    const districts = serviceCenters
        .filter((s) => s.region === selectedRegion)
        .map((s) => s.district);

const onSubmit = async (data) => {
    const riderData = {
        ...data,
        name: user?.displayName || "",
        email: user?.email || "",
        status: "pending",
        created_at: new Date().toISOString(),
    };

    try {
        const riderRes = await axiosSecure.post('/riders', riderData);

        if (riderRes.data.insertedId || riderRes.data.success) {
            // Show success popup
            Swal.fire({
                icon: 'success',
                title: 'Application Submitted!',
                text: 'Your rider application has been sent successfully.',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'OK'
            });

            reset(); // Clear form
            setSelectedRegion(""); // Reset dropdown if needed
        } else {
            throw new Error("Submit failed");
        }
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Something went wrong while submitting your application.',
        });
        console.error(error);
    }
};


    return (
        <div className="min-h-screen bg-base-100 flex justify-center items-center p-4">
            <div className="bg-white shadow-lg rounded-lg max-w-3xl w-full p-8">
                <h2 className="text-3xl font-bold mb-2 text-center">Be a Rider</h2>
                <p className="text-center text-gray-500 mb-6">
                    Enjoy fast, reliable parcel delivery with real-time tracking and zero hassle.
                    From personal packages to business shipments — we deliver on time, every time.
                </p>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Name */}
                        <div>
                            <label className="label">
                                <span className="label-text">Your Name</span>
                            </label>
                            <input name="name" type="text" value={user?.displayName || ""} required className="input input-bordered w-full" />
                        </div>

                        {/* Age */}
                        <div>
                            <label className="label">
                                <span className="label-text">Your Age</span>
                            </label>
                            <input
                                type="number"
                                placeholder="Your Age"
                                className="input input-bordered w-full"
                                {...register("age", { required: true, min: 18 })}
                            />
                            {errors.age && (
                                <span className="text-red-500 text-sm">You must be 18 or older</span>
                            )}
                        </div>

                        {/* Email */}
                        <div>
                            <label className="label">
                                <span className="label-text">Email</span>
                            </label>
                            <input name="email" type="email" value={user?.email || ""} required className="input input-bordered w-full" />
                        </div>

                        {/* Region (Prefilled) */}
                        <div>
                            <label className="label">
                                <span className="label-text">Region</span>
                            </label>
                            {/* Region */}
                            <select
                                className="select select-bordered w-full"
                                {...register("region", { required: true })}
                                onChange={(e) => setSelectedRegion(e.target.value)}
                            >
                                <option value="">Select Region</option>
                                {regions.map((region, idx) => (
                                    <option key={idx} value={region}>
                                        {region}
                                    </option>
                                ))}
                            </select>
                            {errors.region && <span className="text-red-500 text-sm">Region is required</span>}
                        </div>

                        {/* NID */}
                        <div>
                            <label className="label">
                                <span className="label-text">NID Number</span>
                            </label>
                            <input
                                type="text"
                                placeholder="National ID Card Number"
                                className="input input-bordered w-full"
                                {...register("nid", { required: true })}
                            />
                            {errors.nid && (
                                <span className="text-red-500 text-sm">NID is required</span>
                            )}
                        </div>

                        {/* Contact */}
                        <div>
                            <label className="label">
                                <span className="label-text">Contact Number</span>
                            </label>
                            <input
                                type="tel"
                                placeholder="Phone Number"
                                className="input input-bordered w-full"
                                {...register("phone", { required: true })}
                            />
                            {errors.phone && (
                                <span className="text-red-500 text-sm">Phone number is required</span>
                            )}
                        </div>
                    </div>

                    {/* Preferred Warehouse (from covered_area) */}
                    <div>
                        <label className="label">
                            <span className="label-text">Preferred Warehouse</span>
                        </label>
                        {/* District */}
                        <select
                            className="select select-bordered w-full"
                            {...register("district", { required: true })}
                            disabled={!selectedRegion}
                        >
                            <option value="">Select District</option>
                            {districts.map((district, idx) => (
                                <option key={idx} value={district}>
                                    {district}
                                </option>
                            ))}
                        </select>
                        {errors.district && <span className="text-red-500 text-sm">District is required</span>}
                    </div>

                    {/* Submit Button */}
                    <div className="text-center">
                        <button type="submit" className="btn btn-primary px-8">Submit</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BeARider;
