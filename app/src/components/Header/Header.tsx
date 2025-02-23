import { useContext } from "react";
import { handleAntiLogout, handleAutoCombo } from "../../utils/actions";
import Button from "../Button/Button";
import * as GlobalContext from "../../contexts/GlobalContext";
import * as AutoComboContext from "../../contexts/AutoComboContext";

const Header = () => {
  const { antiLogout, setAntiLogout } = useContext(GlobalContext.Context);
  const { autoCombo, setAutoCombo } = useContext(GlobalContext.Context);
  const { currentCombo } = useContext(AutoComboContext.Context);

  const toggleAntiLogout = () => {
    setAntiLogout(!antiLogout);
    handleAntiLogout();
  };
  const toggleAutoCombo = () => {
    setAutoCombo(!autoCombo);
    handleAutoCombo(currentCombo);
  };

  return (
    <div className="p-4 bg-slate-950 border-b border-slate-700">
      <div className="flex gap-4 justify-between items-center">
        <h2 className="text-xl font-bold">
          Pokebot{" "}
          <div className="text-xs font-medium text-slate-400">
            by Nekou & Birolho
          </div>
        </h2>
        <div className="flex gap-2">
          <Button active={antiLogout} onClick={toggleAntiLogout}>
            Anti Logout
          </Button>
          <Button active={autoCombo} onClick={toggleAutoCombo}>
            Auto Combo
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Header;
