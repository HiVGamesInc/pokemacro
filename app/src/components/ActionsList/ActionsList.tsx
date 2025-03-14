import Card from "../Card/Card";
import { PlusIcon } from "@heroicons/react/24/outline";

const types = ["move", "delay", "pokestop", "medicine", "revive", "autoloot", "autocatch"];

export type Types = (typeof types)[number];

export const TYPE_LABELS: { [key: Types]: string } = {
  delay: "Delay",
  move: "Move",
  pokestop: "Pokestop",
  medicine: "Medicine",
  revive: "Revive",
  autoloot: "Auto Loot",
  autocatch: "Auto Catch",
};

export const TYPE_DELAYS: Record<string, string> = {
  move: "350",
  pokestop: "100",
  medicine: "100",
  revive: "100",
  autoloot: "100",
};

const Action = ({ type, onClick }: { type: Types; onClick: () => void }) => {
  return (
    <Card
      className="w-full flex justify-between items-center text-slate-300 text-md font-normal duration-100 hover:border-slate-500 hover:text-slate-100 hover:bg-slate-700"
      onClick={onClick}
    >
      <div>{TYPE_LABELS[type]}</div>
      <PlusIcon className="size-4" />
    </Card>
  );
};

const ActionsList = ({ onClick }: { onClick: (type: Types) => void }) => {
  return (
    <div className="w-48 gap-4 flex flex-col">
      {types.map((type) => (
        <Action type={type} key={type} onClick={() => onClick(type)} />
      ))}
    </div>
  );
};

export default ActionsList;
