import Route from "./Route";
import Layout from "../components/Layout";
import AutoComboTab from "../pages/AutoCombo";
import MoveBindings from "../pages/MoveBindings";
import Header from "../components/Header/Header";
import * as RouterContext from "../contexts/RouterContext";
import * as GlobalContext from "../contexts/GlobalContext";
import * as AutoComboContext from "../contexts/AutoComboContext";

const Router = () => {
  return (
    <RouterContext.Provider>
      <GlobalContext.Provider>
        <AutoComboContext.Provider>
          <Header />
          <Layout>
            <Route path={RouterContext.Routes.AUTO_COMBO}>
              <AutoComboTab />
            </Route>
            <Route path={RouterContext.Routes.MOVE_BINDINGS}>
              <MoveBindings />
            </Route>
          </Layout>
        </AutoComboContext.Provider>
      </GlobalContext.Provider>
    </RouterContext.Provider>
  );
};

export default Router;
