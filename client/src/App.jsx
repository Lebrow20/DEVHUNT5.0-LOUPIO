import { RouterProvider } from "react-router-dom";
import React from "react";
import router from "./routes/Router";
import { ContextProvider } from "./context/ContextProvider";
import { ToastContainer } from "react-toastify";

function App() {


  return (
    <React.StrictMode>
      <ContextProvider>
        <RouterProvider router={router} />{" "}
        <ToastContainer position="top-center" autoClose={3000} />
      </ContextProvider>
    </React.StrictMode>
  );
}

export default App
