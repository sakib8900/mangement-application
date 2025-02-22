import React from "react";
import { FaFacebook, FaGithub } from "react-icons/fa";  // Importing React Icons
import logo from "../../assets/logo.jpeg";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-blue-600 text-white py-8">
      <div className="container mx-auto px-6 lg:px-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Company Info */}
        <div className="text-center lg:text-left flex items-center justify-center lg:justify-start">
          <img className="w-16 object-contain rounded-full" src={logo} alt="Company Logo" />
          <p className="mt-2 text-gray-200 ml-4">Management Application</p>
        </div>

        {/* Quick Links */}
        <div className="text-center">
          <h3 className="text-lg font-semibold">Quick Links</h3>
          <ul className="mt-2 space-y-2">
            <li><Link to="/contact" className="hover:underline">About Us</Link></li>
            <li><Link to="/contact" className="hover:underline">Contact</Link></li>
          </ul>
        </div>

        {/* Social Media */}
        <div className="text-center lg:text-right">
          <h3 className="text-lg font-semibold">Follow Us</h3>
          <div className="flex justify-center lg:justify-end space-x-4 mt-2">
            <a
              href="https://www.facebook.com/nip.sakib.1" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-white text-2xl hover:text-gray-300"
            >
              <FaFacebook />
            </a>
            <a
              href="https://github.com/sakib8900"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white text-2xl hover:text-gray-300"
            >
              <FaGithub />
            </a>
          </div>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="mt-6 border-t border-gray-400 pt-4 text-center text-gray-300">
        &copy; {new Date().getFullYear()} ACME Industries Ltd. All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;
