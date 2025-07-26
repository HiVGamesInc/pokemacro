import { useContext } from "react";
import {
  FireIcon,
  Cog6ToothIcon,
  BellAlertIcon,
  BugAntIcon,
  HeartIcon,
  SparklesIcon, // Import icon for Auto Revive
  ClipboardDocumentListIcon, // Import icon for Todo
  RocketLaunchIcon, // Import icon for Release Manager
} from "@heroicons/react/24/outline";
import {
  FireIcon as FireIconActive,
  Cog6ToothIcon as Cog6ToothIconActive,
  BellAlertIcon as BellAlertIconActive,
  BugAntIcon as BugAntIconActive,
  HeartIcon as HeartIconActive,
  SparklesIcon as SparklesIconActive, // Import active icon for Auto Revive
  ClipboardDocumentListIcon as ClipboardDocumentListIconActive, // Import active icon for Todo
  RocketLaunchIcon as RocketLaunchIconActive, // Import active icon for Release Manager
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
            onClick={() => router.setCurrentRoute(RouterContext.Routes.ALERT)}
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
            active={router.currentRoute === RouterContext.Routes.HEALING}
            icon={HeartIcon}
            activeIcon={HeartIconActive}
            onClick={() => router.setCurrentRoute(RouterContext.Routes.HEALING)}
          />
        </button>
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
      <li>
        <IconButton
          active={router.currentRoute === RouterContext.Routes.AUTO_REVIVE}
          icon={SparklesIcon}
          activeIcon={SparklesIconActive}
          onClick={() =>
            router.setCurrentRoute(RouterContext.Routes.AUTO_REVIVE)
          }
        />
      </li>
      <li>
        <IconButton
          active={router.currentRoute === RouterContext.Routes.TODO}
          icon={ClipboardDocumentListIcon}
          activeIcon={ClipboardDocumentListIconActive}
          onClick={() => router.setCurrentRoute(RouterContext.Routes.TODO)}
        />
      </li>
      <li>
        <IconButton
          active={router.currentRoute === RouterContext.Routes.RELEASE_MANAGER}
          icon={RocketLaunchIcon}
          activeIcon={RocketLaunchIconActive}
          onClick={() =>
            router.setCurrentRoute(RouterContext.Routes.RELEASE_MANAGER)
          }
        />
      </li>
    </ul>
  );
};

export default Navbar;
