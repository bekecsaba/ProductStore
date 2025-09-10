// ProductList.jsx
import React from 'react';



const ProductList = ({ products, onView, onEdit, onDelete, onAddToCart, productsCanDelete = {} }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
    {products.map(product => (
      <div key={product.id} className="bg-white rounded-[12.75px] shadow-lg border border-[rgba(0,0,0,0.1)] p-6 flex flex-col">
        <h4 className="text-[13.2px] font-normal text-[#0A0A0A] leading-none mb-2">{product.name}</h4>
        <div className="text-[11.3px] text-[#717182] mb-2">
          {product.description}
        </div>
        <div className="flex items-center justify-between mb-4">
          <span className="text-[11.3px] text-[#717182]">Stock: {product.stock}</span>
          <span className="text-[12.8px] font-medium text-[#030213]">${product.price}</span>
        </div>
        <div className="flex gap-2 mt-auto">
          <button
            className="inline-flex items-center bg-white border border-[rgba(0,0,0,0.1)] text-[#0A0A0A] rounded-[6.75px] px-4 py-1 text-xs font-medium shadow hover:bg-gray-100 transition"
            onClick={() => onView(product)}
          >
            <svg className="mr-1" width="14" height="14" fill="none" stroke="#0A0A0A" strokeWidth="1.2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="7"/><circle cx="12" cy="12" r="3"/></svg>
            View
          </button>
          <button
            className="inline-flex items-center bg-white border border-[rgba(0,0,0,0.1)] text-[#0A0A0A] rounded-[6.75px] px-4 py-1 text-xs font-medium shadow hover:bg-gray-100 transition"
            onClick={() => onEdit(product)}
          >
            <svg className="mr-1" width="14" height="14" fill="none" stroke="#0A0A0A" strokeWidth="1.2" viewBox="0 0 24 24"><path d="M4 20h4l10-10-4-4L4 16v4z"/></svg>
            Edit
          </button>
          <button
            className={`inline-flex items-center rounded-[6.75px] px-4 py-1 text-xs font-medium shadow transition ${
              productsCanDelete[product.id] === false
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-[#D4183D] text-white hover:bg-red-700'
            }`}
            onClick={() => {
              if (productsCanDelete[product.id] !== false) {
                onDelete(product);
              }
            }}
            disabled={productsCanDelete[product.id] === false}
            title={productsCanDelete[product.id] === false ? 'Cannot delete - product is in shopping cart' : 'Delete product'}
          >
            <svg className="mr-1" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.2" viewBox="0 0 24 24"><line x1="6" y1="6" x2="18" y2="18"/><line x1="6" y1="18" x2="18" y2="6"/></svg>
            Delete
          </button>
          {/* Add to Cart button */}
          <button
            className={`inline-flex items-center rounded-[6.75px] px-4 py-1 text-xs font-medium shadow transition ${
              product.stock > 0
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            onClick={() => product.stock > 0 && onAddToCart(product)}
            disabled={product.stock === 0}
            title={product.stock === 0 ? 'Out of stock' : 'Add to cart'}
          >
            <svg className="mr-1" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.2" viewBox="0 0 24 24">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Add to Cart
          </button>
        </div>
      </div>
    ))}
  </div>
);

export default ProductList;
