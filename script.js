// Products data
const products = [
  {
    id: '1',
    name: 'Hunting Knife',
    price: 49.99,
    image: 'images/hunting_knife.jpg',
    description: 'Reliable and sharp hunting knife built for tough conditions.'
  },
  {
    id: '2',
    name: 'Chef Knife',
    price: 59.99,
    image: 'images/chef_knife.jpg',
    description: 'High-quality stainless steel chef knife for all your cooking needs.'
  },
  {
    id: '3',
    name: 'Pocket Knife',
    price: 29.99,
    image: 'images/pocket_knife.jpg',
    description: 'Compact and foldable pocket knife for everyday carry.'
  },
  {
    id: '4',
    name: 'Butterfly Knife',
    price: 39.99,
    image: 'images/butterfly_knife.jpg',
    description: 'Stylish butterfly knife with smooth flipping action.'
  }
];

// DOM Elements
const productsContainer = document.getElementById('products-container');
const searchBar = document.getElementById('search-bar');
const cartCountElem = document.getElementById('cart-count');
const cartModal = document.getElementById('cart-modal');
const closeModalBtn = document.getElementById('close-modal');
const cartItemsContainer = document.getElementById('cart-items-container');
const cartTotalElem = document.getElementById('cart-total');
const checkoutBtn = document.getElementById('checkout-btn');
const continueShoppingBtn = document.getElementById('continue-shopping-btn');
const cartIcon = document.querySelector('.cart-icon');

// Load cart from localStorage or initialize empty
let cart = JSON.parse(localStorage.getItem('knifeXpertCart')) || {};

// Render products on page with optional filter
function renderProducts(filter = '') {
  productsContainer.innerHTML = '';
  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(filter.toLowerCase())
  );

  if (filtered.length === 0) {
    productsContainer.innerHTML = '<p>No products found.</p>';
    return;
  }

  filtered.forEach(product => {
    const div = document.createElement('div');
    div.className = 'product-card';
    div.dataset.id = product.id;
    div.innerHTML = `
      <img src="${product.image}" alt="${product.name}" />
      <h3>${product.name}</h3>
      <p>${product.description}</p>
      <button class="buy-now-btn btn">Buy Now - $${product.price.toFixed(2)}</button>
    `;
    div.querySelector('.buy-now-btn').addEventListener('click', () => addToCart(product));
    productsContainer.appendChild(div);
  });
}

// Save cart to localStorage
function saveCart() {
  localStorage.setItem('knifeXpertCart', JSON.stringify(cart));
}

// Total items in cart
function getTotalQuantity() {
  return Object.values(cart).reduce((sum, item) => sum + item.qty, 0);
}

// Update cart count badge
function updateCartCount() {
  cartCountElem.textContent = getTotalQuantity();
}

// Render cart modal
function renderCart() {
  cartItemsContainer.innerHTML = '';
  const items = Object.values(cart);

  if (items.length === 0) {
    cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
    cartTotalElem.textContent = '';
    checkoutBtn.style.display = 'none';
    return;
  }

  checkoutBtn.style.display = 'inline-block';

  let totalPrice = 0;
  items.forEach(item => {
    totalPrice += item.price * item.qty;

    const itemDiv = document.createElement('div');
    itemDiv.className = 'cart-item';
    itemDiv.innerHTML = `
      <div><strong>${item.name}</strong> (x${item.qty})</div>
      <div>
        $${(item.price * item.qty).toFixed(2)}
        <button class="remove-btn" data-id="${item.id}">Remove</button>
      </div>
    `;
    cartItemsContainer.appendChild(itemDiv);
  });

  cartTotalElem.textContent = `Total: $${totalPrice.toFixed(2)}`;

  // Remove item from cart
  cartItemsContainer.querySelectorAll('.remove-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      const id = e.target.getAttribute('data-id');
      delete cart[id];
      saveCart();
      updateCartCount();
      renderCart();
    });
  });
}

// Add product to cart
function addToCart(product) {
  if (cart[product.id]) {
    cart[product.id].qty += 1;
  } else {
    cart[product.id] = { ...product, qty: 1 };
  }
  saveCart();
  updateCartCount();
  alert(`${product.name} added to cart!`);
}

// Modal Controls
function openCart() {
  renderCart();
  cartModal.style.display = 'block';
  cartModal.setAttribute('aria-hidden', 'false');
}

function closeCart() {
  cartModal.style.display = 'none';
  cartModal.setAttribute('aria-hidden', 'true');
}

// Event Listeners
searchBar.addEventListener('input', e => renderProducts(e.target.value));
cartIcon.addEventListener('click', openCart);
closeModalBtn.addEventListener('click', closeCart);
continueShoppingBtn.addEventListener('click', closeCart);

checkoutBtn.addEventListener('click', () => {
  if (getTotalQuantity() === 0) {
    alert('Your cart is empty!');
    return;
  }
  alert('Proceeding to checkout...');
  cart = {};
  saveCart();
  updateCartCount();
  closeCart();
});

// Click outside modal to close
window.addEventListener('click', e => {
  if (e.target === cartModal) closeCart();
});

// INITIALIZATION
renderProducts();
updateCartCount();

