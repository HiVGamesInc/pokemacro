import React, { PropsWithChildren } from "react";
import Navbar from "./Navbar";

const Layout = ({ children }: PropsWithChildren) => {
  return (
    <div className="flex bg-black items-stretch h-[calc(100vh-77px)]">
      <Navbar />
      <div className="flex-1 p-6 bg-gray-900 text-white overflow-auto">
        {children}
      </div>
    </div>
  );
};

export default Layout;
