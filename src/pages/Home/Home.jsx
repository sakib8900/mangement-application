import React from "react";
import TaskSection from "../../components/Drag-Drop/TaskSection";
import Projects from "../projects/Projects";
import Dad from "../../components/Banner/Dad";
import Contact from "../contact/Contact";


const Home = () => {
  return (
    <div className="w-[85%] md:w-[90%] mx-auto">
      <Dad></Dad>
      <Contact></Contact>
    </div>
  );
};

export default Home;