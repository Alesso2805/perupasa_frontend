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
      <div className="flex-1 w-full">
        <table className="w-full text-center text-xs sm:text-sm">
          <thead>
            <tr className="border-b border-gray-900 whitespace-nowrap">
              <th className="py-2 px-2 font-semibold uppercase tracking-wider text-center">Código</th>
              <th className="py-2 px-2 font-semibold uppercase tracking-wider text-center">Descripción</th>
              <th className="py-2 px-2 font-semibold uppercase tracking-wider text-center">Color</th>
              <th className="py-2 px-2 font-semibold uppercase tracking-wider text-center">Cant.</th>
              <th className="py-2 px-2 font-semibold uppercase tracking-wider text-center">Unid.</th>
              <th className="py-2 px-2 font-semibold uppercase tracking-wider text-center text-gray-400">P. Unit.</th>
              <th className="py-2 px-2 font-semibold uppercase tracking-wider text-center">Total</th>
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
                <tr key={index} className="hover:bg-gray-50/50 transition-colors whitespace-nowrap">
                  <td className="py-3 px-2 text-gray-900 font-mono text-[11px] sm:text-xs text-center">{item.code}</td>
                  <td className="py-3 px-2 text-gray-700 font-medium text-[11px] sm:text-xs text-center">{item.description}</td>
                  <td className="py-3 px-2 text-gray-900 text-center">{item.color}</td>
                  <td className="py-3 px-2 text-gray-900 text-center font-medium">{item.quantity}</td>
                  <td className="py-3 px-2 text-gray-500 text-center uppercase">{item.unit}</td>
                  <td className="py-3 px-2 text-gray-400 text-center">S/ {item.price.toFixed(2)}</td>
                  <td className="py-3 px-2 text-gray-900 text-center font-bold">S/ {item.total.toFixed(2)}</td>
                </tr>
              ))
            )}
          </tbody>
          {items.length > 0 && (
            <tfoot>
              <tr className="border-t-2 border-gray-900 whitespace-nowrap">
                <td colSpan={6} className="py-4 px-2 text-right font-bold uppercase tracking-wider text-gray-600">
                  Total General
                </td>
                <td className="py-4 px-2 text-center font-black text-base sm:text-lg text-indigo-600">
                  S/ {grandTotal.toFixed(2)}
                </td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>


      
      <div className="mt-8 text-center text-xs text-gray-400 uppercase tracking-widest">
        Documento Generado Digitalmente
      </div>
    </div>
  );
};

export default GuidePreview;
