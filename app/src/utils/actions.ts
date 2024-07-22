import { Combo } from "../types/types";

export const handleAntiLogout = async () => {
  const response = await fetch("/anti-logout", { method: "POST" });
  const data = await response.json();
  return data;
};

export const handleAutoCombo = async (combo: Combo) => {
  const response = await fetch("/auto-combo", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ key: combo.triggerKey[0], combo }),
  });
  const data = await response.json();
  return data;
};

export const updateAutoCombo = async (combo: Combo) => {
  const response = await fetch("/update-combo", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ key: combo.triggerKey[0], combo }),
  });
  const data = await response.json();
  return data;
};

export const saveConfig = async (combo: Combo) => {
  const response = await fetch("/save-config", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ combo }),
  });
  const data = await response.json();
  return data;
};

export const loadConfig = async () => {
  const response = await fetch("/load-config", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({}),
  });
  const data = await response.json();
  return data;
};
