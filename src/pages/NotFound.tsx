import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import Layout from "../components/Layout";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <Layout>
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">404</h1>
          <p className="text-xl text-gray-600 mb-4">
            Ups! Siden ble ikke funnet
          </p>
          <a href="/" className="text-blue-500 hover:text-blue-700 underline">
            Hjem
          </a>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;
