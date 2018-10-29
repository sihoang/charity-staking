import React from 'react';
import Navbar from './Navbar';
import MainSection from './MainSection';
import FAQSection from './FAQSection';
import Footer from './Footer';
import BuyTRSTSection from './BuyTRSTSection';

class HomePage extends React.Component {
  render() {
    return (
      <div>
        <Navbar />
        <MainSection color="light" />
        <BuyTRSTSection color="dark" />
        <FAQSection color="light" />
        <Footer />
      </div>
    );
  }
}

export default HomePage;
