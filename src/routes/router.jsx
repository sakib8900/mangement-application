import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home/Home";
import MainLayout from "../layout/MainLayout";
import Login from "../user/Login";
import Projects from "../pages/projects/Projects";
import Profile from "../pages/profile/Profile";
import Contact from "../pages/contact/Contact";

const router = createBrowserRouter([
    {
        path: "/",
        element: <MainLayout></MainLayout>,
        children: [
            {
                path: "/",
                element: <Home></Home>
            },
            {
                path: "/login",
                element: <Login></Login>
            },
            {
                path: "/project",
                element: <Projects></Projects>
            },
            {
                path: "/profile",
                element: <Profile></Profile>
            },
            {
                path: "/contact",
                element: <Contact></Contact>
            },

        ]
    }
])

export default router;