import { useState } from 'react';
import GuidePreview from './components/GuidePreview';
import SalesForm from './components/SalesForm';
import ColorSelector from './components/ColorSelector';
import Button from './components/ui/Button';
import { Plus } from 'lucide-react';

const MOCK_DB: Record<string, string> = {
  'REF-001': 'TELAS ALGODON PIMA 50/1',
  'REF-002': 'BOTONES 4 HOYOS NAT',
  'REF-003': 'CIERRES METALICOS YKK',
};

function App() {
  const [items, setItems] = useState<Array<{
    code: string;
    description: string;
    color: string;
    quantity: number;
  }>>([]);

  const [currentColor, setCurrentColor] = useState('');

  const handleSearch = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    const desc = MOCK_DB[cleanCode] || `ARTICULO GENERICO (${cleanCode})`;

    const newItem = {
      code: cleanCode,
      description: desc,
      color: currentColor || '000',
      quantity: 1, // Default quantity
    };

    setItems([...items, newItem]);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 lg:p-8">
      <main className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Controls */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="mb-4">
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Perupasatex</h1>
            <p className="text-sm text-gray-500">Sistema de Guías v1.0</p>
          </div>
          
          <SalesForm onSearch={handleSearch} />
          
          <ColorSelector 
            value={currentColor} 
            onChange={setCurrentColor} 
          />
          
          <div className="p-6 bg-white border border-gray-200 mt-auto">
             <div className="flex justify-between items-center mb-4">
               <span className="text-sm font-medium text-gray-700">Acciones Rápidas</span>
             </div>
             <div className="space-y-2">
               <Button fullWidth variant="outline" size="sm">
                 Nueva Guía
               </Button>
               <Button fullWidth variant="primary" icon={Plus}>
                 Generar Documento
               </Button>
             </div>
          </div>
        </div>

        {/* Right Side: Preview */}
        <div className="lg:col-span-8">
          <div className="sticky top-8">
            <GuidePreview items={items} />
          </div>
        </div>

      </main>
    </div>
  );
}

export default App;
