import React, { useContext } from "react";
import { AuthContext } from "../providers/AuthProvider";
import { FcGoogle } from "react-icons/fc";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { signInWithGoogle } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const handleGoogleLogin = async () => {
      const result = await signInWithGoogle();
      const user = {
        displayName: result.user.displayName,
        email: result.user.email,
        photoURL: result.user.photoURL
      };

      await axios.post("https://management-application-backend.vercel.app/users", user);
      Swal.fire({
        title: "Login Successful!",
        text: `Welcome back ${user.displayName}`,
        icon: "success",
        confirmButtonText: "OK"
      }).then(() => {
        navigate(from, { replace: true });
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full text-center">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">
          Login to Your Account
        </h2>
        <button
          onClick={handleGoogleLogin}
          className="flex items-center justify-center w-full p-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition duration-300"
        >
          <FcGoogle className="text-2xl mr-2" />
          Continue with Google
        </button>
      </div>
    </div>
  );
};

export default Login;
