import React from 'react';
import useAuth from '../../../hook/useAuth';
import useAxiosSecure from '../../../hook/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';

const PaymentHistory = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();

    const { data: payments = [], isLoading } = useQuery({
        queryKey: ['user-payments', user?.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/payments?email=${user.email}`);
            return res.data;
        },
    });

    if (isLoading) return <p className="text-center mt-10 text-lg font-semibold">Loading payment history...</p>;

    return (
        <div className="mt-10 px-4">
            <div className="max-w-6xl mx-auto bg-white shadow-xl rounded-2xl p-6">
                <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">💳 My Payment History</h2>

                {payments.length === 0 ? (
                    <p className="text-center text-gray-500">No payments found.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="table w-full text-sm md:text-base">
                            <thead className="bg-gray-100 text-gray-700 uppercase">
                                <tr>
                                    <th>#</th>
                                    <th>Parcel ID</th>
                                    <th>Amount</th>
                                    <th>Transaction ID</th>
                                    <th>Paid At</th>
                                </tr>
                            </thead>
                            <tbody>
                                {payments.map((payment, index) => (
                                    <tr key={payment._id} className="hover:bg-gray-50 transition">
                                        <td className="font-medium text-center">{index + 1}</td>
                                        <td className="text-blue-600 font-semibold">{payment.parcelId || "N/A"}</td>
                                        <td className="text-green-600 font-bold">৳{(payment.amount / 100).toFixed(2)}</td>
                                        <td className="text-xs break-words">{payment.transactionId}</td>
                                        <td className="text-gray-600">{new Date(payment.paidAt).toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PaymentHistory;
