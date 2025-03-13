import { useContext } from "react";
import {
  FireIcon,
  Cog6ToothIcon,
  BellAlertIcon,
  BugAntIcon,
  // BoltIcon,
} from "@heroicons/react/24/outline";
import {
  FireIcon as FireIconActive,
  Cog6ToothIcon as Cog6ToothIconActive,
  BellAlertIcon as BellAlertIconActive,
  BugAntIcon as BugAntIconActive
} from "@heroicons/react/24/solid";

import { IconType } from "../types/types";
import * as RouterContext from "../contexts/RouterContext";

const IconButton = ({
  active,
  icon,
  activeIcon,
  onClick,
}: {
  active: boolean;
  icon: IconType;
  activeIcon: IconType;
  onClick: () => void;
}) => {
  const Icon = !active ? icon : activeIcon;

  return (
    <button onClick={onClick}>
      <Icon className={`size-6 ${active ? "text-blue-500" : ""}`} />
    </button>
  );
};

const Navbar = () => {
  const router = useContext(RouterContext.Context);

  return (
    <ul className="flex flex-col gap-4 p-4 bg-slate-950">
      {/* <li>
        <IconButton
          active={router.currentRoute === RouterContext.Routes.HOME}
          icon={BoltIcon}
          activeIcon={BoltIconActive}
          onClick={() => router.setCurrentRoute(RouterContext.Routes.HOME)}
        />
      </li> */}
      <li>
        <button>
          <IconButton
            active={router.currentRoute === RouterContext.Routes.AUTO_COMBO}
            icon={FireIcon}
            activeIcon={FireIconActive}
            onClick={() =>
              router.setCurrentRoute(RouterContext.Routes.AUTO_COMBO)
            }
          />
        </button>
      </li>
      <li>
        <button>
          <IconButton
            active={router.currentRoute === RouterContext.Routes.ALERT}
            icon={BellAlertIcon}
            activeIcon={BellAlertIconActive}
            onClick={() =>
              router.setCurrentRoute(RouterContext.Routes.ALERT)
            }
          />
        </button>
      </li>
      <li>
        <IconButton
              active={router.currentRoute === RouterContext.Routes.AUTO_CATCH}
              icon={BugAntIcon}
              activeIcon={BugAntIconActive}
              onClick={() =>
                router.setCurrentRoute(RouterContext.Routes.AUTO_CATCH)
              }
        />
      </li>
      <li>
        <button>
          <IconButton
            active={router.currentRoute === RouterContext.Routes.MOVE_BINDINGS}
            icon={Cog6ToothIcon}
            activeIcon={Cog6ToothIconActive}
            onClick={() =>
              router.setCurrentRoute(RouterContext.Routes.MOVE_BINDINGS)
            }
          />
        </button>
      </li>
      
    </ul>
  );
};

export default Navbar;
