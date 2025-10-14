import React from "react";
import { ChevronDown } from "lucide-react";

interface SelectOption {
  value: string;
  text: string;
}

interface InputSelectProps {
  label: string;
  value: string;
  options: SelectOption[];
  placeholder?: string;
  onChange?: (value: string) => void;
  enabled?: boolean;
  required?: boolean;
}

const InputSelect: React.FC<InputSelectProps> = ({
  label,
  value,
  options,
  placeholder = "Seleccionar opción",
  onChange,
  enabled = true,
  required = false,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };

  const getDisplayValue = () => {
    if (!value) return "-";

    const selectedOption = options.find((option) => option.value === value);
    return selectedOption ? selectedOption.text : value;
  };

  if (!enabled) {
    // Modo disabled - Solo mostrar el valor sin bordes ni controles
    return (
      <div className="relative h-[50px] bg-transparent rounded-lg flex items-end pb-1 pl-3">
        <label className="absolute top-1 left-3 text-xs font-medium text-[#e6eaf3]/60 uppercase tracking-wide">
          {label}
        </label>
        <div className="text-white text-sm font-medium">
          {getDisplayValue()}
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-[50px]">
      <label className="absolute top-1 left-3 text-xs font-medium text-[#e6eaf3]/60 uppercase tracking-wide z-10">
        {label}
      </label>
      <select
        value={value || ""}
        onChange={handleChange}
        required={required}
        className="w-full h-full bg-[#232a3a] border border-[#2a3441] rounded-lg px-3 pt-5 pb-1 pr-10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent appearance-none cursor-pointer">
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.text}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#e6eaf3]/60 pointer-events-none" />
    </div>
  );
};

export default InputSelect;
