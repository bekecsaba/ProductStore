// ProductForm.jsx
import React, { useState } from 'react';

const ProductForm = ({ onAdd }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !description || !price || !stock) return;
    onAdd({ name, description, price: parseFloat(price), stock: parseInt(stock, 10) });
    setName('');
    setDescription('');
    setPrice('');
    setStock('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-[#000]">Product Name</label>
        <input
          type="text"
          placeholder="Enter product name"
          value={name}
          onChange={e => setName(e.target.value)}
          className="border border-gray-200 bg-[#F3F3F5] rounded-[6.75px] p-3 text-sm text-[#000] focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-[#000]">Description</label>
        <input
          type="text"
          placeholder="Enter product description"
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
            placeholder="0.00"
            value={price}
            onChange={e => setPrice(e.target.value)}
            className="border border-gray-200 bg-[#F3F3F5] rounded-[6.75px] p-3 text-sm text-[#000] focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-[#000]">Stock</label>
          <input
            type="number"
            placeholder="0"
            value={stock}
            onChange={e => setStock(e.target.value)}
            className="border border-gray-200 bg-[#F3F3F5] rounded-[6.75px] p-3 text-sm text-[#000] focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
      </div>
      <button type="submit" className="bg-[#030213] text-white py-3 px-6 rounded-[6.75px] font-medium text-sm hover:bg-[#23234a] transition">Add Product</button>
    </form>
  );
};

export default ProductForm;
