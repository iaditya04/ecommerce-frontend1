// Toggle nav
const hamburger = document.querySelector(".hamburger-menu");
const navLinks = document.querySelector(".nav-links");
hamburger.addEventListener("click", () => {
  navLinks.classList.toggle("active");
});

const productGrid = document.getElementById("product-grid");
const cartCountSpan = document.querySelector(".cart-count");
let cartCount = 0;

// Show loading message
productGrid.innerHTML = "<p>Loading products...</p>";

// Fetchinf products from FakeStore API
fetch("https://fakestoreapi.com/products")
  .then(res => res.json())
  .then(products => {
    productGrid.innerHTML = ""; // Clear loading

 products.forEach(product => {
  const card = document.createElement("div");
  card.className = "product-card";
  card.innerHTML = `
    <a href="product.html?id=${product.id}">
      <img src="${product.image}" alt="${product.title}" />
    </a>
    <div class="product-content">
      <h3>${product.title}</h3>
      <p>₹${product.price}</p>
    </div>
    <button class="add-to-cart">Add to Cart</button>
  `;
  
  const button = card.querySelector(".add-to-cart");

  button.addEventListener("click", () => {
    // Visual feedback on button click
    button.textContent = "In Cart";
    button.classList.add("clicked");
  });

  productGrid.appendChild(card);
});



  })
  .catch(error => {
    console.error("API Error:", error);
    productGrid.innerHTML = "<p>Failed to load products. Try again later.</p>";
  });

// Add to cart logic
productGrid.addEventListener("click", e => {
  if (e.target.classList.contains("add-to-cart")) {
    cartCount++;
    cartCountSpan.textContent = cartCount;
  }
});
