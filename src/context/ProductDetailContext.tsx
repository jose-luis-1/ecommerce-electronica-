import { createContext, useContext, useState, type ReactNode } from 'react';
import type { Product } from '../services/supabase';

interface ProductDetailContextType {
  selectedProduct: Product | null;
  isOpen: boolean;
  openModal: (product: Product) => void;
  openProduct: (product: Product) => void; // ✅ alias para compatibilidad con el Modal
  closeModal: () => void;
}

const ProductDetailContext = createContext<ProductDetailContextType | undefined>(undefined);

export const ProductDetailProvider = ({ children }: { children: ReactNode }) => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const openModal = (product: Product) => {
    console.log('🚀 openModal activado para:', product.name);
    setSelectedProduct(product);
    setIsOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setIsOpen(false);
    setSelectedProduct(null);
    document.body.style.overflow = 'unset';
  };

  return (
    <ProductDetailContext.Provider value={{
      selectedProduct,
      isOpen,
      openModal,
      openProduct: openModal, // ✅ mismo función, dos nombres
      closeModal,
    }}>
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