import { useContext } from "react";
import { handleAntiLogout, handleAutoCombo, handleAlert, handleHealing, handleAutoCatch } from "../../utils/actions";
import Button from "../Button/Button";
import * as GlobalContext from "../../contexts/GlobalContext";
import * as AutoComboContext from "../../contexts/AutoComboContext";

const Header = () => {
  const { antiLogout, setAntiLogout, autoCombo, setAutoCombo, alertStatus, setAlertStatus, autoCatch, setAutoCatch, healing, setHealing } = useContext(GlobalContext.Context); 
  const { currentCombo } = useContext(AutoComboContext.Context);

  const toggleAntiLogout = () => {
    setAntiLogout(!antiLogout);
    handleAntiLogout();
  };

  const toggleAlert = async () => {
    const result = await handleAlert();
    if(result.data){
      setAlertStatus(result.data.alert_enabled);
    }
  };

  const toggleHealing = async () => {
    const result = await handleHealing();
    if(result.data){
      setHealing(result.data.healing_enabled);
    }
  };

  const toggleAutoCombo = () => {
    setAutoCombo(!autoCombo);
    handleAutoCombo(currentCombo);
  };

  const toggleAutoCatch = () => {
    setAutoCatch(!autoCatch);
    handleAutoCatch() 
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
          <Button active={alertStatus} onClick={toggleAlert}>
            Alert
          </Button>
          <Button active={healing} onClick={toggleHealing}>
            Healing
          </Button>
          <Button active={autoCombo} onClick={toggleAutoCombo}>
            Auto Combo
          </Button>
          <Button active={autoCatch} onClick={toggleAutoCatch}>
            Auto Catch
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Header;