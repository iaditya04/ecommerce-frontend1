// ===============================
// ✅ Utility Functions
// ===============================
function getCartItems() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCartItems(items) {
  localStorage.setItem("cart", JSON.stringify(items));
}

function isInCart(id) {
  const cart = getCartItems();
  return cart.some(item => item.id === id);
}

function toggleCartItem(productData) {
  let cart = getCartItems();
  const existing = cart.find(item => item.id === productData.id);
  if (existing) {
    cart = cart.filter(item => item.id !== productData.id);
    saveCartItems(cart);
    return false;
  } else {
    cart.push(productData);
    saveCartItems(cart);
    return true;
  }
}

function updateCartCount() {
  const cart = getCartItems();
  const countEl = document.getElementById("cart-count");
  if (countEl) {
    countEl.textContent = cart.length;
  }
}

function showSuccessMessage(text) {
  const msg = document.createElement("div");
  msg.textContent = text;
  msg.className = "cart-success-message";
  document.body.appendChild(msg);
  setTimeout(() => msg.remove(), 2000);
}

// ===============================
// ✅ Load Product Detail
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();

  const productId = new URLSearchParams(window.location.search).get("id");
  const productDetailContainer = document.getElementById("product-detail");

  if (!productId) {
    productDetailContainer.innerHTML = "<p>Product ID not found.</p>";
    return;
  }

  fetch(`https://fakestoreapi.com/products/${productId}`)
    .then(res => res.json())
    .then(product => {
      productDetailContainer.innerHTML = `
        <div class="detail-wrapper">
          <div class="image-zoom-container">
            <img src="${product.image}" alt="${product.title}" class="detail-image zoom-image" />
          </div>
          <div class="detail-info">
            <h2>${product.title}</h2>
            <p class="price">₹<span id="unit-price">${product.price}</span></p>
            <p class="description">${product.description}</p>

            <label for="quantity">Quantity:</label>
            <div class="quantity-selector">
              <button id="decrease">−</button>
              <span id="quantity">1</span>
              <button id="increase">+</button>
            </div>

            <p>Total Price: ₹<span id="total-price">${product.price}</span></p>

            <button class="add-to-cart">Add to Cart</button>
          </div>
        </div>
      `;

      const addToCartBtn = document.querySelector(".add-to-cart");
      const quantitySpan = document.getElementById("quantity");
      const totalPrice = document.getElementById("total-price");
      const unitPrice = parseFloat(document.getElementById("unit-price").textContent);

      let quantity = 1;

      function updatePriceDisplay() {
        totalPrice.textContent = (unitPrice * quantity).toFixed(2);
      }

      document.getElementById("increase").addEventListener("click", () => {
        quantity++;
        quantitySpan.textContent = quantity;
        updatePriceDisplay();
      });

      document.getElementById("decrease").addEventListener("click", () => {
        if (quantity > 1) {
          quantity--;
          quantitySpan.textContent = quantity;
          updatePriceDisplay();
        }
      });

      if (isInCart(Number(productId))) {
        addToCartBtn.textContent = "In Cart";
        addToCartBtn.classList.add("clicked");
      }

      addToCartBtn.addEventListener("click", () => {
        const productData = {
          id: Number(productId),
          title: product.title,
          price: product.price,
          image: product.image,
          quantity
        };

        const inCart = toggleCartItem(productData);
        if (inCart) {
          addToCartBtn.textContent = "In Cart";
          addToCartBtn.classList.add("clicked");
          showSuccessMessage("Added to cart!");
        } else {
          addToCartBtn.textContent = "Add to Cart";
          addToCartBtn.classList.remove("clicked");
          showSuccessMessage("Removed from cart.");
        }
        updateCartCount();
      });

      // Zoom effect
      const zoomImage = document.querySelector(".zoom-image");
      zoomImage.addEventListener("mousemove", () => {
        zoomImage.style.transform = "scale(1.2)";
        zoomImage.style.transition = "transform 0.2s ease";
      });
      zoomImage.addEventListener("mouseleave", () => {
        zoomImage.style.transform = "scale(1)";
      });

    })
    .catch(err => {
      productDetailContainer.innerHTML = "<p>Failed to load product.</p>";
      console.error(err);
    });
});
