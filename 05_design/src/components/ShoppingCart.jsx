// ShoppingCart.jsx
import React from 'react';

const ShoppingCart = ({ cart, onRemoveItem, onUpdateQuantity, isOpen, onToggle }) => {
  if (!cart) return null;

  return (
    <div className={`fixed bottom-4 left-4 bg-white rounded-lg shadow-xl border border-gray-200 transition-all duration-300 ${
      isOpen ? 'w-80 h-96' : 'w-16 h-16'
    }`}>
      {/* Cart toggle button */}
      <button
        onClick={onToggle}
        className="absolute top-2 left-2 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-blue-700 transition-colors"
      >
        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17M17 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6"/>
        </svg>
        {cart.total_items > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
            {cart.total_items}
          </span>
        )}
      </button>

      {/* Cart content - only visible when open */}
      {isOpen && (
        <div className="p-4 pt-16 h-full flex flex-col">
          <h3 className="text-lg font-semibold mb-3 text-gray-800">Shopping Cart</h3>

          {cart.items.length === 0 ? (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <svg className="mx-auto mb-2" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24">
                  <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17M17 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6"/>
                </svg>
                <p>Your cart is empty</p>
              </div>
            </div>
          ) : (
            <>
              {/* Cart items */}
              <div className="flex-1 overflow-y-auto mb-4 space-y-2">
                {cart.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {item.product.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        ${item.product.price.toFixed(2)} each
                      </p>
                    </div>
                    <div className="flex items-center space-x-2 ml-2">
                      <div className="flex items-center">
                        <button
                          onClick={() => onUpdateQuantity(item.product_id, Math.max(1, item.quantity - 1))}
                          className="w-6 h-6 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-sm"
                        >
                          -
                        </button>
                        <span className="mx-2 text-sm font-medium w-6 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.product_id, item.quantity + 1)}
                          className="w-6 h-6 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-sm"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => onRemoveItem(item.product_id)}
                        className="w-6 h-6 rounded-full bg-red-100 hover:bg-red-200 flex items-center justify-center text-red-600"
                      >
                        <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <line x1="18" y1="6" x2="6" y2="18"/>
                          <line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Cart summary */}
              <div className="border-t pt-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Total Items:</span>
                  <span className="text-sm">{cart.total_items}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">Total:</span>
                  <span className="text-lg font-semibold text-blue-600">
                    ${cart.total_price.toFixed(2)}
                  </span>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ShoppingCart;
