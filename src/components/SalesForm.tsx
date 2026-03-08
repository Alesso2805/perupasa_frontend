import React, { useState, useEffect } from 'react';
import { Plus, Package, Layers } from 'lucide-react';
import Input from './ui/Input';
import Button from './ui/Button';
import Select from './ui/Select';
import type { Product } from '../services/productsService';

interface SalesFormProps {
  onAdd: (product: Product, quantity: number, unit: string) => void;
  availableProducts: Product[];
  priceList: 'GENERAL' | 'COPASA';
  children?: React.ReactNode;
}

const SalesForm: React.FC<SalesFormProps> = ({ onAdd, availableProducts, priceList, children }) => {
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

  const getProductPrice = (product: Product): string => {
    if (!product.precios || product.precios.length === 0) return '';
    let priceObj = product.precios.find(p => p.tipo_lista === priceList);
    let valor = 0;
    
    if (!priceObj) {
      const otherPrice = product.precios[0];
      if (priceList === 'GENERAL') {
        valor = +(otherPrice.valor_soles * 1.25).toFixed(2);
      } else {
        valor = +(otherPrice.valor_soles / 1.25).toFixed(2);
      }
    } else {
      valor = priceObj.valor_soles;
    }
    return ` - S/ ${valor.toFixed(2)}`;
  };

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
          <Select 
            value={selectedCategory}
            onChange={(val) => setSelectedCategory(String(val))}
            options={[
              { value: '', label: 'Todas las categorías' },
              ...categories.map(cat => ({ value: cat, label: cat }))
            ]}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
            <Package className="w-3 h-3" /> Producto
          </label>
          <Select 
            value={selectedProductId}
            onChange={(val) => setSelectedProductId(Number(val) || '')}
            disabled={!filteredProducts.length}
            placeholder="Selecciona un producto..."
            options={filteredProducts.map(p => ({
              value: p.id,
              label: `${p.codigo_articulo} - ${p.nombre}${getProductPrice(p)}`
            }))}
          />
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

        {children}

        <Button 
          type="submit" 
          variant="primary" 
          icon={Plus} 
          fullWidth
          disabled={!selectedProductId}
          className="mt-4"
        >
          Agregar a la Guía
        </Button>
      </div>
    </form>
  );
};

export default SalesForm;
