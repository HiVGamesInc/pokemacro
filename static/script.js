function toggleKeyboard() {
  fetch("/toggle_keyboard", { method: "POST" })
    .then((response) => response.json())
    .then((data) => {
      alert(data.message);
    });
}

function toggleMouse() {
  fetch("/toggle_mouse", { method: "POST" })
    .then((response) => response.json())
    .then((data) => {
      alert(data.message);
    });
}
