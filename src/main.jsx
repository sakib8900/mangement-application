import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import router from "./routes/router";
import AuthProvider from "./providers/AuthProvider";

createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <div>
      <RouterProvider router={router}></RouterProvider>
    </div>
  </AuthProvider>
);
