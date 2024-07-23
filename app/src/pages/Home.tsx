import { useContext } from "react";
import { handleAntiLogout, handleAutoCombo } from "../utils/actions";
import Button from "../components/Button/Button";
import * as GlobalContext from "../contexts/GlobalContext";
import * as AutoComboContext from "../contexts/AutoComboContext";

const Home = () => {
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
    <div>
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        Pokebot{" "}
        <span className="text-xs font-medium text-slate-400">
          by Nekou & Birolho
        </span>
      </h2>
      <div className="flex gap-4">
        <Button active={antiLogout} onClick={toggleAntiLogout}>
          Anti Logout
        </Button>
        <Button active={autoCombo} onClick={toggleAutoCombo}>
          Auto Combo
        </Button>
      </div>
    </div>
  );
};

export default Home;
