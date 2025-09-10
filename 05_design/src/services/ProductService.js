// ProductService.js
const API_URL = "http://localhost:8001/products/";

export async function fetchProducts() {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
}

export async function addProduct(product) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product),
  });
  if (!res.ok) throw new Error("Failed to add product");
  return res.json();
}

export async function deleteProduct(id) {
  const res = await fetch(`${API_URL}${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete product");
  return res.json();
}

export async function updateProduct(id, product) {
  const res = await fetch(`${API_URL}${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product),
  });
  if (!res.ok) throw new Error("Failed to update product");
  return res.json();
}

export async function canDeleteProduct(id) {
  try {
    const res = await fetch(`${API_URL}${id}/can-delete`);
    if (!res.ok) {
      const error = await res.text();
      throw new Error(`Failed to check if product can be deleted: ${res.status} - ${error}`);
    }
    return res.json();
  } catch (error) {
    console.error('Error in canDeleteProduct:', error);
    throw error;
  }
}
