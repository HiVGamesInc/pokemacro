import React, { useContext } from "react";
import { BotContext } from "../router/router";
import { handleAntiLogout, handleAutoCombo } from "../utils/actions";
import Button from "../components/Button/Button";
import { KeyboardKeys } from "../utils/keys";
import { AutoComboContext } from "../router/router";

const Home = () => {
  const { antiLogout, setAntiLogout } = useContext(BotContext);
  const { autoCombo, setAutoCombo } = useContext(BotContext);
  const { currentCombo } = useContext(AutoComboContext);

  const toggleAntiLogout = () => {
    setAntiLogout(!antiLogout);
    handleAntiLogout();
  };
  const toggleAutoCombo = () => {
    setAutoCombo(!autoCombo);
    handleAutoCombo(KeyboardKeys.V, currentCombo);
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
