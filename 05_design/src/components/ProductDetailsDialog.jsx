// ProductDetailsDialog.jsx
import React from 'react';
import Modal from './Modal.jsx';




const ProductDetailsDialog = ({ open, onClose, product }) => {
  if (!product) return null;
  return (
    <Modal open={open} onClose={onClose}>
      <div className="mb-2 flex justify-between items-center">
        <span className="block w-full text-center text-[16px] font-bold text-[#000]">Product Details</span>
      </div>
      <div className="mb-2">
        <div className="text-[15px] font-bold text-[#000] mb-1">{product.name}</div>
        <div className="text-[12px] text-[#717182] mb-4 leading-normal">{product.description}</div>
      </div>
      <div className="border-b border-gray-200 mb-4"></div>
      <div className="grid grid-cols-2 gap-4 mb-2">
        <div>
          <div className="text-[11px] text-[#717182] mb-1">Price:</div>
          <div className="text-[13px] font-semibold text-[#030213]">${product.price}</div>
        </div>
        <div>
          <div className="text-[11px] text-[#717182] mb-1">Stock:</div>
          <div className="text-[13px] font-semibold text-[#000]">{product.stock} units</div>
        </div>
      </div>
      <div className="text-[11px] text-[#717182] mt-2">Product ID:</div>
      <div className="text-[12px] text-[#000]">{product.id}</div>
    </Modal>
  );
};

export default ProductDetailsDialog;
