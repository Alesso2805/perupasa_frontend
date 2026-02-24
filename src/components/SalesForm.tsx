import React, { useState, useEffect } from 'react';
import { Plus, Package, Layers } from 'lucide-react';
import Input from './ui/Input';
import Button from './ui/Button';
import type { Product } from '../services/productsService';

interface SalesFormProps {
  onAdd: (product: Product, quantity: number, unit: string) => void;
  availableProducts: Product[];
}

const SalesForm: React.FC<SalesFormProps> = ({ onAdd, availableProducts }) => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedProductId, setSelectedProductId] = useState<number | ''>('');
  const [quantity, setQuantity] = useState(1);
  const [unit, setUnit] = useState('Piezas');

  // Obtener categorías únicas
  const categories = Array.from(new Set(availableProducts.map(p => p.categoria))).sort();

  // Productos de la categoría seleccionada
  const filteredProducts = availableProducts
    .filter(p => !selectedCategory || p.categoria === selectedCategory)
    .sort((a, b) => a.nombre.localeCompare(b.nombre));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductId) return;
    
    const product = availableProducts.find(p => p.id === selectedProductId);
    if (product) {
      onAdd(product, quantity, unit);
      setSelectedProductId('');
    }
  };

  useEffect(() => {
    setSelectedProductId('');
  }, [selectedCategory]);

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-2">
        Catálogo de Artículos
      </h2>
      
      <div className="space-y-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="w-3 h-3" /> Categoría
          </label>
          <select 
            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-medium text-gray-900 transition-all font-sans"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">Todas las categorías</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
            <Package className="w-3 h-3" /> Producto
          </label>
          <select 
            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-medium text-gray-900 transition-all disabled:opacity-50 font-sans"
            value={selectedProductId}
            onChange={(e) => setSelectedProductId(Number(e.target.value))}
            disabled={!filteredProducts.length}
          >
            <option value="">Selecciona un producto...</option>
            {filteredProducts.map(p => (
              <option key={p.id} value={p.id}>
                {p.codigo_articulo} - {p.nombre}
              </option>
            ))}
          </select>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Cantidad"
            type="number"
            min={1}
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
          />
          
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Unidad
            </label>
            <div className="flex bg-gray-50 p-1 rounded-lg border border-gray-200">
              {['Piezas', 'Metros'].map((u) => (
                <button
                  key={u}
                  type="button"
                  onClick={() => setUnit(u)}
                  className={`
                    flex-1 py-1.5 text-xs font-bold rounded-md transition-all
                    ${unit === u 
                      ? 'bg-white text-indigo-600 shadow-sm border border-gray-100' 
                      : 'text-gray-400 hover:text-gray-600'}
                  `}
                >
                  {u}
                </button>
              ))}
            </div>
          </div>
        </div>

        <Button 
          type="submit" 
          variant="primary" 
          icon={Plus} 
          fullWidth
          disabled={!selectedProductId}
        >
          Agregar a la Guía
        </Button>
      </div>
    </form>
  );
};

export default SalesForm;
