import React, { useContext, useEffect } from 'react';
import { BotContext } from '../router/router';
import { handleAntiLogout, handleAutoCombo } from '../utils/actions';
import Button from '../components/Button/Button';
import { KeyboardKeys } from '../utils/keys';

const Home = () => {
  const { antiLogout, setAntiLogout } = useContext(BotContext);
  const { autoCombo, setAutoCombo } = useContext(BotContext);

  const toggleAntiLogout = () => setAntiLogout(!antiLogout);
  const toggleAutoCombo = () => setAutoCombo(!autoCombo);

  useEffect(() => {
    handleAntiLogout(antiLogout);
  }, [antiLogout]);

  useEffect(() => {
    handleAutoCombo(autoCombo, KeyboardKeys.V);
  }, [autoCombo]);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        Pokebot <span className="text-xs font-medium text-slate-400">by Nekou & Birolho</span>
      </h2>
      <Button active={antiLogout} onClick={toggleAntiLogout}>
        Anti Logout
      </Button>
      <Button active={autoCombo} onClick={toggleAutoCombo}>
        Auto Combo
      </Button>
    </div>
  );
};

export default Home;
