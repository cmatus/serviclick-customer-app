import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card = ({ children, className }: CardProps) => {
  return (
    <div
      className={`
        bg-gray-800 
        rounded-xl p-4 
        lg:p-5 
        border border-gray-700 
        hover:border-cyan-500/50 transition-all duration-300 
        cursor-pointer group
        ${className ?? ""}`}>
      {children}
    </div>
  );
};

export default Card;
