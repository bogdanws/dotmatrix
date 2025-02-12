interface ToggleSwitchProps {
  checked: boolean;
  onToggle: (newValue: boolean) => void;
  id?: string;
}

export function ToggleSwitch({ checked, onToggle, id = "switch-toggle" }: ToggleSwitchProps) {
  const handleToggle = () => {
    onToggle(!checked);
  };

  return (
    <label htmlFor={id} className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        id={id}
        className="sr-only peer"
        checked={checked}
        onChange={handleToggle}
      />
      <div className="w-11 h-6 bg-gray-200 rounded-full peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 transition-colors duration-300 peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:border-gray-400 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-5 peer-checked:after:border-white">
      </div>
    </label>
  );
} 