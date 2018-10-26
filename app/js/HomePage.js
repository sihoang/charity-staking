import React from 'react';
import Navbar from './Navbar';
import MainSection from './MainSection';
import FAQSection from './FAQSection';
import Footer from './Footer';

class HomePage extends React.Component {
  render() {
    return (
      <div>
        <Navbar />
        <MainSection />
        <FAQSection />
        <Footer />
      </div>
    );
  }
}

export default HomePage;
