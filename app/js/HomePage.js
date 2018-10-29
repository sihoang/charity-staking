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
        <MainSection color="light" />
        <FAQSection color="dark" />
        <Footer />
      </div>
    );
  }
}

export default HomePage;
