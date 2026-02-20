import { useState, useEffect } from "react";
import { useAdmin } from "../context/AdminContext";
import { useSearch } from "../context/SearchContext";
import { useNavigate } from "react-router-dom";
import { supabase, type Product } from "../services/supabase";
import { Button } from "../components/common/Button";
import { Input } from "../components/common/Input";
import { Loading } from "../components/common/Loading";

export const Admin = () => {
  const { isAdmin, loading: adminLoading } = useAdmin();
  const { searchTerm } = useSearch();
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
    image_file: null as File | null,
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
      image_file: null,
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
      image_file: null,
      stock: product.stock.toString(),
      discount: product.discount?.toString() || "",
    });
    setShowForm(true);
    // Scroll automático hacia arriba para mostrar el formulario
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let imageUrl = formData.image_url; // ⬅️ DECLARAR AQUÍ AL INICIO

      // Subir imagen si hay un archivo seleccionado
      if (formData.image_file) {
        const fileExt = formData.image_file.name.split(".").pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("products")
          .upload(filePath, formData.image_file);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
          .from("products")
          .getPublicUrl(filePath);

        imageUrl = data.publicUrl;
      }

      const productData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        image_url: imageUrl, // ⬅️ Ahora sí está definida
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
    const product = products.find((p) => p.id === id);
    const isDeleted = product?.is_deleted || false;
    const action = isDeleted ? "recuperar" : "eliminar";

    if (!confirm(`¿Estás seguro de ${action} este producto?`)) return;
    try {
      const { error } = await supabase
        .from("products")
        .update({ is_deleted: !isDeleted })
        .eq("id", id);
      if (error) throw error;
      alert(`Producto ${action}do correctamente`);
      fetchProducts();
    } catch (error: any) {
      alert("Error: " + error.message);
    }
  };

  if (adminLoading || loading) return <Loading fullScreen />;
  if (!isAdmin) return null;

  return (
    <div className=" border-slate-700 text-white hover:bg-slate-800 ">
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
              <div className="w-full">
                <label className="block text-sm font-medium text-slate-300 mb-1 italic">Categoría</label>
                <select
                  className="w-full px-4 py-2 bg-white text-slate-900 border border-slate-700 rounded-lg outline-none transition-all focus:ring-2 focus:ring-blue-500"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  required
                >
                  <option value="">Selecciona una categoría</option>
                  <option value="Todos">Todos</option>
                  <option value="Teléfonos">Teléfonos</option>
                  <option value="Audífonos">Audífonos</option>
                  <option value="Relojes Inteligentes">
                    Relojes Inteligentes
                  </option>
                  <option value="Tablets">Tablets</option>
                  <option value="Monitores">Monitores</option>
                  <option value="Accesorios">Accesorios</option>
                  <option value="Portátiles">Portátiles</option>
                </select>
              </div>
              <Input
                label="Descripción"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                required
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Descuento (%)"
                  type="number"
                  value={formData.discount}
                  onChange={(e) =>
                    setFormData({ ...formData, discount: e.target.value })
                  }
                  step="0.01"
                  min="0"
                  max="100"
                />
              </div>
              <div className="space-y-2">
                <Input
                  type="file"
                  label="Imagen del Producto"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const imageUrl = URL.createObjectURL(file);
                      setFormData({
                        ...formData,
                        image_url: imageUrl,
                        image_file: file,
                      });
                    }
                  }}
                  required={!editingProduct} // Solo requerido al crear
                />
                {formData.image_url && (
                  <img
                    src={formData.image_url}
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded-lg border border-slate-700"
                  />
                )}
              </div>
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
              {products
                .filter((product) =>
                  product.name.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((product) => (
                <tr
                  key={product.id}
                  className={`hover:bg-slate-800/30 transition-colors ${
                    product.is_deleted ? "opacity-50 bg-red-500/10" : ""
                  }`}
                >
                  <td className="px-6 py-4">
                    <div className="relative">
                      <img
                        src={product.image_url}
                        alt=""
                        className={`w-12 h-12 object-cover rounded-lg ${
                          product.is_deleted ? "opacity-50" : ""
                        }`}
                      />
                      {product.is_deleted && (
                        <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-red-400">
                          X
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className={`font-medium ${product.is_deleted ? "text-slate-500" : ""}`}>
                      {product.name}
                      {product.is_deleted && (
                        <span className="ml-2 text-xs bg-red-500/30 text-red-400 px-2 py-1 rounded">
                          Eliminado
                        </span>
                      )}
                    </div>
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
                        className={`transition-colors ${
                          product.is_deleted
                            ? "text-green-500 hover:text-white"
                            : "text-red-500 hover:text-white"
                        }`}
                      >
                        {product.is_deleted ? "Recuperar" : "Eliminar"}
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
