import React from 'react';

interface GuideItem {
  code: string;
  description: string;
  color: string;
  quantity: number;
}

interface GuidePreviewProps {
  items: GuideItem[];
}

const GuidePreview: React.FC<GuidePreviewProps> = ({ items }) => {
  const currentDate = new Date().toLocaleDateString('es-PE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="bg-white p-8 border border-gray-200 shadow-sm min-h-[600px] flex flex-col">
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
          <p className="text-sm font-medium text-gray-900">001-004392</p>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gray-900">
              <th className="py-2 font-semibold uppercase tracking-wider w-24">Código</th>
              <th className="py-2 font-semibold uppercase tracking-wider">Descripción</th>
              <th className="py-2 font-semibold uppercase tracking-wider w-24">Color</th>
              <th className="py-2 font-semibold uppercase tracking-wider w-16 text-right">Cant.</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {items.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-8 text-center text-gray-400 italic">
                  Sin artículos registrados.
                </td>
              </tr>
            ) : (
              items.map((item, index) => (
                <tr key={index}>
                  <td className="py-3 text-gray-900 font-mono">{item.code}</td>
                  <td className="py-3 text-gray-700">{item.description}</td>
                  <td className="py-3 text-gray-900">{item.color}</td>
                  <td className="py-3 text-gray-900 text-right">{item.quantity}</td>
                </tr>
              ))
            )}
          </tbody>
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
