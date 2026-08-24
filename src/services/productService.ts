import { Product, FilterOptions } from '../types';
import { MOCK_PRODUCTS } from '../data/mockProducts';

/**
 * Product Service (Mocked layer prepared for REST/GraphQL/Supabase API integration)
 */
export const productService = {
  async getAllProducts(): Promise<Product[]> {
    // Simulate lightweight async network delay
    await new Promise(r => setTimeout(r, 80));
    return [...MOCK_PRODUCTS];
  },

  async getProductById(id: string): Promise<Product | null> {
    await new Promise(r => setTimeout(r, 60));
    const product = MOCK_PRODUCTS.find(p => p.id === id);
    return product ? { ...product } : null;
  },

  async searchProducts(query: string, category?: string, _filters?: FilterOptions): Promise<Product[]> {
    await new Promise(r => setTimeout(r, 120));
    const cleanQuery = query.toLowerCase().trim();
    
    let results = MOCK_PRODUCTS.filter(product => {
      const matchQuery = !cleanQuery || 
        product.name.toLowerCase().includes(cleanQuery) ||
        product.brand.toLowerCase().includes(cleanQuery) ||
        product.model.toLowerCase().includes(cleanQuery) ||
        product.category.toLowerCase().includes(cleanQuery);

      const matchCategory = !category || product.category.toLowerCase() === category.toLowerCase();

      return matchQuery && matchCategory;
    });

    return results;
  },

  async getFeaturedProducts(): Promise<Product[]> {
    await new Promise(r => setTimeout(r, 60));
    return MOCK_PRODUCTS.filter(p => p.isHot);
  }
};
