import React from 'react'
import Navbar from './components/Navbar/Navbar'
import Hero from './components/Hero/Hero';
import AOS from "aos";
import "aos/dist/aos.css";
import Products from './components/Products/Products';
import TopProducts from './components/TopProducts/TopProducts';
import Test from './components/Test/Test';

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
        <Products />
        <TopProducts />
        <Test />
      </div>
  )
}

export default App;