// =============== SIGN-IN MODAL LOGIC ================
document.addEventListener('DOMContentLoaded', () => {
  const signinBtn = document.getElementById('signin-btn');
  const signinModal = document.getElementById('signin-modal');
  const closeSignin = document.getElementById('close-signin');
  const signinForm = document.getElementById('signinForm');
  const signinMessage = document.getElementById('signin-message');

  if (signinBtn && signinModal && closeSignin && signinForm) {
    signinBtn.addEventListener('click', () => {
      signinModal.style.display = 'block';
    });

    closeSignin.addEventListener('click', () => {
      signinModal.style.display = 'none';
      signinMessage.textContent = '';
    });

    window.addEventListener('click', (event) => {
      if (event.target === signinModal) {
        signinModal.style.display = 'none';
        signinMessage.textContent = '';
      }
    });

    signinForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const username = signinForm.username.value.trim();
      const password = signinForm.password.value.trim();

      if (username && password) {
        // Save to localStorage (demo purpose only)
        localStorage.setItem('knifexpert_user', JSON.stringify({ username, password }));

        signinMessage.style.color = 'green';
        signinMessage.textContent = `Account created. Welcome, ${username}!`;
        setTimeout(() => {
          signinModal.style.display = 'none';
          signinMessage.textContent = '';
          signinForm.reset();
        }, 1500);
      } else {
        signinMessage.style.color = 'red';
        signinMessage.textContent = 'Please fill in all fields.';
      }
    });
  }
});

// =============== LOGIN FUNCTIONALITY ================
document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  const loginMessage = document.getElementById('loginMessage');

  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const username = document.getElementById('loginUsername').value.trim();
      const password = document.getElementById('loginPassword').value.trim();

      const savedUser = JSON.parse(localStorage.getItem('knifexpert_user'));

      if (savedUser && username === savedUser.username && password === savedUser.password) {
        loginMessage.style.color = 'green';
        loginMessage.textContent = `Welcome back, ${username}!`;
        setTimeout(() => {
          window.location.href = "index.html";
        }, 1500);
      } else {
        loginMessage.style.color = 'red';
        loginMessage.textContent = 'Invalid username or password.';
      }
    });
  }
});



// 🔍 Search Filter Logic
document.getElementById('search-input').addEventListener('input', function () {
  const query = this.value.toLowerCase();
  const products = document.querySelectorAll('.product-card');

  products.forEach(product => {
    const title = product.querySelector('h3').textContent.toLowerCase();
    const description = product.querySelector('p').textContent.toLowerCase();

    if (title.includes(query) || description.includes(query)) {
      product.style.display = 'block';
    } else {
      product.style.display = 'none';
    }
  });
});

localStorage.setItem("isLoggedIn", "true");
function toggleMenu() {
  const nav = document.getElementById('navbar');
  nav.classList.toggle('active');
}
function submitContact(event) {
  event.preventDefault();

  const name = document.getElementById("cf-name").value.trim();
  const email = document.getElementById("cf-email").value.trim();
  const message = document.getElementById("cf-message").value.trim();
  const status = document.getElementById("contact-status");

  if (name && email && message) {
    // Simulate sending (you can later replace this with real API)
    status.style.color = "green";
    status.textContent = "Message sent successfully!";
    document.getElementById("contactForm").reset();
  } else {
    status.style.color = "red";
    status.textContent = "Please fill all the fields.";
  }
}



/* hdwhfedjskirefdks*/
function renderProducts(filter = '') {
  productsContainer.innerHTML = '';
  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(filter.toLowerCase())
  );

  if (filtered.length === 0) {
    productsContainer.innerHTML = '<p>No products found.</p>';
    return;
  }

  filtered.forEach(product => {
    const div = document.createElement('div');
    div.className = 'product-card';
    div.dataset.id = product.id;
    div.innerHTML = `
      <img src="${product.image}" alt="${product.name}" />
      <h3>${product.name}</h3>
      <p>${product.description}</p>
      <a href="product-details.html?id=${product.id}" class="btn details-btn">View Details</a>
    `;
    productsContainer.appendChild(div);
  });
}


function addToCart(productName) {
  alert(productName + " has been added to your cart!");
  // Yahan aap cart logic add kar sakte ho future mein
}

function addToCart() {
  alert("Product added to cart!");
}

function addToWishlist() {
  alert("Product added to wishlist!");
}

function buyNow() {
  alert("Redirecting to checkout...");
  // You can redirect to your checkout page like this:
  window.location.href = "checkout.html";
}



function addToCart(name, price, image, description) {
  // Get existing cart from localStorage
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  
  // Check if item already exists
  const existingItem = cart.find(item => item.name === name);
  
  if (existingItem) {
    // If it already exists, just increase quantity
    existingItem.quantity += 1;
  } else {
    // Otherwise, add new item
    cart.push({
      name: name,
      price: price,
      image: image,
      description: description,
      quantity: 1,
    });
  }
  
  // Save updated cart
  localStorage.setItem("cart", JSON.stringify(cart));
  
  // Alert the user
  alert(`${name} added to cart! 🎉`);
}

<img src="${item.image}" alt="${item.name}" />
// script.js

