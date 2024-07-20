document.getElementById("os-event-btn").addEventListener("click", () => {
  fetch("/trigger_os_event", { method: "POST" })
    .then((response) => response.json())
    .then((data) => {
      alert(data.message);
    });
});
