type ToggleButtonProps = {
  label: string;
  onClick: () => void;
};

const ToggleButton = ({ label, onClick }: ToggleButtonProps) => (
  <button
    onClick={onClick}
    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
  >
    {label}
  </button>
);

export default ToggleButton;
