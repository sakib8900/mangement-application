import React, { useContext } from "react";
import { AuthContext } from "../../providers/AuthProvider";

const Profile = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="max-w-2xl lg:mt-10 m-4 mx-auto p-6 border-t-4 border-b-4 shadow-blue-500 hover:shadow-xl border-blue-500 shadow-lg rounded-lg">
      <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6 lg:gap-12">
        {/* Image Section */}
        <div className="flex justify-center lg:w-1/3">
          <img
            src={user.photoURL || "Anonymous User"}
            alt="User Profile"
            className="w-32 h-32 lg:w-48 lg:h-48 rounded-full"
          />
        </div>

        {/* Details Section */}
        <div className="text-center lg:text-left lg:w-2/3">
          <p className="text-xl font-semibold text-blue-800 mb-2">
            Name: {user.displayName || "Anonymous User"}
          </p>
          <p className="text-lg text-blue-800 mb-2">Email: {user.email}</p>
          <p className="text-lg text-blue-800 dark:text-blue-800">
            <span className="font-semibold">Account Created:</span>{" "}
            {new Date(Number(user.metadata.createdAt)).toLocaleDateString()}
          </p>
          <p className="text-lg text-blue-800 dark:text-blue-800">
            <span className="font-semibold">Last Login:</span>{" "}
            {new Date(Number(user.metadata.lastLoginAt)).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
