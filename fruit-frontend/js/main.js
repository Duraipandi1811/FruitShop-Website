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

      if (imageSrc && !imageSrc.startsWith('http')) {
        imageSrc = `http://localhost:5000${imageSrc}`;
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

function displayCheckoutSummary() {
    const total = calculateTotal();
    const tax = (total * 0.1).toFixed(2);
    const shipping = 5;
    const grandTotal = (parseFloat(total) + parseFloat(tax) + shipping).toFixed(2);

    if (document.getElementById('subtotal')) {
        document.getElementById('subtotal').innerText = `$${total.toFixed(2)}`;
        document.getElementById('tax').innerText = `$${tax}`;
        document.getElementById('shipping').innerText = `$${shipping.toFixed(2)}`;
        document.getElementById('total').innerText = `$${grandTotal}`;
    }
}

// ----------------------
// Place Order
// ----------------------
async function placeOrder() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const customerName = document.getElementById('name').value;
    const email = document.getElementById('email').value;

    const order = {
        customerName,
        email,
        cartItems: cart.map(item => ({ productId: item.productId, quantity: item.quantity })),
        totalAmount: calculateTotal()
    };

    try {
        const res = await fetch('http://localhost:5000/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(order)
        });
        if (res.ok) {
            localStorage.removeItem('cart');
            showConfirmation("Order placed successfully!", true);
        } else {
            const data = await res.json();
            alert(`Order failed: ${data.message}`);
        }
    } catch (err) {
        console.error('Error placing order:', err);
    }
}

// ----------------------
// Modal Confirmation
// ----------------------
function showConfirmation(message, redirect = false) {
    const modal = document.createElement('div');
    modal.className = 'success-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <p>${message}</p>
            <button onclick="closeModal()">OK</button>
        </div>
    `;
    document.body.appendChild(modal);

    if (redirect) {
        setTimeout(() => {
            closeModal();
            window.location.href = "index.html";
        }, 2000);
    }
}

function closeModal() {
    const modal = document.querySelector('.success-modal');
    if (modal) modal.remove();
}

// ----------------------
// On Load
// ----------------------
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('product-container')) loadProducts();
    if (document.getElementById('subtotal')) displayCheckoutSummary();
    updateCartCount();
});


//Contact form....
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

