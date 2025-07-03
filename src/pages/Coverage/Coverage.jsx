import React from 'react';
import BangladeshMap from './BangladeshMap';

const Coverage = () => {
    // Sample service centers data - replace with your actual data
    const serviceCenters = [
        {
            district: "Dhaka",
            latitude: 23.6850,
            longitude: 90.3563,
            covered_area: ["Dhaka City", "Narayanganj", "Gazipur"]
        },
        {
            district: "Chittagong",
            latitude: 22.3419,
            longitude: 91.8132,
            covered_area: ["Chittagong City", "Cox's Bazar", "Comilla"]
        },
        {
            district: "Sylhet",
            latitude: 24.8949,
            longitude: 91.8687,
            covered_area: ["Sylhet City", "Moulvibazar", "Habiganj"]
        },
        {
            district: "Rajshahi",
            latitude: 24.3745,
            longitude: 88.6042,
            covered_area: ["Rajshahi City", "Natore", "Pabna"]
        },
        {
            district: "Khulna",
            latitude: 22.8456,
            longitude: 89.5403,
            covered_area: ["Khulna City", "Jessore", "Satkhira"]
        }
    ];
    
    return (
        <div className="max-w-4xl mx-auto px-4 py-10">
            <h1 className="text-3xl font-bold text-center mb-6">We are available in 64 districts</h1>

            {/* Later you can add your search box here */}
            {/* <SearchDistrictBox /> */}

            <BangladeshMap serviceCenters={serviceCenters} />
        </div>
    );
};

export default Coverage;