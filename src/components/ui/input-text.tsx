import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface InputTextProps {
  label: string;
  type: "text" | "number" | "amount" | "textarea" | "password";
  value: string | number;
  placeholder?: string;
  onChange?: (value: string) => void;
  enabled?: boolean;
  required?: boolean;
  rows?: number; // Para textarea
}

const InputText: React.FC<InputTextProps> = ({
  label,
  type,
  value,
  placeholder = "",
  onChange,
  enabled = true,
  required = false,
  rows = 3, // Valor por defecto para textarea
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (onChange) {
      let value = e.target.value;

      // Para tipo amount, solo permitir números, punto decimal y formato de moneda
      if (type === "amount") {
        // Remover cualquier carácter que no sea número o punto decimal
        value = value.replace(/[^0-9.]/g, "");
        // Asegurar que solo hay un punto decimal
        const parts = value.split(".");
        if (parts.length > 2) {
          value = parts[0] + "." + parts.slice(1).join("");
        }
        // Limitar a 2 decimales
        if (parts[1] && parts[1].length > 2) {
          value = parts[0] + "." + parts[1].substring(0, 2);
        }
      }

      onChange(value);
    }
  };

  const getInputProps = () => {
    const baseProps = {
      value: value || "",
      onChange: handleChange,
      placeholder,
      required,
    };

    switch (type) {
      case "number":
        return {
          ...baseProps,
          type: "number",
          min: "0",
        };
      case "amount":
        return {
          ...baseProps,
          type: "text",
          inputMode: "decimal" as const,
          pattern: "[0-9]*[.,]?[0-9]*",
          placeholder: placeholder || "$0",
        };
      case "password":
        return {
          ...baseProps,
          type: showPassword ? "text" : "password",
        };
      default:
        return {
          ...baseProps,
          type: "text",
        };
    }
  };

  if (!enabled) {
    // Modo disabled - Solo mostrar el valor sin bordes ni controles
    // Para textarea usar altura automática
    const disabledContainerClass =
      type === "textarea"
        ? "relative min-h-[50px] bg-transparent rounded-lg flex flex-col justify-start pt-6 pb-2 pl-3 pr-3"
        : "relative h-[50px] bg-transparent rounded-lg flex items-end pb-1 pl-3";

    return (
      <div className={disabledContainerClass}>
        <label className="absolute top-1 left-3 text-xs font-medium text-[#e6eaf3]/60 uppercase tracking-wide">
          {label}
        </label>
        <div className="text-white text-sm font-medium whitespace-pre-wrap break-words">
          {value || "-"}
        </div>
      </div>
    );
  }

  // Para textarea, usar altura auto en lugar de fija
  const containerClass =
    type === "textarea" ? "relative min-h-[50px]" : "relative h-[50px]";

  return (
    <div className={containerClass}>
      <label className="absolute top-1 left-3 text-xs font-medium text-[#e6eaf3]/60 uppercase tracking-wide z-10">
        {label}
      </label>
      {type === "textarea" ? (
        <textarea
          value={value || ""}
          onChange={handleChange}
          placeholder={placeholder}
          required={required}
          rows={rows}
          className="w-full bg-[#232a3a] border border-[#2a3441] rounded-lg px-3 pt-5 pb-1 text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent resize-none"
        />
      ) : (
        <>
          <input
            {...getInputProps()}
            className={`w-full h-full bg-[#232a3a] border border-[#2a3441] rounded-lg px-3 pt-5 pb-1 text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent ${
              type === "password" ? "pr-10" : ""
            }`}
          />
          {type === "password" && (
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#e6eaf3]/60 hover:text-[#e6eaf3] transition-colors"
              tabIndex={-1}>
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default InputText;
