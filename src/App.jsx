import React from 'react'
import Navbar from './components/Navbar/Navbar'
import Hero from './components/Hero/Hero';
import AOS from "aos";
import "aos/dist/aos.css";

const App = () => {
  const [orderPopup, setOrderPopup] = React.useState(false);

  const handleOrderPopup = () => {
    setOrderPopup(!orderPopup);
  };
  React.useEffect(() => {
    AOS.init({
      offset: 100,
      duration: 800,
      easing: "ease-in-sine",
      delay: 100,
    });
    AOS.refresh();
  }, []);

  return(
    <div className="overflow-x-hidden">
        <Navbar handleOrderPopup={handleOrderPopup} />
        <Hero handleOrderPopup={handleOrderPopup} />
      </div>
  )
}

export default App;
