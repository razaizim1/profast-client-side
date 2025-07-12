import React, { useState } from 'react';
import Swal from 'sweetalert2';
import useAxiosSecure from '../../../hook/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';

const PendingRider = () => {
    const axiosSecure = useAxiosSecure();
    const [selectedRider, setSelectedRider] = useState(null);

    const { isPending, data: riders = [], refetch } = useQuery({
        queryKey: ['pending-riders'],
        queryFn: async () => {
            const res = await axiosSecure.get("/riders/pending");
            return res.data;
        }
    });

    const handleDecision = async (id, action, email) => {
        const confirm = await Swal.fire({
            title: `${action === "approve" ? "Approve" : "Reject"} Application?`,
            text: `Are you sure you want to ${action} this rider?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes",
            cancelButtonText: "Cancel",
        });

        if (!confirm.isConfirmed) return;

        try {
            await axiosSecure.patch(`/riders/${id}/status`, {
                status: action === "approve" ? "active" : "rejected",
                email,
            });

            refetch();

            Swal.fire("Success", `Rider ${action}d successfully`, "success");

        } catch (error) {
            Swal.fire("Error", "Could not update rider status", error);
        }
    };

    if (isPending) return '...loading';

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Pending Riders</h2>

            {riders.length === 0 ? (
                <p>No pending riders found.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="table w-full border">
                        <thead className="bg-base-200">
                            <tr>
                                <th>#</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Region</th>
                                <th>District</th>
                                <th>Phone</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {riders.map((rider, index) => (
                                <tr key={rider._id}>
                                    <td>{index + 1}</td>
                                    <td>{rider.name}</td>
                                    <td>{rider.email}</td>
                                    <td>{rider.region}</td>
                                    <td>{rider.district}</td>
                                    <td>{rider.phone}</td>
                                    <td>
                                        <span className="badge badge-warning">{rider.status}</span>
                                    </td>
                                    <td className="flex gap-2 flex-wrap">
                                        <button
                                            className="btn btn-xs btn-info"
                                            onClick={() => setSelectedRider(rider)}
                                        >
                                            View
                                        </button>
                                        <button
                                            className="btn btn-xs btn-success"
                                            onClick={() => handleDecision(rider._id, "approve", rider.email)}
                                        >
                                            Approve
                                        </button>
                                        <button
                                            className="btn btn-xs btn-error"
                                            onClick={() => handleDecision(rider._id, "reject", rider.email)}
                                        >
                                            Reject
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal */}
            {selectedRider && (
                <dialog id="riderModal" className="modal modal-open">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg mb-4">Rider Details</h3>
                        <div className="space-y-1">
                            <p><strong>Name:</strong> {selectedRider.name}</p>
                            <p><strong>Age:</strong> {selectedRider.age}</p>
                            <p><strong>Email:</strong> {selectedRider.email}</p>
                            <p><strong>Phone:</strong> {selectedRider.phone}</p>
                            <p><strong>Region:</strong> {selectedRider.region}</p>
                            <p><strong>District:</strong> {selectedRider.district}</p>
                            <p><strong>NID:</strong> {selectedRider.nid}</p>
                            <p><strong>Status:</strong> {selectedRider.status}</p>
                            <p><strong>Applied At:</strong> {new Date(selectedRider.created_at).toLocaleString()}</p>
                        </div>

                        <div className="modal-action">
                            <form method="dialog">
                                <button
                                    className="btn"
                                    onClick={() => setSelectedRider(null)}
                                >
                                    Close
                                </button>
                            </form>
                        </div>
                    </div>
                </dialog>
            )}
        </div>
    );
};

export default PendingRider;
