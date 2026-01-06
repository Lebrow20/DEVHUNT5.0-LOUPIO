import { RouterProvider } from "react-router-dom";
import React from "react";
import router from "./routes/Router";
import { ContextProvider } from "./context/ContextProvider";
import { ToastContainer } from "react-toastify";
import ErrorBoundary from "./components/ErrorBoundary";

function App() {
  return (
    <ErrorBoundary>
      <React.StrictMode>
        <ContextProvider>
          <RouterProvider router={router} />
          <ToastContainer position="top-center" autoClose={3000} />
        </ContextProvider>
      </React.StrictMode>
    </ErrorBoundary>
  );
}

export default App;
