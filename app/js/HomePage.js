import React from 'react';
import Navbar from './Navbar';
import MainSection from './MainSection';
import FAQ from './FAQ';


class HomePage extends React.Component {
  render() {
    return (
      <div>
        <Navbar />
        <MainSection />
        <FAQ />
      </div>
    );
  }
}

export default HomePage;
