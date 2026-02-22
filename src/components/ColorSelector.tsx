import React from 'react';
import Input from './ui/Input';

interface ColorSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const ColorSelector: React.FC<ColorSelectorProps> = ({ value, onChange }) => {
  return (
    <div className="p-6 bg-white border border-gray-200 mt-4">
      <h2 className="text-lg font-semibold tracking-tight text-gray-900 mb-4">
        Selección de Color
      </h2>
      <Input
        label="Número de Color"
        type="number"
        placeholder="000"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        min={0}
      />
      <div className="mt-2 text-xs text-gray-500">
        Ingresa el identificador numérico del color.
      </div>
    </div>
  );
};

export default ColorSelector;
