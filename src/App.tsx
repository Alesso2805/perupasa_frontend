import { useState, useEffect } from 'react';
import GuidePreview from './components/GuidePreview';
import SalesForm from './components/SalesForm';
import ColorSelector from './components/ColorSelector';
import Button from './components/ui/Button';
import { Plus } from 'lucide-react';
import { productsService, type Product, type Color } from './services/productsService';
import { salesService } from './services/salesService';

function App() {
  const [items, setItems] = useState<Array<{
    code: string;
    description: string;
    color: string;
    quantity: number;
    unit: string;
    productId: number;
    colorId?: number;
    price: number;
    total: number;
  }>>([]);

  const [currentColor, setCurrentColor] = useState('');
  const [priceList, setPriceList] = useState<'GENERAL' | 'COPASA'>('GENERAL');
  const [availableProducts, setAvailableProducts] = useState<Product[]>([]);
  const [availableColors, setAvailableColors] = useState<Color[]>([]);
  const [nextGuideNumber, setNextGuideNumber] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Cargar productos y colores al iniciar
    productsService.getProducts().then(setAvailableProducts).catch(console.error);
    productsService.getColors().then(setAvailableColors).catch(console.error);
    salesService.getNextNumber().then(setNextGuideNumber).catch(console.error);
  }, []);

  const handleAddItem = (product: Product, quantity: number, unit: string) => {
    // Buscar el precio que corresponde a la lista seleccionada
    let priceObj = product.precios?.find(p => p.tipo_lista === priceList);
    
    // Si no hay precio GENERAL pero es la lista seleccionada, intentar calcularlo del de COPASA o viceversa
    if (!priceObj && product.precios?.length) {
      const otherPrice = product.precios[0];
      if (priceList === 'GENERAL') {
        const valor = +(otherPrice.valor_soles * 1.25).toFixed(2);
        priceObj = { id: 0, tipo_lista: 'GENERAL', valor_soles: valor };
      } else {
        const valor = +(otherPrice.valor_soles / 1.25).toFixed(2);
        priceObj = { id: 0, tipo_lista: 'COPASA', valor_soles: valor };
      }
    }

    const price = priceObj?.valor_soles || 0;

    if (price === 0) {
      alert(`El artículo "${product.nombre}" no tiene un precio definido para la lista ${priceList}.`);
      return;
    }

    // Buscar si el color ingresado existe en la base de datos para obtener su ID
    const colorObj = availableColors.find(c => c.numero_color.toString() === currentColor);

    const total = price * quantity;

    const newItem = {
      code: product.codigo_articulo,
      description: product.nombre,
      color: currentColor || '000',
      quantity,
      unit,
      productId: product.id,
      colorId: colorObj?.id,
      price,
      total
    };

    setItems(prevItems => [...prevItems, newItem]);
  };

  const handleNewGuide = () => {
    if (confirm('¿Estás seguro de que deseas limpiar la guía actual?')) {
      setItems([]);
      setCurrentColor('');
    }
  };

  const handleGenerateDocument = async () => {
    if (items.length === 0) {
      alert('Debes agregar al menos un artículo a la guía.');
      return;
    }

    const cliente = prompt('Ingrese el nombre del cliente:', 'CLIENTE GENERAL');
    if (!cliente) return;

    setIsSaving(true);
    try {
      const saleData = {
        cliente,
        es_copasa: priceList === 'COPASA',
        items: items.map(item => ({
          productoId: item.productId,
          colorId: item.colorId || 1, // Fallback al color por defecto si no existe
          cantidad: item.quantity,
          unidad: item.unit,
          precioUnitario: item.price
        }))
      };

      const result = await salesService.createSale(saleData);
      alert(`Guía ${result.numero_guia} creada con éxito.`);
      
      // Actualizar el siguiente número de guía
      salesService.getNextNumber().then(setNextGuideNumber).catch(console.error);
      
      // Abrir el PDF en una nueva pestaña
      const pdfUrl = salesService.getSalePdfUrl(result.id);
      window.open(pdfUrl, '_blank');
      
      setItems([]); // Limpiar después de generar
    } catch (error) {
      console.error('Error al generar documento:', error);
      alert('Hubo un error al generar la guía.');
    } finally {
      setIsSaving(false);
    }
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
          
          <SalesForm onAdd={handleAddItem} availableProducts={availableProducts} />

          <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-4">
              Configuración de Venta
            </h2>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Lista de Precios
              </label>
              <div className="flex bg-gray-50 p-1 rounded-lg border border-gray-200">
                {(['GENERAL', 'COPASA'] as const).map((list) => (
                  <button
                    key={list}
                    type="button"
                    onClick={() => setPriceList(list)}
                    className={`
                      flex-1 py-2 text-xs font-bold rounded-md transition-all
                      ${priceList === list 
                        ? 'bg-white text-indigo-600 shadow-sm border border-gray-100' 
                        : 'text-gray-400 hover:text-gray-600'}
                    `}
                  >
                    {list}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          <ColorSelector 
            value={currentColor} 
            onChange={setCurrentColor}
            availableColors={availableColors}
          />
          
          <div className="p-6 bg-white border border-gray-200 mt-auto">
             <div className="flex justify-between items-center mb-4">
               <span className="text-sm font-medium text-gray-700">Acciones Rápidas</span>
             </div>
             <div className="space-y-2">
               <Button 
                fullWidth 
                variant="outline" 
                size="sm"
                onClick={handleNewGuide}
               >
                 Nueva Guía
               </Button>
               <Button 
                fullWidth 
                variant="primary" 
                icon={Plus}
                onClick={handleGenerateDocument}
                disabled={isSaving}
               >
                 {isSaving ? 'Generando...' : 'Generar Documento'}
               </Button>
             </div>
          </div>
        </div>

        {/* Right Side: Preview */}
        <div className="lg:col-span-8">
          <div className="sticky top-8">
            <GuidePreview items={items} guideNumber={nextGuideNumber} />
          </div>
        </div>

      </main>
    </div>
  );
}

export default App;
