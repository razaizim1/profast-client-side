import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { FaSearch, FaUserSlash } from "react-icons/fa";
import useAxiosSecure from "../../../hook/useAxiosSecure";

const ActiveRiders = () => {
    const axiosSecure = useAxiosSecure();
    const [searchTerm, setSearchTerm] = useState("");
    const [deactivatingId, setDeactivatingId] = useState(null);

    // 🟡 Load Active Riders
    const { data: riders = [], isLoading, refetch, error } = useQuery({
        queryKey: ["activeRiders"],
        queryFn: async () => {
            const res = await axiosSecure.get("/riders/active");
            return res.data;
        },
    });

    // 🔴 Handle Deactivation
    const handleDeactivate = async (id) => {
        const confirm = await Swal.fire({
            title: "Deactivate this rider?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, deactivate",
            cancelButtonText: "Cancel",
        });

        if (!confirm.isConfirmed) return;

        try {
            setDeactivatingId(id);
            await axiosSecure.patch(`/riders/${id}/status`, { status: "rejected" });
            Swal.fire("Done", "Rider has been deactivated", "success");
            refetch();
        } catch (error) {
            console.error(error);
            Swal.fire("Error", "Failed to deactivate rider", "error");
        } finally {
            setDeactivatingId(null);
        }
    };

    // 🔍 Search Filter
    const filteredRiders = riders.filter((rider) =>
        rider.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Active Riders</h2>

            {/* 🔍 Search */}
            <div className="mb-4 flex items-center gap-2">
                <FaSearch />
                <input
                    type="text"
                    placeholder="Search by name"
                    className="input input-bordered w-full max-w-md"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* 🌀 Loading/Error */}
            {isLoading && <p className="text-center">Loading active riders...</p>}
            {error && <p className="text-center text-red-500">Failed to load riders</p>}

            {/* 📋 Rider Table */}
            {!isLoading && !error && (
                <div className="overflow-x-auto">
                    <table className="table table-zebra w-full">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Region</th>
                                <th>District</th>
                                <th>Bike</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredRiders.length > 0 ? (
                                filteredRiders.map((rider) => (
                                    <tr key={rider._id}>
                                        <td>{rider.name || "N/A"}</td>
                                        <td>{rider.email || "N/A"}</td>
                                        <td>{rider.phone || "N/A"}</td>
                                        <td>{rider.region || "N/A"}</td>
                                        <td>{rider.district || "N/A"}</td>
                                        <td>
                                            {rider.bike_brand || "Unknown"} -{" "}
                                            {rider.bike_registration || "N/A"}
                                        </td>
                                        <td>
                                            <span className="badge badge-success text-white">Active</span>
                                        </td>
                                        <td>
                                            <button
                                                onClick={() => handleDeactivate(rider._id)}
                                                className="btn btn-sm btn-error"
                                                disabled={deactivatingId === rider._id}
                                            >
                                                <FaUserSlash className="mr-1" />
                                                {deactivatingId === rider._id ? "Processing..." : "Deactivate"}
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="8" className="text-center text-gray-500">
                                        No matching riders found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ActiveRiders;
