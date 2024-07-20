import { Key } from "./keys";

export const handleAntiLogout = async () => {
  const response = await fetch("/anti-logout", { method: "POST" });
  const data = await response.json();
  return data;
};

export const handleAutoCombo = async (key: Key) => {
  const response = await fetch("/auto-combo", { method: "POST" });
  const data = await response.json();
  return data;
};
