import { useForm } from "react-hook-form";
import { Toaster } from "react-hot-toast";
import { useLoaderData } from "react-router";
import Swal from 'sweetalert2';
import useAuth from "../../hook/useAuth";
import useAxiosSecure from "../../hook/useAxiosSecure";

const SendParcel = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm();

    const serviceData = useLoaderData();

    // Extract regions
    const regions = [...new Set(serviceData.map(item => item.region))];

    // Get centers based on region
    const getCentersByRegion = (region) => {
        return serviceData.filter(item => item.region === region);
    };

    // Watching selected values
    const type = watch("type");
    const senderRegion = watch("sender_region");
    const receiverRegion = watch("receiver_region");
    function generateTrackingId() {
        // Example: "PKL-20250703-5F3A9C"
        const prefix = "PKL"; // Parcel prefix, you can customize
        const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, ''); // YYYYMMDD
        const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase(); // Random 6 chars
        return `${prefix}-${datePart}-${randomPart}`;
    }


    const onSubmit = (data) => {
        const trackingId = generateTrackingId();
        const senderDistrict = data.sender_center;
        const receiverDistrict = data.receiver_center;
        const isWithinCity = senderDistrict === receiverDistrict;

        let baseCost = 0;
        let extraCost = 0;
        let extraKg = 0;
        let extraFee = 0;
        let cost = 0;
        const weight = data.weight || 0;
        const type = data.type.toLowerCase();

        if (type === "document") {
            baseCost = isWithinCity ? 60 : 80;
            cost = baseCost;
        } else if (type === "non-document") {
            if (weight <= 3) {
                baseCost = isWithinCity ? 110 : 150;
                cost = baseCost;
            } else {
                extraKg = weight - 3;
                if (isWithinCity) {
                    baseCost = 110;
                    extraCost = extraKg * 40;
                    cost = baseCost + extraCost;
                } else {
                    baseCost = 150;
                    extraCost = extraKg * 40;
                    extraFee = 40;
                    cost = baseCost + extraCost + extraFee;
                }
            }
        }

        const parcelData = {
            ...data,
            cost,
            created_by: user?.email || "guest",
            payment_status: "unpaid",
            delivery_status: "not_collected",
            creation_date: new Date().toISOString(),
            tracking_id: trackingId,
        };



        console.log("Parcel data:", parcelData);

        axiosSecure.post('parcels', parcelData)
            .then(res => {
                console.log(res.data);
                if (res.data.insertedId) {
                    // Show SweetAlert with breakdown
                    Swal.fire({
                        title: 'Pricing Breakdown',
                        html: `
      <p><b>Parcel Type:</b> ${data.type}</p>
      <p><b>Weight:</b> ${weight} kg</p>
      <p><b>Sender District:</b> ${senderDistrict}</p>
      <p><b>Receiver District:</b> ${receiverDistrict}</p>
      <hr/>
      <p><b>Base Cost:</b> ৳${baseCost}</p>
      <p><b>Extra Weight (above 3kg):</b> ${extraKg} kg</p>
      <p><b>Extra Weight Cost:</b> ৳${extraCost}</p>
      <p><b>Outside City Extra Fee:</b> ৳${extraFee}</p>
      <hr/>
      <p style="font-weight: bold;">Total Cost: ৳${cost}</p>
    `,
                        icon: 'success',
                        confirmButtonText: 'OK'
                    });
                }
            })
    };

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <Toaster />
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                {/* Heading */}
                <div className="text-center">
                    <h2 className="text-3xl font-bold">Send a Parcel</h2>
                    <p className="text-gray-500">Fill in the details below</p>
                </div>

                {/* Parcel Info */}
                <div className="border p-4 rounded-xl shadow-md space-y-4">
                    <h3 className="font-semibold text-xl">Parcel Info</h3>
                    <div className="space-y-4">
                        {/* Parcel Name */}
                        <div>
                            <label className="label">Parcel Name</label>
                            <input
                                {...register("title", { required: true })}
                                className="input input-bordered w-full"
                                placeholder="Describe your parcel"
                            />
                            {errors.title && <p className="text-red-500 text-sm">Parcel name is required</p>}
                        </div>

                        {/* Type */}
                        <div>
                            <label className="label">Type</label>
                            <div className="flex gap-4">
                                <label className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        value="document"
                                        {...register("type", { required: true })}
                                        className="radio"
                                    />
                                    Document
                                </label>
                                <label className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        value="non-document"
                                        {...register("type", { required: true })}
                                        className="radio"
                                    />
                                    Non-Document
                                </label>
                            </div>
                            {errors.type && <p className="text-red-500 text-sm">Type is required</p>}
                        </div>

                        {/* Weight */}
                        <div>
                            <label className="label">Weight (kg)</label>
                            <input
                                type="number"
                                step="0.1"
                                disabled={type === "document"}
                                {...register("weight", {
                                    required: type === "non-document",
                                    valueAsNumber: true,
                                    min: type === "non-document" ? 0.1 : undefined,
                                })}
                                className='input input-bordered w-full'
                                placeholder={type === "document" ? "Not required for document" : "Enter weight"}
                            />
                            {errors.weight && <p className="text-red-500 text-sm">Weight is required for non-document</p>}
                        </div>
                    </div>
                </div>

                {/* Sender & Receiver Info */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Sender Info */}
                    <div className="border p-4 rounded-xl shadow-md space-y-4">
                        <h3 className="font-semibold text-xl">Sender Info</h3>
                        <div className="grid grid-cols-1 gap-4">
                            <input {...register("sender_name", { required: true })} className="input input-bordered w-full" placeholder="Name" />
                            <input {...register("sender_contact", { required: true })} className="input input-bordered w-full" placeholder="Contact" />

                            <select
                                {...register("sender_region", { required: true })}
                                className="select select-bordered w-full"
                            >
                                <option value="">Select Region</option>
                                {regions.map((region, i) => (
                                    <option key={i} value={region}>{region}</option>
                                ))}
                            </select>

                            <select
                                {...register("sender_center", { required: true })}
                                className="select select-bordered w-full"
                            >
                                <option value="">Select Service Center</option>
                                {getCentersByRegion(senderRegion).map(center => (
                                    <option key={center.id} value={center.district}>{center.district}</option>
                                ))}
                            </select>

                            <input {...register("sender_address", { required: true })} className="input input-bordered w-full" placeholder="Address" />
                            <textarea {...register("pickup_instruction", { required: true })} className="textarea textarea-bordered w-full" placeholder="Pickup Instruction" />
                        </div>
                    </div>

                    {/* Receiver Info */}
                    <div className="border p-4 rounded-xl shadow-md space-y-4">
                        <h3 className="font-semibold text-xl">Receiver Info</h3>
                        <div className="grid grid-cols-1 gap-4">
                            <input {...register("receiver_name", { required: true })} className="input input-bordered w-full" placeholder="Name" />
                            <input {...register("receiver_contact", { required: true })} className="input input-bordered w-full" placeholder="Contact" />

                            <select
                                {...register("receiver_region", { required: true })}
                                className="select select-bordered w-full"
                            >
                                <option value="">Select Region</option>
                                {regions.map((region, i) => (
                                    <option key={i} value={region}>{region}</option>
                                ))}
                            </select>

                            <select
                                {...register("receiver_center", { required: true })}
                                className="select select-bordered w-full"
                            >
                                <option value="">Select Service Center</option>
                                {getCentersByRegion(receiverRegion).map(center => (
                                    <option key={center.id} value={center.district}>{center.district}</option>
                                ))}
                            </select>

                            <input {...register("receiver_address", { required: true })} className="input input-bordered w-full" placeholder="Address" />
                            <textarea {...register("delivery_instruction", { required: true })} className="textarea textarea-bordered w-full" placeholder="Delivery Instruction" />
                        </div>
                    </div>
                </div>

                {/* Submit Button */}
                <div className="text-center">
                    <button className="btn btn-primary text-black">Submit</button>
                </div>
            </form>
        </div>
    );
};

export default SendParcel;
