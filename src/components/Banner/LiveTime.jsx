import React from "react";
import QuickDataImage from "../../assets/images/quickresponse.jpeg";

const LiveTime = () => {
  return (
    <div>
     <h1 className="text-3xl md:text-4xl font-bold text-center w-full text-blue-500 mb-6">
     Efficient Project Management with Quick Integration 🚀
      </h1>
      <div className="flex flex-col lg:flex-row items-center justify-between p-4 space-y-4 lg:space-y-0 lg:space-x-8">
        {/* Left side: Image */}
        <div className="flex-1 mb-6 lg:mb-0">
          <img
            src={QuickDataImage}
            alt="Quick Data Management"
            style={{ height: "300px", width: "300px" }}
            className="object-cover"
          />
        </div>

        {/* Right side: Text content */}
        <div className="flex-1 text-center lg:text-left">
          <h2 className="text-3xl font-semibold mb-6 text-blue-500">
            Quick Data Management
          </h2>
          <p className="text-xl text-gray-500">
            Easily manage your data with real-time updates. Our tool allows you
            to drag, drop, edit, and delete tasks seamlessly across different
            stages.
          </p>
          <p className="text-lg text-gray-500 mt-4">
            Whether you're tracking to-dos or managing completed tasks, this
            system keeps everything organized and in place, boosting
            productivity and project flow.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LiveTime;
