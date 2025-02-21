import React from "react";
import TaskSection from "../../components/Drag-Drop/TaskSection";
import Projects from "../projects/Projects";


const Home = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      {/* <TaskSection></TaskSection> */}
      <Projects></Projects>
    </div>
  );
};

export default Home;