import React, { useState } from "react";
import { FaEnvelope, FaPhone, FaWhatsapp } from "react-icons/fa";
import Swal from "sweetalert2";

const Contact = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    Swal.fire({
      title: "Success!",
      text: "Your message has been sent successfully!",
      icon: "success",
      confirmButtonText: "Cool",
      background: "#f3f4f6",
      color: "#1f2937",
      confirmButtonColor: "#10b981",
    });

    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      message: "",
    });
  };

  return (
    <div className="py-10">
      <div className="container mx-auto px-6 md:px-12">
        <h2 className="text-4xl font-bold text-blue-500 text-center mb-12">
          Contact Me
        </h2>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Form */}
          <div className="rounded-lg shadow-lg hover:shadow-2xl shadow-blue-500 p-8">
            <h3 className="text-2xl text-blue-500 font-bold mb-6">
              Let's Work Together
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="First Name"
                  className="w-full p-3 rounded bg-gray-200 text-gray-800 border border-gray-300 focus:border-blue-500 focus:outline-none"
                />
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Last Name"
                  className="w-full p-3 rounded bg-gray-200 text-gray-800 border border-gray-300 focus:border-blue-500 focus:outline-none"
                />
              </div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className="w-full p-3 rounded bg-gray-200 text-gray-800 border border-gray-300 focus:border-blue-500 focus:outline-none"
              />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Phone Number"
                className="w-full p-3 rounded bg-gray-200 text-gray-800 border border-gray-300 focus:border-blue-500 focus:outline-none"
              />
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Your Message"
                rows="4"
                className="w-full p-3 rounded bg-gray-200 text-gray-800 border border-gray-300 focus:border-blue-500 focus:outline-none"
              ></textarea>
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-3 px-6 rounded hover:bg-blue-600 transition-colors font-semibold"
              >
                Submit
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="rounded-lg shadow-lg hover:shadow-2xl shadow-blue-500 p-8">
            <h3 className="text-2xl text-blue-500 font-bold mb-6">
              Contact Information
            </h3>
            <div className="space-y-6">
              <div className="flex items-center space-x-4 text-gray-800 hover:text-blue-500 transition-colors">
                <FaEnvelope className="text-2xl text-blue-500" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <a href="mailto:md.sakib88900@gmail.com" className="text-lg">
                    md.sakib88900@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-center space-x-4 text-gray-800 hover:text-blue-500 transition-colors">
                <FaPhone className="text-2xl text-blue-500" />
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <a href="tel:+8801858388900" className="text-lg">
                    01858-388900
                  </a>
                </div>
              </div>

              <div className="flex items-center space-x-4 text-gray-800 hover:text-blue-500 transition-colors">
                <FaWhatsapp className="text-2xl text-blue-500" />
                <div>
                  <p className="text-sm text-gray-500">WhatsApp</p>
                  <a href="https://wa.me/8801858388900" className="text-lg">
                    01858-388900
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
