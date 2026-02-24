import { apiClient } from './apiClient';

export interface CreateSaleDto {
  cliente: string;
  items: {
    productoId: number;
    colorId: number;
    cantidad: number;
    precioUnitario: number;
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
  getSalePdfUrl: (id: number) => `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/sales/${id}/pdf`,
};
