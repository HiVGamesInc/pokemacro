import React, { Dispatch, SetStateAction, useState } from "react";

import Route from "./Route";
import Layout from "../components/Layout";
import AutoComboTab from "../pages/AutoCombo";
import MoveBindings from "../pages/MoveBindings";
import Home from "../pages/Home";
import { Combo } from "../types/types";

export enum Routes {
  HOME = "home",
  AUTO_COMBO = "auto-combo",
  MOVE_BINDINGS = "move-bindings",
}

type RouterContextType = {
  currentRoute: string;
  setCurrentRoute: Dispatch<SetStateAction<Routes>>;
};
type BotContextType = {
  antiLogout: boolean;
  setAntiLogout: Dispatch<SetStateAction<boolean>>;
  autoCombo: boolean;
  setAutoCombo: Dispatch<SetStateAction<boolean>>;
};
type AutoComboContextType = {
  currentCombo: Combo;
  setCurrentCombo: Dispatch<SetStateAction<Combo>>;
};

export const RouterContext = React.createContext<RouterContextType>(
  {} as RouterContextType
);
export const BotContext = React.createContext<BotContextType>(
  {} as BotContextType
);
export const AutoComboContext = React.createContext<AutoComboContextType>(
  {} as AutoComboContextType
);

const Router = () => {
  const [currentRoute, setCurrentRoute] = useState(Routes.HOME);
  const [antiLogout, setAntiLogout] = useState(false);
  const [autoCombo, setAutoCombo] = useState(false);
  const [currentCombo, setCurrentCombo] = useState<Combo>({} as Combo);

  return (
    <RouterContext.Provider value={{ currentRoute, setCurrentRoute }}>
      <BotContext.Provider
        value={{ antiLogout, setAntiLogout, autoCombo, setAutoCombo }}
      >
        <AutoComboContext.Provider value={{ currentCombo, setCurrentCombo }}>
          <Layout>
            <Route path={Routes.HOME}>
              <Home />
            </Route>
            <Route path={Routes.AUTO_COMBO}>
              <AutoComboTab />
            </Route>
            <Route path={Routes.MOVE_BINDINGS}>
              <MoveBindings />
            </Route>
          </Layout>
        </AutoComboContext.Provider>
      </BotContext.Provider>
    </RouterContext.Provider>
  );
};

export default Router;
