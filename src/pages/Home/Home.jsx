import React from "react";
import Dad from "../../components/Banner/Dad";
import Contact from "../contact/Contact";
import LiveTime from "../../components/Banner/LiveTime";


const Home = () => {
  return (
    <div className="w-[85%] md:w-[90%] mx-auto">
      <Dad></Dad>
      <LiveTime></LiveTime>
      <Contact></Contact>
    </div>
  );
};

export default Home;