import { Combo } from "../types/types";

export const handleAntiLogout = async () => {
  const response = await fetch("/anti-logout", { method: "POST" });
  const data = await response.json();
  return data;
};

export const handleAlert = async () => {
  const response = await fetch("/alert", { method: "POST" });
  const data = await response.json();
  return data;
};

export const handleAutoCombo = async (combo: Combo) => {
  const response = await fetch("/auto-combo", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ key: combo?.triggerKey?.[0], combo }),
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
    body: JSON.stringify({ key: combo?.triggerKey?.[0], combo }),
  });
  const data = await response.json();
  return data;
};

export const saveConfig = async (config: any, filename?: string) => {
  const response = await fetch("/save-config", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ config, filename }),
  });
  const data = await response.json();
  return data;
};

export const loadConfig = async (filename?: string) => {
  const response = await fetch("/load-config", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ filename }),
  });
  const data = await response.json();
  return data;
};

export const handleAutoCatch = async () => {
  console.log('toggle')
  const response = await fetch("/auto-catch", { method: "POST" });
  const data = await response.json();
  console.log(data)
  return data;
};

export const handleCropImage = async () => {
  const response = await fetch("/crop-image", { method: "POST" });
  const data = await response.json();
  return data;
};

export const getImages = async () => {
  const response = await fetch("/list-images", { method: "GET" });
  const data = await response.json();
  return data;
};

export const deleteImage = async (filename: string) => {
  const response = await fetch(`/delete-image/${filename}`, { method: "DELETE" });
  const data = await response.json();
  return data;
};

export const renameImage = async (oldFilename: string, newFilename: string) => {
  const response = await fetch("/rename-image", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ oldFilename, newFilename }),
  });
  const data = await response.json();
  return data;
};
