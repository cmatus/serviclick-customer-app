import React from "react";
import InputText from "./input-text";
import InputDate from "./input-date";
import InputSelect from "./input-select";

import Card from "@/components/ui/card";

export interface FormFieldOption {
  value: string;
  text: string;
}

export interface FormField {
  label: string;
  type:
    | "text"
    | "number"
    | "amount"
    | "date"
    | "select"
    | "textarea"
    | "password";
  variable: string; // Variable que almacena el valor
  value?: string | number;
  placeholder?: string;
  required?: boolean;
  fullWidth?: boolean; // Si usa fila completa o la comparte
  options?: FormFieldOption[]; // Para tipo select
}

interface FormProps {
  fields: FormField[];
  title?: string;
  editable?: boolean; // Modo edición/vista
  data?: Record<string, string | number>; // Datos del formulario
  onChange?: (variable: string, value: string) => void; // Callback para cambios
  className?: string;
}

const Form: React.FC<FormProps> = ({
  title,
  fields,
  editable = false,
  data = {},
  onChange,
  className = "",
}) => {
  const handleFieldChange = (variable: string, value: string) => {
    if (onChange) {
      onChange(variable, value);
    }
  };

  const renderField = (field: FormField) => {
    const fieldValue = data[field.variable] || field.value || "";

    switch (field.type) {
      case "text":
      case "number":
      case "amount":
      case "textarea":
      case "password":
        return (
          <InputText
            label={field.label}
            type={field.type}
            value={fieldValue}
            placeholder={field.placeholder}
            onChange={(value) => handleFieldChange(field.variable, value)}
            enabled={editable}
            required={field.required}
            rows={field.type === "textarea" ? 3 : undefined}
          />
        );

      case "date":
        return (
          <InputDate
            label={field.label}
            value={fieldValue.toString()}
            onChange={(value) => handleFieldChange(field.variable, value)}
            enabled={editable}
            required={field.required}
          />
        );

      case "select":
        return (
          <InputSelect
            label={field.label}
            value={fieldValue.toString()}
            options={field.options || []}
            placeholder={field.placeholder}
            onChange={(value) => handleFieldChange(field.variable, value)}
            enabled={editable}
            required={field.required}
          />
        );

      default:
        return null;
    }
  };

  // Agrupar campos por filas basado en fullWidth
  const organizedFields: FormField[][] = [];
  let currentRow: FormField[] = [];

  fields.forEach((field) => {
    if (field.fullWidth) {
      // Si hay campos en la fila actual, cerrarla
      if (currentRow.length > 0) {
        organizedFields.push([...currentRow]);
        currentRow = [];
      }
      // Agregar campo de ancho completo como fila independiente
      organizedFields.push([field]);
    } else {
      // Agregar al row actual
      currentRow.push(field);

      // Si ya tenemos 2 campos en la fila (máximo para responsive), cerrar la fila
      if (currentRow.length === 2) {
        organizedFields.push([...currentRow]);
        currentRow = [];
      }
    }
  });

  // Si queda una fila parcial, agregarla
  if (currentRow.length > 0) {
    organizedFields.push(currentRow);
  }

  return (
    <Card>
      {title && (
        <h2 className="text-lg lg:text-xl font-bold text-white mb-4 lg:mb-6">
          {title}
        </h2>
      )}

      <div className={`space-y-4 ${className}`}>
        {organizedFields.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className={
              row.length === 1 && row[0].fullWidth
                ? "w-full"
                : "grid grid-cols-1 md:grid-cols-2 gap-4"
            }>
            {row.map((field, fieldIndex) => (
              <div key={`${rowIndex}-${fieldIndex}`}>{renderField(field)}</div>
            ))}
          </div>
        ))}
      </div>
    </Card>
  );
};

export default Form;
