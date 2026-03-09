import { useState, useEffect } from 'react';
import { X, Trash2, FileText, Download, Calendar, User, Hash } from 'lucide-react';
import { salesService, type Sale } from '../services/salesService';
import Button from './ui/Button';

interface GuideHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GuideHistoryModal({ isOpen, onClose }: GuideHistoryModalProps) {
  const [sales, setSales] = useState<Sale[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadSales();
    }
  }, [isOpen]);

  const loadSales = async () => {
    setIsLoading(true);
    try {
      const data = await salesService.getSales();
      // Asegurarse de que están ordenados por ID de menor a mayor (ascendente)
      const sortedData = [...data].sort((a, b) => a.id - b.id);
      setSales(sortedData);
    } catch (error) {
      console.error('Error al cargar ventas:', error);
      alert('No se pudieron cargar las guías generadas.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number, numero_guia: string) => {
    if (!confirm(`¿Estás completamente seguro de que deseas eliminar la guía ${numero_guia}? Esta acción no se puede deshacer.`)) {
      return;
    }

    setIsDeleting(id);
    try {
      await salesService.deleteSale(id);
      // Recargar la lista
      await loadSales(); 
    } catch (error) {
      console.error('Error al eliminar:', error);
      alert(`Hubo un error al intentar eliminar la guía ${numero_guia}.`);
    } finally {
      setIsDeleting(null);
    }
  };

  const handleOpenPdf = async (id: number) => {
    try {
      const blob = await salesService.getSalePdfBlob(id);
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
      setTimeout(() => URL.revokeObjectURL(url), 10000);
    } catch (error) {
      console.error('Error al generar PDF:', error);
      alert('Error al descargar el PDF de la guía.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4 sm:p-6 transition-all">
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200"
      >
        <div className="flex items-center justify-between p-6 bg-gradient-to-r from-indigo-50 to-white border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Guías Generadas
              </h2>
              <p className="text-sm text-gray-500">
                Historial de todos los documentos emitidos
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 bg-gray-50/50">
          {isLoading ? (
            <div className="flex flex-col justify-center items-center h-48 space-y-4">
              <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
              <span className="text-sm font-medium text-gray-500">Cargando historial de guías...</span>
            </div>
          ) : sales.length === 0 ? (
            <div className="flex flex-col justify-center items-center h-64 text-gray-500 gap-4 bg-white rounded-xl border border-dashed border-gray-300">
              <div className="p-4 bg-gray-50 rounded-full">
                <FileText className="w-8 h-8 text-gray-400" />
              </div>
              <div className="text-center">
                <p className="font-medium text-gray-900">No hay guías registradas</p>
                <p className="text-sm text-gray-500 mt-1">Las guías que generes aparecerán aquí.</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sales.map((sale) => (
                <div 
                  key={sale.id} 
                  className="group bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all p-5 flex flex-col gap-4 relative overflow-hidden"
                >
                  {/* Decorative sidebar color */}
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500 rounded-l-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                       <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-md flex items-center gap-1">
                         <Hash className="w-3 h-3" />
                         {sale.numero_guia}
                       </span>
                    </div>
                    <span className="text-xs font-medium text-gray-400 bg-gray-100 px-2 py-1 rounded-md">
                      ID: {sale.id}
                    </span>
                  </div>

                  <div className="space-y-3 flex-1 text-sm mt-2">
                    <div className="flex items-start gap-3 text-gray-600">
                      <User className="w-4 h-4 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-0.5">Cliente</p>
                        <p className="font-semibold text-gray-900 line-clamp-1" title={sale.cliente}>
                          {sale.cliente || 'Sin nombre'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 text-gray-600">
                      <Calendar className="w-4 h-4 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-0.5">Fecha de Emisión</p>
                        <p className="text-gray-700">
                          {new Date(sale.fecha).toLocaleDateString('es-PE', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 mt-2 border-t border-gray-100 flex gap-2 w-full justify-between">
                    <Button
                      variant="outline"
                      size="sm"
                      icon={Download}
                      onClick={() => handleOpenPdf(sale.id)}
                      className="flex-1 bg-white hover:bg-indigo-50 hover:text-indigo-700 border-gray-200 hover:border-indigo-200"
                    >
                      PDF
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      icon={Trash2}
                      onClick={() => handleDelete(sale.id, sale.numero_guia)}
                      disabled={isDeleting === sale.id}
                      className="flex-none px-3 text-red-600 hover:text-red-700 hover:bg-red-50 border-gray-200 hover:border-red-200"
                      title="Eliminar Guía"
                    >
                      {isDeleting === sale.id ? '...' : ''}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
