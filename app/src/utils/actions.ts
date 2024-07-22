import { Combo } from "../types/types";
import { Key } from "./keys";

export const handleAntiLogout = async () => {
  const response = await fetch("/anti-logout", { method: "POST" });
  const data = await response.json();
  return data;
};

export const handleAutoCombo = async (key: Key, combo: Combo) => {
  const response = await fetch("/auto-combo", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ key, combo }),
  });
  const data = await response.json();
  return data;
};

export const updateAutoCombo = async (key: Key, combo: Combo) => {
  const response = await fetch("/update-combo", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ key, combo }),
  });
  const data = await response.json();
  return data;
};
