import { PropsWithChildren, useContext, useEffect } from "react";
import { RouterContext } from "./router";

type RouteProps = {
  path: string;
};

const Route = ({ children, path }: PropsWithChildren<RouteProps>) => {
  const router = useContext(RouterContext);

  useEffect(() => {
    // window.location.href = '/';
  }, []);

  return <>{path === router.currentRoute ? children : null}</>;
};

export default Route;
