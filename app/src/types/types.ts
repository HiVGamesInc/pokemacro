import { KeyboardKeys } from "../utils/keys";

export type HotkeyObject = (typeof KeyboardKeys)[keyof typeof KeyboardKeys];

export type Hotkey = HotkeyObject[];

export interface Combo {
  triggerKey: Hotkey;
  name: string;
  moveList: ComboMove[];
}

export interface ComboMove {
  skillName?: string;
  hotkey?: HotkeyObject;
  delay?: string;
}

export type IconType = React.ForwardRefExoticComponent<
  Omit<React.SVGProps<SVGSVGElement>, "ref"> & {
    title?: string;
    titleId?: string;
  } & React.RefAttributes<SVGSVGElement>
>;
