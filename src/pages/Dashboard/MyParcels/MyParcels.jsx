import React from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import Swal from 'sweetalert2';
import useAuth from '../../../hook/useAuth';
import useAxiosSecure from '../../../hook/useAxiosSecure';

const MyParcels = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const { data: parcels = [], isLoading } = useQuery({
        queryKey: ['my-parcels', user.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/parcels?email=${user.email}`);
            return res.data;
        }
    });

    const handleView = (parcel) => {
        Swal.fire({
            title: `📦 ${parcel.title}`,
            html: `
                <p><strong>Type:</strong> ${parcel.type}</p>
                <p><strong>Cost:</strong> ৳${parcel.cost}</p>
                <p><strong>Created:</strong> ${new Date(parcel.creation_date).toLocaleString()}</p>
                <p><strong>Status:</strong> ${parcel.payment_status}</p>
            `,
            icon: 'info'
        });
    };

    const handlePay = (id) => {
        navigate(`/dashboard/payment/${id}`);
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "This action cannot be undone!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        });

        if (result.isConfirmed) {
            try {
                const res = await axiosSecure.delete(`/parcels/${id}`);
                if (res.data.deletedCount > 0) {
                    Swal.fire('Deleted!', 'Parcel has been removed.', 'success');
                    queryClient.invalidateQueries(['my-parcels', user.email]);
                }
            } catch (error) {
                Swal.fire('Error', 'Something went wrong.', 'error');
                console.error(error);
            }
        }
    };

    if (isLoading) return <p className="text-center mt-10">Loading parcels...</p>;

    return (
        <div className="overflow-x-auto shadow-lg rounded-xl p-4 bg-base-100 mt-6 max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-center">📦 My Parcels ({parcels.length})</h2>
            <table className="table table-zebra w-full">
                <thead className="bg-base-200 text-base font-semibold text-center">
                    <tr>
                        <th>#</th>
                        <th>Title</th>
                        <th>Type</th>
                        <th>Created</th>
                        <th>Cost</th>
                        <th>Payment</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody className="text-center">
                    {parcels.map((parcel, index) => (
                        <tr key={parcel._id}>
                            <td>{index + 1}</td>
                            <td>{parcel.title}</td>
                            <td>{parcel.type}</td>
                            <td>{new Date(parcel.creation_date).toLocaleString()}</td>
                            <td>৳{parcel.cost}</td>
                            <td>
                                {parcel.payment_status === 'paid' ? (
                                    <span className="badge badge-success">Paid</span>
                                ) : (
                                    <span className="badge badge-warning">Unpaid</span>
                                )}
                            </td>
                            <td className="space-x-1">
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
                                    title={parcel.payment_status === 'paid' ? 'Already Paid' : 'Pay Now'}
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