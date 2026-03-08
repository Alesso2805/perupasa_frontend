import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search } from 'lucide-react';

interface Color {
  id: number;
  numero_color: number;
  nombre?: string;
}

interface ColorSelectorProps {
  value: string;
  onChange: (value: string) => void;
  availableColors?: Color[];
}

const ColorSelector: React.FC<ColorSelectorProps> = ({ value, onChange, availableColors = [] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredColors = [...availableColors]
    .sort((a, b) => a.numero_color - b.numero_color)
    .filter((color) => color.numero_color.toString().includes(searchTerm));

  const handleManualChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    onChange(val);
    setSearchTerm(val);
  };

  const handleSelect = (colorNum: number) => {
    onChange(colorNum.toString());
    setSearchTerm(colorNum.toString());
    setIsOpen(false);
  };

  return (
    <div className="flex flex-col gap-1.5" ref={dropdownRef}>
      <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
        Selección de Color
      </label>
      
      <div className="relative">
        <div className="relative flex items-center">
          <input
            type="text"
            className="w-full pl-4 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none font-medium text-gray-900 placeholder:text-gray-400"
            placeholder="Escribe o selecciona un color..."
            value={value}
            onChange={handleManualChange}
            onFocus={() => setIsOpen(true)}
          />
          <button 
            type="button"
            className="absolute right-3 p-1 text-gray-400 hover:text-gray-600 transition-colors"
            onClick={() => setIsOpen(!isOpen)}
          >
            <ChevronDown className={`w-5 h-5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {isOpen && (
          <div className="absolute z-50 w-full mt-2 bg-white border border-gray-100 rounded-xl shadow-2xl max-h-64 overflow-hidden flex flex-col animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="p-2 border-b border-gray-50 bg-gray-50/50 flex items-center gap-2">
              <Search className="w-4 h-4 text-gray-400" />
              <input 
                type="text"
                className="bg-transparent text-sm w-full outline-none py-1"
                placeholder="Filtrar colores..."
                autoFocus
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="overflow-y-auto custom-scrollbar flex-1">
              {filteredColors.length > 0 ? (
                <div className="grid grid-cols-4 gap-1 p-2">
                  {filteredColors.map((color) => (
                    <button
                      key={color.id}
                      type="button"
                      onClick={() => handleSelect(color.numero_color)}
                      className={`
                        py-2 text-sm font-semibold rounded-lg transition-all
                        ${value === color.numero_color.toString() 
                          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' 
                          : 'hover:bg-gray-100 text-gray-700'}
                      `}
                    >
                      {color.numero_color}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-sm text-gray-500 italic">
                  No se encontraron coincidencias.
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="mt-3 flex items-center gap-2 text-[11px] text-gray-400">
        <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
        {availableColors.length} colores sincronizados desde el catálogo.
      </div>
    </div>
  );
};

export default ColorSelector;
