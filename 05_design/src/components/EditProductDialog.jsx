// EditProductDialog.jsx
import React, { useState, useEffect } from 'react';
import Modal from './Modal.jsx';

const EditProductDialog = ({ open, onClose, product, onEdit }) => {
  const [name, setName] = useState(product?.name || '');
  const [description, setDescription] = useState(product?.description || '');
  const [price, setPrice] = useState(product?.price || '');
  const [stock, setStock] = useState(product?.stock || '');

  useEffect(() => {
    setName(product?.name || '');
    setDescription(product?.description || '');
    setPrice(product?.price || '');
    setStock(product?.stock || '');
  }, [product]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !description || !price || !stock) return;
    onEdit({ ...product, name, description, price: parseFloat(price), stock: parseInt(stock, 10) });
    onClose();
  };

  if (!product) return null;
  return (
    <Modal open={open} onClose={onClose}>
      <h2 className="text-lg font-semibold mb-2 text-[#000]">Edit Product</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-[#000]">Product Name</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            className="border border-gray-200 bg-[#F3F3F5] rounded-[6.75px] p-3 text-sm text-[#000] focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-[#000]">Description</label>
          <input
            type="text"
            value={description}
            onChange={e => setDescription(e.target.value)}
            className="border border-gray-200 bg-[#F3F3F5] rounded-[6.75px] p-3 text-sm text-[#000] focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-[#000]">Price ($)</label>
            <input
              type="number"
              value={price}
              onChange={e => setPrice(e.target.value)}
              className="border border-gray-200 bg-[#F3F3F5] rounded-[6.75px] p-3 text-sm text-[#000] focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-[#000]">Stock</label>
            <input
              type="number"
              value={stock}
              onChange={e => setStock(e.target.value)}
              className="border border-gray-200 bg-[#F3F3F5] rounded-[6.75px] p-3 text-sm text-[#000] focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
        </div>
        <button type="submit" className="bg-[#030213] text-white py-3 px-6 rounded-[6.75px] font-medium text-sm hover:bg-[#23234a] transition">Update Product</button>
      </form>
    </Modal>
  );
};

export default EditProductDialog;
