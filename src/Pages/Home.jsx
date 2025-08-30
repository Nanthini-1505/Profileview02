import React from 'react';
import Navbar from '../../src/Components/Common/Navbar'
import Hero from '../../src/Components/Common/Hero'; 
import CollegeHr from '../Components/Common/CollegeHr';
import Whychoose from '../Components/Common/Whychoose';

const Home = () => {
  return (
    <div>
        <Navbar/>
        <Hero/>
       <CollegeHr/>
       <Whychoose/>
    </div>
  );
};

export default Home;
