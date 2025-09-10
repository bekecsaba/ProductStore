// CartService.js
const API_URL = "http://localhost:8001/cart/";

// Generate session ID for cart persistence during user session
const getSessionId = () => {
  let sessionId = sessionStorage.getItem('cart_session_id');
  if (!sessionId) {
    sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    sessionStorage.setItem('cart_session_id', sessionId);
  }
  return sessionId;
};

export async function addToCart(productId, quantity = 1) {
  const sessionId = getSessionId();
  const res = await fetch(`${API_URL}add`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      product_id: productId,
      quantity: quantity,
      session_id: sessionId
    }),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.detail || "Failed to add to cart");
  }
  return res.json();
}

export async function getCart() {
  const sessionId = getSessionId();
  const res = await fetch(`${API_URL}${sessionId}`);
  if (!res.ok) throw new Error("Failed to fetch cart");
  return res.json();
}

export async function removeFromCart(productId) {
  const sessionId = getSessionId();
  const res = await fetch(`${API_URL}${sessionId}/${productId}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to remove from cart");
  return res.json();
}

export async function updateCartItem(productId, quantity) {
  const sessionId = getSessionId();
  const res = await fetch(`${API_URL}update`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      product_id: productId,
      quantity: quantity,
      session_id: sessionId
    }),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.detail || "Failed to update cart item");
  }
  return res.json();
}
