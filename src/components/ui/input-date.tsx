import React from "react";
import { Calendar } from "lucide-react";

interface InputDateProps {
  label: string;
  value: string;
  onChange?: (value: string) => void;
  enabled?: boolean;
  required?: boolean;
}

const InputDate: React.FC<InputDateProps> = ({
  label,
  value,
  onChange,
  enabled = true,
  required = false,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };

  const formatDisplayDate = (dateValue: string) => {
    if (!dateValue) return "-";

    // Si ya está en formato dd/mm/yyyy, mantenerlo
    if (dateValue.includes("/")) {
      return dateValue;
    }

    // Si está en formato yyyy-mm-dd, convertirlo
    try {
      const date = new Date(dateValue);
      return date.toLocaleDateString("es-CL");
    } catch {
      return dateValue;
    }
  };

  if (!enabled) {
    // Modo disabled - Solo mostrar el valor sin bordes ni controles
    return (
      <div className="relative h-[50px] bg-transparent rounded-lg flex items-end pb-1 pl-3">
        <label className="absolute top-1 left-3 text-xs font-medium text-[#e6eaf3]/60 uppercase tracking-wide">
          {label}
        </label>
        <div className="text-white text-sm font-medium">
          {formatDisplayDate(value)}
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-[50px]">
      <label className="absolute top-1 left-3 text-xs font-medium text-[#e6eaf3]/60 uppercase tracking-wide z-10">
        {label}
      </label>
      <input
        type="date"
        value={value || ""}
        onChange={handleChange}
        required={required}
        className="w-full h-full bg-[#232a3a] border border-[#2a3441] rounded-lg px-3 pt-5 pb-1 pr-10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-2 [&::-webkit-calendar-picker-indicator]:w-5 [&::-webkit-calendar-picker-indicator]:h-5 [&::-webkit-calendar-picker-indicator]:cursor-pointer"
      />
      <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#e6eaf3]/60 pointer-events-none" />
    </div>
  );
};

export default InputDate;
