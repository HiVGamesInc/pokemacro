import Route from "./Route";
import Layout from "../components/Layout";
import AutoComboTab from "../pages/AutoCombo";
import MoveBindings from "../pages/MoveBindings";
import Alert from "../pages/Alert";
import AutoCatch from "../pages/AutoCatch";
import Healing from "../pages/Healing";
import Todo from "../pages/Todo";
import Header from "../components/Header/Header";
import UpdateDialog from "../components/UpdateDialog";
import * as RouterContext from "../contexts/RouterContext";
import * as GlobalContext from "../contexts/GlobalContext";
import * as AutoComboContext from "../contexts/AutoComboContext";
import * as KeybidingsContext from "../contexts/KeybindingsContext";
import * as AlertContext from "../contexts/AlertContext";
import * as TodoContext from "../contexts/TodoContext";
import * as WeeklyTodoContext from "../contexts/WeeklyTodoContext";
import { AutoCatchProvider } from "../contexts/AutoCatchContext";
import { UpdateProvider } from "../contexts/UpdateContext";
import * as HealingContext from "../contexts/HealingContext";
import AutoRevive from "../pages/AutoRevive";
import { AutoReviveProvider } from "../contexts/AutoReviveContext";

const Router = () => {
  return (
    <UpdateProvider>
      <RouterContext.Provider>
        <GlobalContext.Provider>
          <KeybidingsContext.Provider>
            <AlertContext.Provider>
              <TodoContext.Provider>
                <WeeklyTodoContext.Provider>
                  <HealingContext.Provider>
                    <AutoComboContext.Provider>
                      <AutoCatchProvider>
                        <AutoReviveProvider>
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
                            <Route path={RouterContext.Routes.HEALING}>
                              <Healing />
                            </Route>
                            <Route path={RouterContext.Routes.AUTO_CATCH}>
                              <AutoCatch />
                            </Route>
                            <Route path={RouterContext.Routes.AUTO_REVIVE}>
                              <AutoRevive />
                            </Route>
                            <Route path={RouterContext.Routes.TODO}>
                              <Todo />
                            </Route>
                          </Layout>
                          <UpdateDialog />
                        </AutoReviveProvider>
                      </AutoCatchProvider>
                    </AutoComboContext.Provider>
                  </HealingContext.Provider>
                </WeeklyTodoContext.Provider>
              </TodoContext.Provider>
            </AlertContext.Provider>
          </KeybidingsContext.Provider>
        </GlobalContext.Provider>
      </RouterContext.Provider>
    </UpdateProvider>
  );
};

export default Router;
