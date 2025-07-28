// Check for admin token
const token = localStorage.getItem('adminToken');
if (!token) {
  alert('Access denied. Please login as admin.');
  window.location.href = 'admin-login.html';
}

// Logout function
function logout() {
  localStorage.removeItem('adminToken');
  window.location.href = 'admin-login.html';
}

// Add token to fetch headers
const authHeader = { 
  'Content-Type': 'application/json',
  'Authorization': token 
};

const form = document.getElementById('productForm');
const productsContainer = document.getElementById('productsContainer');
let editingId = null;

// Load products on page load
window.onload = fetchProducts;

// Create or Update product
form.addEventListener('submit', async function (e) {
  e.preventDefault();

  const formData = {
    name: form.name.value,
    price: form.price.value,
    image: form.image.value,
    description: form.description.value
  };

  const url = editingId
    ? `http://localhost:5000/api/products/${editingId}`
    : 'http://localhost:5000/api/products';

  const method = editingId ? 'PUT' : 'POST';

  try {
    const res = await fetch(url, {
      method,
      headers: authHeader,
      body: JSON.stringify(formData)
    });

    const result = await res.json();

    if (!res.ok) {
      alert(result.message || 'Error occurred');
      return;
    }

    alert(result.message || (editingId ? 'Product updated!' : 'Product added!'));
    editingId = null;
    form.reset();
    fetchProducts();

  } catch (error) {
    console.error('Error:', error);
    alert('Failed to save product.');
  }
});

// Fetch and show all products
async function fetchProducts() {
  try {
    const res = await fetch('http://localhost:5000/api/products', {
      headers: authHeader
    });

    const products = await res.json();

    if (!Array.isArray(products)) {
      alert('Failed to load products.');
      return;
    }

    productsContainer.innerHTML = '';
    products.forEach(product => {
      const div = document.createElement('div');
      div.className = 'product-card';
      div.innerHTML = `
        <img src="${product.image}" alt="${product.name}" />
        <h3>${product.name}</h3>
        <p>₹${product.price}</p>
        <p>${product.description}</p>
        <button onclick="editProduct('${product._id}')">Edit</button>
        <button onclick="deleteProduct('${product._id}')">Delete</button>
      `;
      productsContainer.appendChild(div);
    });

  } catch (error) {
    console.error('Fetch error:', error);
    alert('Error fetching products.');
  }
}

// Edit product
window.editProduct = async function (id) {
  try {
    const res = await fetch(`http://localhost:5000/api/products/${id}`, {
      headers: authHeader
    });
    const product = await res.json();

    form.name.value = product.name;
    form.price.value = product.price;
    form.image.value = product.image;
    form.description.value = product.description;
    editingId = id;

  } catch (error) {
    console.error('Error editing product:', error);
    alert('Failed to load product for editing.');
  }
};

// Delete product
window.deleteProduct = async function (id) {
  if (!confirm('Are you sure you want to delete this product?')) return;

  try {
    const res = await fetch(`http://localhost:5000/api/products/${id}`, {
      method: 'DELETE',
      headers: authHeader
    });

    const result = await res.json();

    if (!res.ok) {
      alert(result.message || 'Delete failed');
      return;
    }

    alert(result.message || 'Product deleted!');
    fetchProducts();

  } catch (error) {
    console.error('Delete error:', error);
    alert('Failed to delete product.');
  }
};
