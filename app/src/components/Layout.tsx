import React, { PropsWithChildren } from "react";
import Navbar from "./Navbar";
import Toolbar from "./Toolbar";

const Layout = ({ children }: PropsWithChildren) => {
  return (
    <div className="flex flex-col h-screen bg-gray-950 text-gray-100">
      <Toolbar />
      <div className="flex flex-1 overflow-hidden">
        <Navbar />
        <div className="flex-1 bg-gray-900 overflow-hidden">{children}</div>
      </div>
    </div>
  );
};

export default Layout;
