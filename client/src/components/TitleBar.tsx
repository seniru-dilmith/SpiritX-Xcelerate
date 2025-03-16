import React from 'react';

interface TitleBarProps {
  title: string;
  subtitle?: string;
}

const TitleBar: React.FC<TitleBarProps> = ({ title, subtitle }) => {
  return (
    <div className="bg-blue-600 text-white p-4 shadow-md">
      <h1 className="text-2xl font-bold text-center">{title}</h1>
      {subtitle && (
        <p className="text-center text-sm mt-1">{subtitle}</p>
      )}
    </div>
  );
};

export default TitleBar;
