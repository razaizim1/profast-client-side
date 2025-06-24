import React from 'react';
import Banner from '../Banner/Banner';
import Services from '../Services/Services';
import ClientLogo from '../ClientLogo/ClientLogo';
import Benefits from '../Benifits/Benefits';
import BeMarchant from '../BeMarchant/BeMarchant';

const Home = () => {
    return (
        <div>
            <Banner></Banner>
            <Services></Services>
            <ClientLogo></ClientLogo>
            <Benefits></Benefits>
            <BeMarchant></BeMarchant>
        </div>
    );
};

export default Home;