import React from "react";

type BadgeVariant = "default" | "success" | "warning" | "error";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: "bg-gray-700 text-gray-300",
  success: "bg-green-700 text-green-200",
  warning: "bg-orange-600 text-orange-100",
  error: "bg-red-700 text-red-200",
};

const Badge = ({ children, variant = "default" }: BadgeProps) => {
  return (
    <div
      className={`inline-block px-2 py-1 lg:px-3 lg:py-1.5 text-xs lg:text-sm rounded-md font-medium ${variantClasses[variant]}`}>
      {children}
    </div>
  );
};

export default Badge;
