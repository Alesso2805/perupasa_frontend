import React from 'react';

interface GuideItem {
  code: string;
  description: string;
  color: string;
  quantity: number;
  unit: string;
  price: number;
  total: number;
}

interface GuidePreviewProps {
  items: GuideItem[];
  guideNumber?: number | null;
}

const GuidePreview: React.FC<GuidePreviewProps> = ({ items, guideNumber }) => {
  const currentDate = new Date().toLocaleDateString('es-PE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const formattedNumber = guideNumber 
    ? `001-${guideNumber.toString().padStart(6, '0')}`
    : 'Cargando...';

  const grandTotal = items.reduce((sum, item) => sum + item.total, 0);

  return (
    <div className="bg-white p-8 border border-gray-200 shadow-sm min-h-[600px] flex flex-col rounded-lg">
      {/* Header */}
      <div className="border-b-2 border-gray-900 pb-4 mb-6 flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold uppercase tracking-widest text-gray-900">
            Guía de Remisión
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            PERUPASATEX S.A.C.
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Fecha de Emisión</p>
          <p className="text-sm font-medium text-gray-900">{currentDate}</p>
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mt-2">N° Guía</p>
          <p className="text-sm font-medium text-gray-900">{formattedNumber}</p>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gray-900">
              <th className="py-2 font-semibold uppercase tracking-wider">Código</th>
              <th className="py-2 font-semibold uppercase tracking-wider">Descripción</th>
              <th className="py-2 font-semibold uppercase tracking-wider">Color</th>
              <th className="py-2 font-semibold uppercase tracking-wider text-right">Cant.</th>
              <th className="py-2 font-semibold uppercase tracking-wider text-right">Unid.</th>
              <th className="py-2 font-semibold uppercase tracking-wider text-right text-gray-400">P. Unit.</th>
              <th className="py-2 font-semibold uppercase tracking-wider text-right">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {items.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-gray-400 italic">
                  Sin artículos registrados en la guía.
                </td>
              </tr>
            ) : (
              items.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-3 text-gray-900 font-mono text-xs">{item.code}</td>
                  <td className="py-3 text-gray-700 font-medium">{item.description}</td>
                  <td className="py-3 text-gray-900">{item.color}</td>
                  <td className="py-3 text-gray-900 text-right font-medium">{item.quantity}</td>
                  <td className="py-3 text-gray-500 text-right text-xs uppercase">{item.unit}</td>
                  <td className="py-3 text-gray-400 text-right text-xs">S/ {item.price.toFixed(2)}</td>
                  <td className="py-3 text-gray-900 text-right font-bold">S/ {item.total.toFixed(2)}</td>
                </tr>
              ))
            )}
          </tbody>
          {items.length > 0 && (
            <tfoot>
              <tr className="border-t-2 border-gray-900">
                <td colSpan={6} className="py-4 text-right font-bold uppercase tracking-wider text-gray-600">
                  Total General
                </td>
                <td className="py-4 text-right font-black text-lg text-indigo-600">
                  S/ {grandTotal.toFixed(2)}
                </td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>

      {/* Footer / Signatures */}
      <div className="mt-12 pt-4 border-t-2 border-gray-900 grid grid-cols-2 gap-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-12">
            Entregado Por
          </p>
          <div className="border-t border-gray-400 w-3/4"></div>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-12">
            Recibido Conforme
          </p>
          <div className="border-t border-gray-400 w-3/4"></div>
        </div>
      </div>
      
      <div className="mt-8 text-center text-xs text-gray-400 uppercase tracking-widest">
        Documento Generado Digitalmente
      </div>
    </div>
  );
};

export default GuidePreview;
