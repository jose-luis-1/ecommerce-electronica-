import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = ({ label, error, className = '', ...props }: InputProps) => {
  return (
    <div className="w-full">
      {label && (
        // Cambiado a text-slate-300 para que resalte sobre el fondo oscuro del Admin
        <label className="block text-sm font-medium text-slate-300 mb-1 italic">
          {label}
        </label>
      )}
      <input
        // Estilos adaptados para tema oscuro
        className={`w-full px-4 py-2 bg-white text-slate-900 border rounded-lg outline-none transition-all
          ${error ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-700 focus:ring-2 focus:ring-blue-500'} 
          ${className}`}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-500 font-semibold">{error}</p>
      )}
    </div>
  );
};