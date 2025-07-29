import UpdateNotification from "./UpdateNotification";

const Toolbar = () => {
  return (
    <div className="h-12 bg-gray-800 border-b border-gray-700 flex items-center px-4 justify-between">
      <div className="flex items-center gap-3">
        <h1 className="text-sm font-semibold text-gray-200">Pokemacro</h1>
        <span className="text-xs text-gray-400">by Home Várzea</span>
      </div>

      <div className="flex items-center gap-2">
        <UpdateNotification />
      </div>
    </div>
  );
};

export default Toolbar;
