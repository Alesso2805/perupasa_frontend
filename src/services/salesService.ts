import { apiClient } from './apiClient';

export interface CreateSaleDto {
  cliente_nombre: string;
  es_copasa: boolean;
  items: {
    productoId: number;
    cantidad: number;
    unidad?: string;
    colores: { colorId: number; cantidad: number }[];
  }[];
}

export interface Sale {
  id: number;
  numero_guia: string;
  fecha: string;
  cliente: string;
}

export const salesService = {
  getSales: () => apiClient<Sale[]>('/sales'),
  getNextNumber: () => apiClient<number>('/sales/next-number'),
  createSale: (data: CreateSaleDto) => apiClient<Sale>('/sales', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  deleteSale: (id: number) => apiClient<{ message: string }>(`/sales/${id}`, {
    method: 'DELETE',
  }),
  getSalePdfBlob: (id: number) => apiClient<Blob>(`/sales/${id}/pdf`),
};
