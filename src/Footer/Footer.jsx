import React from "react";
import Logo from "../../assets/footer/logo.png";

const Footer = () => {
  return (
    <div>
      <h1 className="sm:text-left text-justify mb-3 flex items-center gap-3">
        <img src={Logo} alt="Logo" className="w-16" />
      </h1>
    </div>
  );
};

export default Footer;
