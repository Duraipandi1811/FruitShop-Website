// ----------------------
// Load Products
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('product-container')) {
    loadProducts();
  }
});

async function loadProducts() {
  try {
    const res = await fetch('http://localhost:5000/api/products');
    const products = await res.json();

    const container = document.getElementById('product-container');
    container.innerHTML = '';

    products.forEach(product => {
      let imageSrc = product.image || '';
// ✅ Correct if image is already a relative path
      if(imageSrc && !imageSrc.startsWith('http')) {
        imageSrc = imageSrc = imageSrc.startsWith('http') ? imageSrc : imageSrc;;
      }

      const card = document.createElement('div');
      card.className = 'card fade-in';
      card.innerHTML = `
        <img src="${imageSrc}" alt="${product.name}" />
        <h3>${product.name}</h3>
        <p>$${product.price} / lb</p>
        <a href="product.html?id=${product._id}" class="btn">View</a>
      `;
      container.appendChild(card);
       setTimeout(() => {
        card.classList.add('appear');}, 100);
    });
  } catch (error) {
    console.error('Error loading products:', error);
    const container = document.getElementById('product-container');
    if (container) container.innerHTML = "<p>Failed to load products.</p>";
  }
}

// ----------------------
// Cart
// ----------------------
function addToCart(productId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existing = cart.find(item => item.productId === productId);
    if (existing) {
        existing.quantity++;
    } else {
        cart.push({ productId, quantity: 1 });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    showConfirmation("Item added to cart!");
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const count = cart.reduce((acc, item) => acc + item.quantity, 0);
    const el = document.getElementById('cart-count');
    if (el) el.innerText = `(${count})`;
}

// ----------------------
// Checkout Total
// ----------------------
function calculateTotal() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    return cart.reduce((total, item) => total + (item.quantity * 5), 0);
}
// ----------------------
// Modal Confirmation
// ----------------------
// function showConfirmation(message, redirect = false) {
//     const modal = document.createElement('div');
//     modal.className = 'success-modal';
//     modal.innerHTML = `
//         <div class="modal-content">
//             <p>${message}</p>
//             <button onclick="closeModal()">OK</button>
//         </div>
//     `;
//     document.body.appendChild(modal);

//     if (redirect) {
//         setTimeout(() => {
//             closeModal();
//             window.location.href = "index.html";
//         }, 2000);
//     }
// }

function closeModal() {
    const modal = document.querySelector('.success-modal');
    if (modal) modal.remove();
}

// ----------------------
// On Load
// ----------------------
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('product-container')) loadProducts();
    if (document.getElementById('subtotal'))
    updateCartCount();
});


//Contact form submission
document.addEventListener('DOMContentLoaded', () => {
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(contactForm);
      const data = Object.fromEntries(formData.entries());

      try {
        const res = await fetch('http://localhost:5000/api/contacts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });

        if (res.ok) {
          alert('Thank you! Your message was sent.');
          contactForm.reset();
        } else {
          alert('Failed to submit, please try again.');
        }
      } catch (err) {
        console.error(err);
        alert('Error submitting form.');
      }
    });
  }
});
quantity = 1;
//add to card for cart page.//
document.addEventListener('DOMContentLoaded', () => {
  updateCartCount();
  loadProduct();
});

async function loadProduct() {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id');
  
  if (!productId) {
    document.getElementById('product-detail').innerHTML = "<p>No product found</p>.";
    return;
  }

  try {
    const res = await fetch(`http://localhost:5000/api/products/${productId}`);
    const product = await res.json();

    const detail = document.getElementById('product-detail');
    detail.innerHTML = `
      <img src="${product.image}" alt="${product.name}">
      <div>
        <h2>${product.name}</h2>
        <p>$${parseFloat(product.price).toFixed(2)} / lb</p>
        <p>${product.description}</p>

        <div style="margin: 10px 0;">
          <button onclick="changeQty(-1)">➖</button>
          <span id="qty-display" style="margin: 0 10px;">1</span>
          <button onclick="changeQty(1)">➕</button>
        </div>

        <button class="btn" onclick="addToCart('${product._id}', '${product.name}', ${parseFloat(product.price)}, '${product.image}')">Add to Cart</button>
      </div>
    `;
  } catch (err) {
    console.error('Error loading product:', err);
    document.getElementById('product-detail').innerHTML = "<p>Failed to load product.</p>";
  }
}
function changeQty(amount) {
  quantity += amount;
  if (quantity < 1) quantity = 1;
  document.getElementById('qty-display').textContent = quantity;
}

//add to cart products count 
function addToCart(id, name, price, image) {
  price = parseFloat(price); // Ensure price is a number

  let cart = JSON.parse(localStorage.getItem('cart')) || [];

  let item = cart.find(p => p.id === id);
  if (item) {
    item.qty += quantity; // Use selected quantity
  } else {
    cart.push({ id, name, price, image, qty: quantity });
  }

  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
  alert(`${quantity} x ${name} added to cart!`);

  // Reset quantity to 1
  const qtyDisplay = document.getElementById('qty-display');
  if (qtyDisplay) qtyDisplay.textContent = quantity;
}

function updateCartCount() {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  let totalItems = cart.reduce((acc, item) => acc + parseInt(item.qty), 0);
  document.querySelector('#cart-count').textContent = totalItems;
}