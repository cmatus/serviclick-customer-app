import React from "react";

interface ProgressProps {
  title: string;
  usageText: string;
  usagePercentage: number;
  message: string;
  className?: string;
}

const Progress = ({
  title,
  usageText,
  usagePercentage,
  message,
  className,
}: ProgressProps) => {
  return (
    <div className={className}>
      <div className="flex justify-between text-sm lg:text-base mb-2">
        <span className="text-gray-300">{title}</span>
        <span className="text-cyan-400 font-medium">{usageText}</span>
      </div>
      <div className="w-full bg-gray-700 rounded-full h-2 lg:h-3">
        <div
          className="bg-gradient-to-r from-cyan-400 to-blue-500 h-2 lg:h-3 rounded-full transition-all duration-500"
          style={{ width: `${usagePercentage}%` }}></div>
      </div>
      <div className="flex justify-end mt-2 text-sm text-gray-400">
        {message}
      </div>
    </div>
  );
};

export default Progress;
