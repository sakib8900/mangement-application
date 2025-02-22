import React from "react";
import Drag from "../../assets/lootie/draganddrop.json";
import Lottie from "lottie-react";

const Dad = () => {
  return (
    <div className="py-4">
      {/* Heading Line */}
      <h1 className="text-4xl font-bold text-center w-full text-blue-500 mb-6">
        Project Management Made Easy 🚀
      </h1>
      <div className="flex flex-col lg:flex-row mb-3 items-center justify-between p-4 space-y-4 lg:space-y-0 lg:space-x-8">
        {/* Left side: Lottie Animation */}
        <div className="flex-1 mb-6 lg:mb-0">
          <Lottie
            animationData={Drag}
            loop={true}
            style={{ height: "400px", width: "400px" }}
          />
        </div>

        {/* Right side: Text content */}
        <div className="flex-1 text-center lg:text-left px-4">
          <h2 className="text-3xl font-semibold mb-4 text-blue-500">
            Drag and Drop Your Project
          </h2>
          <p className="text-xl text-gray-500 mb-4">
            Manage your projects with ease. Quickly drag and drop items into the
            system for seamless integration. The changes take place in
            real-time, so you can focus on what really matters.
          </p>
          <p className="text-lg text-gray-500">
            Our intuitive system allows for a smooth user experience, letting
            you make quick adjustments with minimal effort. Get started now and
            see the difference!
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dad;
