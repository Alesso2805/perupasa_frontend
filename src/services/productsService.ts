export interface Product {
  id: number;
  codigo_articulo: string;
  nombre: string;
  categoria: string;
  precios?: Price[];
}

export interface Price {
  id: number;
  tipo_lista: string;
  valor_soles: number;
}

export interface Color {
  id: number;
  numero_color: number;
  nombre?: string;
}

import { apiClient } from './apiClient';

export const productsService = {
  getProducts: () => apiClient<Product[]>('/products'),
  getColors: () => apiClient<Color[]>('/products/colors'),
};
