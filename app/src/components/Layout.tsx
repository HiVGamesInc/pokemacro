import React, { PropsWithChildren } from 'react';
import Navbar from './Navbar';

const Layout = ({ children }: PropsWithChildren) => {
  return (
    <div className="flex">
      <Navbar />
      <div className="flex-1 p-6 bg-gray-900 text-white h-screen overflow-auto">{children}</div>
    </div>
  );
};

export default Layout;
