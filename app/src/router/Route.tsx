import { PropsWithChildren, useContext, useEffect } from "react";
import * as RouterContext from "../contexts/RouterContext";

type RouteProps = {
  path: string;
};

const Route = ({ children, path }: PropsWithChildren<RouteProps>) => {
  const router = useContext(RouterContext.Context);

  useEffect(() => {
    // window.location.href = '/';
  }, []);

  return <>{path === router.currentRoute ? children : null}</>;
};

export default Route;
