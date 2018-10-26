import React from 'react';
import Navbar from './Navbar';
import MainSection from './MainSection';


class HomePage extends React.Component {
  render() {
    return (
      <div>
        <Navbar />
        <MainSection />
      </div>
    );
  }
}

export default HomePage;
