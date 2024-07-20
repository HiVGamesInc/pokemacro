import { Key, KeyboardKeys } from "./keys";

let antiLogoutInterval: NodeJS.Timeout;

export const handleAntiLogout = (on = false, delay = 5000) => {
  //   if (on) {
  //     antiLogoutInterval = setInterval(() => {
  //       window.electron.ipcRenderer.sendMessage(
  //         'pressKey',
  //         JSON.stringify([
  //           { hotkey: [KeyboardKeys.LeftControl, KeyboardKeys.Left] },
  //           { hotkey: [KeyboardKeys.LeftControl, KeyboardKeys.Right] },
  //         ]),
  //         1000
  //       );
  //     }, delay);
  //   } else {
  //     clearInterval(antiLogoutInterval);
  //   }
};

export const handleAutoCombo = (on = false, key: Key) => {
  //   if (on) {
  //     window.electron.ipcRenderer.sendMessage(
  //       'registerKey',
  //       JSON.stringify({
  //         key,
  //         items: [
  //           { hotkey: [KeyboardKeys.Num1], afterAttackDelay: 0 },
  //           { hotkey: [KeyboardKeys.F5], afterAttackDelay: 500 },
  //           { hotkey: [KeyboardKeys.F7], afterAttackDelay: 4500 },
  //           { hotkey: [KeyboardKeys.F6], afterAttackDelay: 2000 },
  //           { hotkey: [KeyboardKeys.Num2], afterAttackDelay: 2000 },
  //         ],
  //       })
  //     );
  //   } else {
  //     window.electron.ipcRenderer.sendMessage('unregisterKey', JSON.stringify(key));
  //   }
};
