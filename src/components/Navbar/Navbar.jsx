import React, { useContext, useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../../providers/AuthProvider";
import { BsSun, BsMoon } from "react-icons/bs"; // React Icons
import "./Navbar.css";

const Navbar = () => {
  const { user, logOut } = useContext(AuthContext);
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const handleLogout = () => {
    logOut().then(() => {
      navigate("/");
    });
  };

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  const nav = (
    <>
      <NavLink to="/" className="">Home</NavLink>
      <NavLink to="/project">Project</NavLink>
      <NavLink to="/contact">Contact</NavLink>
      {user && <NavLink to="/profile">Profile</NavLink>}
    </>
  );

  return (
    <div className="navbar bg-blue-950 dark:bg-gray-900 text-white">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-blue-950 dark:bg-gray-800 rounded-box z-[1] mt-4 w-52 p-2 shadow"
          >
            {nav}
          </ul>
        </div>
        <a className="btn btn-ghost text-xl">Management Application</a>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">{nav}</ul>
      </div>
      <div className="navbar-end gap-3">
        <button onClick={toggleTheme} className="btn btn-ghost">
          {darkMode ? <BsSun size={20} className="text-yellow-400" /> : <BsMoon size={20} />}
        </button>

        {user ? (
          <>
            <img className="w-10 rounded-full" src={user.photoURL || ""} alt="User" />
            <button onClick={handleLogout} className="btn btn-error">
              Logout
            </button>
          </>
        ) : (
          <Link to="/login">
            <button className="btn btn-error">Login</button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
