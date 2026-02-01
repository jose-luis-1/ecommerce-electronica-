import { useState, useEffect } from "react";
import { useAdmin } from "../context/AdminContext";
import { useNavigate } from "react-router-dom";
import { supabase, type Product } from "../services/supabase";
import { Button } from "../components/common/Button";
import { Input } from "../components/common/Input";
import { Loading } from "../components/common/Loading";

export const Admin = () => {
  const { isAdmin, loading: adminLoading } = useAdmin();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image_url: "",
    stock: "",
    discount: "",
  });

  useEffect(() => {
    if (!adminLoading && !isAdmin) {
      navigate("/");
    }
  }, [isAdmin, adminLoading, navigate]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      category: "",
      image_url: "",
      stock: "",
      discount: "",
    });
    setEditingProduct(null);
    setShowForm(false);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || "",
      price: product.price.toString(),
      category: product.category,
      image_url: product.image_url || "",
      stock: product.stock.toString(),
      discount: product.discount?.toString() || "",
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const productData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        image_url: formData.image_url,
        stock: parseInt(formData.stock),
        discount: formData.discount ? parseFloat(formData.discount) : null,
      };

      if (editingProduct) {
        const { error } = await supabase
          .from("products")
          .update(productData)
          .eq("id", editingProduct.id);
        if (error) throw error;
        alert("Producto actualizado");
      } else {
        const { error } = await supabase.from("products").insert([productData]);
        if (error) throw error;
        alert("Producto agregado");
      }
      resetForm();
      fetchProducts();
    } catch (error: any) {
      alert("Error: " + error.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro?")) return;
    try {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;
      fetchProducts();
    } catch (error: any) {
      alert("Error: " + error.message);
    }
  };

  if (adminLoading || loading) return <Loading fullScreen />;
  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* ENCABEZADO CORREGIDO PARA EVITAR SOBREPOSICIÓN */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-y-6 mb-12 border-b border-slate-800 pb-8">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-white tracking-tight">
              Panel de Administración
            </h1>
            <p className="text-slate-400">
              Gestiona el inventario de la tienda
            </p>
          </div>

          <Button
            className="w-full lg:w-auto shadow-xl"
            onClick={() => (showForm ? resetForm() : setShowForm(true))}
          >
            {showForm ? "✕ Cancelar" : "+ Agregar Producto"}
          </Button>
        </div>

        {showForm && (
          <div className="bg-slate-900 rounded-xl p-6 mb-8 border border-slate-800 shadow-2xl">
            <h2 className="text-xl font-bold mb-6 text-blue-400">
              {editingProduct ? "Editar Producto" : "Crear Nuevo Producto"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Nombre del Producto"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
              <div className="flex flex-col gap-1">
                <Input
                  label="Precio"
                  type="number"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  required
                />
                <Input
                  label="Stock Disponible"
                  type="number"
                  value={formData.stock}
                  onChange={(e) =>
                    setFormData({ ...formData, stock: e.target.value })
                  }
                  required
                />
              </div>
              <Input
                label="URL de la Imagen"
                value={formData.image_url}
                onChange={(e) =>
                  setFormData({ ...formData, image_url: e.target.value })
                }
                required
              />
              <div className="flex gap-4 pt-4">
                <Button type="submit" fullWidth>
                  {editingProduct ? "Guardar Cambios" : "Confirmar Registro"}
                </Button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead className="bg-slate-800/50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
                  Imagen
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
                  Producto
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
                  Precio
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
                  Stock
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-slate-300">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {products.map((product) => (
                <tr
                  key={product.id}
                  className="hover:bg-slate-800/30 transition-colors"
                >
                  <td className="px-6 py-4">
                    <img
                      src={product.image_url}
                      alt=""
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium">{product.name}</div>
                    <div className="text-xs text-slate-500">
                      {product.category}
                    </div>
                  </td>
                  <td className="px-6 py-4 font-mono text-green-400">
                    ${Number(product.price).toLocaleString("es-CO")}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${product.stock < 5 ? "bg-red-500/20 text-red-400" : "bg-blue-500/20 text-blue-400"}`}
                    >
                      {product.stock} un.
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-4">
                      <button
                        onClick={() => handleEdit(product)}
                        className="text-blue-400 hover:text-white transition-colors"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="text-red-500 hover:text-white transition-colors"
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
