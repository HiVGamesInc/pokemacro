import { KeyboardKeys } from "../utils/keys";

export type HotkeyObject = (typeof KeyboardKeys)[keyof typeof KeyboardKeys];

export type Hotkey = HotkeyObject[];

export interface Combo {
  triggerKey: Hotkey;
  name: string;
  reviveSliderValue: number;
  itemList: ComboItem[];
}

export interface ComboItem {
  skillName: string;
  hotkey: Hotkey;
  afterAttackDelay: number;
}

export type IconType = React.ForwardRefExoticComponent<
  Omit<React.SVGProps<SVGSVGElement>, "ref"> & {
    title?: string;
    titleId?: string;
  } & React.RefAttributes<SVGSVGElement>
>;
