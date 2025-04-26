import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import { Outlet } from "react-router-dom"; // This renders child routes

const Layout = () => {
  return (
    <div>
      <Header />
      <main>
        <Outlet />  {/* This will render the current page */}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
