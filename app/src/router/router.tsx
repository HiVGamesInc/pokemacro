import Route from "./Route";
import Layout from "../components/Layout";
import AutoComboTab from "../pages/AutoCombo";
import MoveBindings from "../pages/MoveBindings";
import Alert from "../pages/Alert";
import AutoCatch from "../pages/AutoCatch";
import Header from "../components/Header/Header";
import * as RouterContext from "../contexts/RouterContext";
import * as GlobalContext from "../contexts/GlobalContext";
import * as AutoComboContext from "../contexts/AutoComboContext";
import * as KeybidingsContext from "../contexts/KeybindingsContext";
import * as AlertContext from "../contexts/AlertContext";
import { AutoCatchProvider } from "../contexts/AutoCatchContext";

const Router = () => {
  return (
    <RouterContext.Provider>
      <GlobalContext.Provider>
        <KeybidingsContext.Provider>
          <AlertContext.Provider>
            <AutoComboContext.Provider>
              <Header />
              <Layout>
                <Route path={RouterContext.Routes.AUTO_COMBO}>
                  <AutoComboTab />
                </Route>
                <Route path={RouterContext.Routes.MOVE_BINDINGS}>
                  <MoveBindings />
                </Route>
                <Route path={RouterContext.Routes.ALERT}>
                  <Alert />
                </Route>
                <Route path={RouterContext.Routes.AUTO_CATCH}>
                  <AutoCatchProvider>
                    <AutoCatch />
                  </AutoCatchProvider>
                </Route>
              </Layout>
            </AutoComboContext.Provider>
          </AlertContext.Provider>
        </KeybidingsContext.Provider>
      </GlobalContext.Provider>
    </RouterContext.Provider>
  );
};

export default Router;
