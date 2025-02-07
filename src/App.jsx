import React from 'react'
import Navbar from './components/Navbar/Navbar'
import Hero from './components/Hero/Hero';
import AOS from "aos";
import "aos/dist/aos.css";
import Products from './components/Products/Products';
import TopProducts from './components/TopProducts/TopProducts';
import Banner from './components/Banner/Banner';
import Testimonials from './Testimonials/Testimonials';
import Footer from './Footer/Footer';

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
        <Banner />
        <Testimonials />
        <Footer />
      </div>
  )

}

export default App;
