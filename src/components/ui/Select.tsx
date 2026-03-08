import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export interface Option {
  value: string | number;
  label: string;
}

interface SelectProps {
  options: Option[];
  value: string | number;
  onChange: (value: string | number) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

const Select: React.FC<SelectProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Selecciona una opción...',
  disabled = false,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <div
        className={`flex w-full items-center justify-between border border-gray-200 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-900 rounded-lg transition-all ${
          disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none'
        } ${isOpen ? 'ring-2 ring-indigo-500 border-indigo-500' : ''}`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        tabIndex={disabled ? -1 : 0}
        onKeyDown={(e) => {
          if (!disabled && (e.key === 'Enter' || e.key === ' ')) {
             e.preventDefault();
             setIsOpen(!isOpen);
          }
        }}
      >
        <span className={`block whitespace-normal break-words text-left ${!selectedOption ? 'text-gray-500' : ''}`}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown className={`ml-2 flex-shrink-0 w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {isOpen && !disabled && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto py-1">
          {options.length === 0 ? (
            <div className="px-4 py-2 text-sm text-gray-500">No hay opciones disponibles</div>
          ) : (
            options.map((option) => (
              <div
                key={option.value}
                className={`flex items-center justify-between px-4 py-2 text-sm cursor-pointer hover:bg-indigo-50 ${
                  value === option.value ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-gray-700'
                }`}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
              >
                <span className="block whitespace-normal break-words text-left pr-2">{option.label}</span>
                {value === option.value && <Check className="ml-2 flex-shrink-0 w-4 h-4 text-indigo-600" />}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Select;
