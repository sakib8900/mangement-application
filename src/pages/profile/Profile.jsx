import React, { useContext } from "react";
import { AuthContext } from "../../providers/AuthProvider";

const Profile = () => {
  const { user } = useContext(AuthContext);
  // console.log(user.photoURL)
  return (
    <div className="max-w-3xl mx-auto mt-6 p-6 border-t-4 border-b-4 shadow-lg border-blue-500 rounded-lg">
      <div className="flex flex-col md:grid md:grid-cols-2 gap-6 items-center">
        {/* Image Section */}
        <div className="flex justify-center">
          <img
            src={user?.photoURL || "Anonymous User"}
            alt="User Profile"
            className="w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 rounded-full border-4 border-blue-500 shadow-md"
          />
        </div>

        {/* Details Section */}
        <div className="text-center md:text-left space-y-2">
          <p className="text-xl font-semibold text-blue-800">
            Name: {user?.displayName || "Anonymous User"}
          </p>
          <p className="text-lg text-blue-700">Email: {user?.email || "Not Available"}</p>
          <p className="text-lg text-blue-700">
            <span className="font-semibold">Account Created:</span>{" "}
            {user?.metadata?.createdAt
              ? new Date(Number(user.metadata.createdAt)).toLocaleDateString()
              : "Unknown"}
          </p>
          <p className="text-lg text-blue-700">
            <span className="font-semibold">Last Login:</span>{" "}
            {user?.metadata?.lastLoginAt
              ? new Date(Number(user.metadata.lastLoginAt)).toLocaleString()
              : "Unknown"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
