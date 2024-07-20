import ToggleButton from "./components/ToggleButton";

const App = () => {
  const toggleKeyboard = async () => {
    const response = await fetch("/toggle_keyboard", { method: "POST" });
    const data = await response.json();
    alert(data.message);
  };

  const toggleMouse = async () => {
    const response = await fetch("/toggle_mouse", { method: "POST" });
    const data = await response.json();
    alert(data.message);
  };

  return (
    <div className="text-center mt-20">
      <h1 className="text-4xl font-bold mb-8">Botiada</h1>
      <div className="space-x-4">
        <ToggleButton label="Toggle Keyboard Events" onClick={toggleKeyboard} />
        <ToggleButton label="Toggle Mouse Events" onClick={toggleMouse} />
      </div>
    </div>
  );
};

export default App;
