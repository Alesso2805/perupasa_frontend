import React from 'react';
import { Search } from 'lucide-react';
import Input from './ui/Input';
import Button from './ui/Button';

interface SalesFormProps {
  onSearch: (code: string) => void;
}

const SalesForm: React.FC<SalesFormProps> = ({ onSearch }) => {
  const [code, setCode] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(code);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6 bg-white border border-gray-200">
      <h2 className="text-lg font-semibold tracking-tight text-gray-900">
        Agregar Artículo
      </h2>
      <div className="flex gap-2 items-end">
        <Input
          label="Código de Artículo"
          placeholder="EJ: REF-2024-X"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="flex-1"
        />
        <Button type="submit" variant="primary" icon={Search}>
          Buscar
        </Button>
      </div>
    </form>
  );
};

export default SalesForm;
