// DeleteProductDialog.jsx
import React from 'react';
import Modal from './Modal.jsx';

const DeleteProductDialog = ({ open, onClose, product, onDelete }) => {
  if (!product) return null;
  return (
    <Modal open={open} onClose={onClose}>
      <h2 className="text-lg font-semibold mb-2 text-[#000]">Delete Product</h2>
      <p className="mb-4 text-sm text-[#717182]">Are you sure you want to delete "{product.name}"? This action cannot be undone.</p>
      <div className="flex gap-4 justify-end">
        <button
          className="bg-gray-100 text-[#000] py-2 px-6 rounded-[6.75px] font-medium text-sm hover:bg-gray-200 transition"
          onClick={onClose}
        >Cancel</button>
        <button
          className="bg-[#D4183D] text-white py-2 px-6 rounded-[6.75px] font-medium text-sm hover:bg-red-700 transition"
          onClick={() => { onDelete(product); onClose(); }}
        >Delete Product</button>
      </div>
    </Modal>
  );
};

export default DeleteProductDialog;
