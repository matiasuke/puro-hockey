import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  footer?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ children, className = '', title, footer }) => {
  return (
    <div className={`bg-white rounded-md shadow-md overflow-hidden ${className}`}>
      {title && (
        <div className="bg-hockey-verde-oscuro text-white px-4 py-3">
          <h3 className="text-h3 font-bold">{title}</h3>
        </div>
      )}
      <div className="p-4">
        {children}
      </div>
      {footer && (
        <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
          {footer}
        </div>
      )}
    </div>
  );
};
