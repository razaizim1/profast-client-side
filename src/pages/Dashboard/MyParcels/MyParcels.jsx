import { Query, useQuery, useQueryClient } from '@tanstack/react-query';
import React from 'react';
import useAuth from '../../../hook/useAuth';
import useAxiosSecure from '../../../hook/useAxiosSecure';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router';

const MyParcels = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const { data: parcels = [] } = useQuery({
        queryKey: ['my-parcels', user.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/parcels?email=${user.email}`);
            return res.data;
        }
    })
    const handleView = (parcel) => {
        // Example: show modal, navigate to details page, or console.log
        console.log('Viewing parcel:', parcel);
    };

    const handlePay = async (id) => {
        try {
            // Example: call backend API to update payment status
            // const res = await axiosSecure.patch(`/parcels/pay/${id}`);
            navigate(`/dashboard/payment/${id}`);

            // if (res.data.modifiedCount > 0) {
            //     Swal.fire('Success!', 'Payment completed.', 'success');
            //     queryClient.invalidateQueries(['my-parcels', user.email]);
            // } else {
            //     Swal.fire('Info', 'Payment was not updated.', 'info');
            // }
        } catch (error) {
            Swal.fire('Error!', 'Payment failed.', 'error');
            console.error(error);
        }
    };


    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
        });

        if (result.isConfirmed) {
            try {
                const res = await axiosSecure.delete(`/parcels/${id}`);
                if (res.data.deletedCount > 0) {
                    Swal.fire('Deleted!', 'Parcel has been deleted.', 'success');
                    queryClient.invalidateQueries(['my-parcels', user.email]);
                }
            } catch (error) {
                Swal.fire('Error!', 'Something went wrong.', 'error');
                console.error(error);
            }
        }
    };

    return (
        <div className="overflow-x-auto shadow-md rounded-xl">
            <h2>this is my parcel: {parcels.length}</h2>
            <table className="table table-zebra w-full">
                <thead className="bg-base-200 text-base font-semibold">
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Type</th>
                        <th>Created At</th>
                        <th>Cost</th>
                        <th>Payment</th>
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {parcels.map((parcel, index) => (
                        <tr key={parcel._id}>
                            <td>{index + 1}</td>
                            <td>{parcel.title}</td>
                            <td>{parcel.type}</td>
                            <td>{new Date(parcel.creation_date).toLocaleString()}</td>
                            <td>৳ {parcel.cost}</td>
                            <td>{parcel.payment_status}</td>
                            <td className="space-x-2">
                                <button
                                    onClick={() => handleView(parcel)}
                                    className="btn btn-sm btn-outline btn-info"
                                >
                                    View
                                </button>
                                <button
                                    onClick={() => handlePay(parcel._id)}
                                    className="btn btn-sm btn-outline btn-success"
                                    disabled={parcel.payment_status === 'paid'}
                                    title={parcel.payment_status === 'paid' ? 'Already Paid' : 'Pay now'}
                                >
                                    Pay
                                </button>
                                <button
                                    onClick={() => handleDelete(parcel._id)}
                                    className="btn btn-sm btn-outline btn-error"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default MyParcels;