

import { useState, useEffect } from 'react';
import ProductList from './components/ProductList.jsx';
import ProductForm from './components/ProductForm.jsx';
import Modal from './components/Modal.jsx';
import ProductDetailsDialog from './components/ProductDetailsDialog.jsx';
import EditProductDialog from './components/EditProductDialog.jsx';
import DeleteProductDialog from './components/DeleteProductDialog.jsx';
import { fetchProducts, addProduct, updateProduct, deleteProduct } from './services/ProductService.js';


function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [showView, setShowView] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchProducts()
      .then(setProducts)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  const handleAddProduct = async (product) => {
    try {
      const newProduct = await addProduct(product);
      setProducts([...products, newProduct]);
      setShowAdd(false);
    } catch (err) {
      setError(err.message);
    }
  };

  // Handlers for dialogs
  const handleView = (product) => {
    setSelectedProduct(product);
    setShowView(true);
  };
  const handleEdit = (product) => {
    // Defensive copy to avoid stale state in dialog
    setSelectedProduct({ ...product });
    setShowEdit(true);
  };
  const handleDelete = (product) => {
    setSelectedProduct(product);
    setShowDelete(true);
  };
  const handleEditProduct = async (updatedProduct) => {
    try {
      const result = await updateProduct(updatedProduct.id, updatedProduct);
      setProducts(products.map(p => p.id === result.id ? result : p));
      setShowEdit(false);
    } catch (err) {
      setError(err.message);
    }
  };
  const handleDeleteProduct = async (product) => {
    try {
      await deleteProduct(product.id);
      setProducts(products.filter(p => p.id !== product.id));
      setShowDelete(false);
    } catch (err) {
      setError(err.message);
    }
  };

  // Filter products by search
  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    (p.description && p.description.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-[#F3F3F5] py-10 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-[1.2rem] font-normal text-[#0A0A0A] mb-2">Product Management</h1>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative w-full md:w-1/2">
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full bg-[#F3F3F5] border border-gray-200 rounded-lg py-2 px-4 text-sm text-[#0A0A0A] focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <span className="absolute right-3 top-2 text-gray-400">
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              </span>
            </div>
            <button
              className="inline-flex items-center bg-[#030213] text-white rounded-lg px-6 py-2 text-sm font-medium shadow hover:bg-[#23234a] transition"
              onClick={() => setShowAdd(true)}
            >
              Add Product
              <svg className="ml-2" width="16" height="16" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            </button>
          </div>
        </div>
        {error && <div className="bg-red-100 text-red-700 p-2 mb-4 rounded">{typeof error === 'string' ? error : error?.message}</div>}
        <Modal open={showAdd} onClose={() => setShowAdd(false)}>
          <h2 className="text-lg font-semibold mb-4 text-[#000]">Add New Product</h2>
          <ProductForm onAdd={handleAddProduct} />
        </Modal>
        <ProductDetailsDialog open={showView} onClose={() => setShowView(false)} product={selectedProduct} />
        <EditProductDialog open={showEdit} onClose={() => setShowEdit(false)} product={selectedProduct} onEdit={handleEditProduct} />
        <DeleteProductDialog open={showDelete} onClose={() => setShowDelete(false)} product={selectedProduct} onDelete={handleDeleteProduct} />
        {loading ? (
          <div className="text-center text-gray-500">Loading...</div>
        ) : (
          <ProductList products={filteredProducts} onView={handleView} onEdit={handleEdit} onDelete={handleDelete} />
        )}
      </div>
    </div>
  );
}

export default App;
