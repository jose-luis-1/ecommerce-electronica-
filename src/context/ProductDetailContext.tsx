import { createContext, useContext, useState, type ReactNode } from 'react';
import type { Product } from '../services/supabase';

interface ProductDetailContextType {
  selectedProduct: Product | null;
  isOpen: boolean;
  openModal: (product: Product) => void;
  closeModal: () => void;
}

const ProductDetailContext = createContext<ProductDetailContextType | undefined>(undefined);

export const ProductDetailProvider = ({ children }: { children: ReactNode }) => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const openModal = (product: Product) => {
    // Log para verificar en consola que el click funciona y trae los datos
    console.log('🚀 openModal activado para:', product.name);
    setSelectedProduct(product); 
    setIsOpen(true);
    // Evitamos el scroll del fondo al abrir el modal
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setIsOpen(false);
    setSelectedProduct(null);
    // Restauramos el scroll al cerrar
    document.body.style.overflow = 'unset';
  };

  return (
    <ProductDetailContext.Provider value={{ selectedProduct, isOpen, openModal, closeModal }}>
      {children}
    </ProductDetailContext.Provider>
  );
};

export const useProductDetail = () => {
  const context = useContext(ProductDetailContext);
  if (!context) {
    throw new Error('useProductDetail debe ser usado dentro de ProductDetailProvider');
  }
  return context;
};