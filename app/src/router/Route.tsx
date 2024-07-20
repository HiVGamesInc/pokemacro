import React, { PropsWithChildren, useContext, useEffect } from 'react';
import { RouterContext } from './router';

type Route = {
  path: string;
};

const Route = ({ children, path }: PropsWithChildren<Route>) => {
  const router = useContext(RouterContext);

  useEffect(() => {
    // window.location.href = '/';
  }, []);

  return <>{path === router.currentRoute ? children : null}</>;
};

export default Route;
