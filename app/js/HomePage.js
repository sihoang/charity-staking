import React from 'react';
import Navbar from './Navbar';
import MainSection from './MainSection';
import FAQ from './FAQ';
import Footer from './Footer';

class HomePage extends React.Component {
  render() {
    return (
      <div>
        <Navbar />
        <MainSection />
        <FAQ />
        <Footer />
      </div>
    );
  }
}

export default HomePage;
