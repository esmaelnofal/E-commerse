if (document.getElementById("loginForm")) {
  document.getElementById("loginForm").addEventListener("submit", function (e) {
    e.preventDefault();

    let email = document.querySelector('input[type="email"]').value.trim();
    let password = document.querySelector('input[type="password"]').value.trim();

    if (email === "" || password === "") {
      Swal.fire({
        icon: "warning",
        title: "Missing Fields",
        text: "Please enter your email and password!",
      });
      return;
    }

    localStorage.setItem("loggedIn", "true");

    Swal.fire({
      icon: "success",
      title: "Welcome!",
      text: "Login successful!",
      timer: 1200,
      showConfirmButton: false,
    }).then(() => {
      window.location.href = "home.html";
    });
  });
}

const protectedPages = [
  "home.html",
  "products.html",
  "about.html",
  "addproduct.html",
  "cart.html",
];

if (protectedPages.some((page) => window.location.pathname.toLowerCase().includes(page))) {
  if (localStorage.getItem("loggedIn") !== "true") {
    window.location.href = "index.html";
  }
}

// Handle logout button click
if (document.getElementById("logoutBtn")) {
  document.getElementById("logoutBtn").onclick = () => {
    localStorage.removeItem("loggedIn");
    window.location.href = "index.html";
  };
}

if (document.getElementById("addProductForm")) {
  document.getElementById("addProductForm").addEventListener("submit", function (e) {
    e.preventDefault();
    let productName = document.getElementById("productName").value.trim();
    let productPrice = document.getElementById("productPrice").value.trim();
    let productImage = document.getElementById("productImage").value.trim();

    let newProduct = {
      name: productName,
      price: productPrice,
      image: productImage,
    };

    let products = JSON.parse(localStorage.getItem("products")) || [];
    products.push(newProduct);
    localStorage.setItem("products", JSON.stringify(products));

    Swal.fire({
      icon: "success",
      title: "Product Added!",
      text: "A new product has been successfully added.",
      timer: 1500,
      showConfirmButton: false,
    });
    this.reset();
  });
}

if (document.getElementById("allProductsContainer")) {
  const container = document.getElementById("allProductsContainer");
  const products = JSON.parse(localStorage.getItem("products")) || [];

  let productsHtml = "";
  if (products.length > 0) {
    products.forEach((product) => {
      productsHtml += `
        <div class="col-md-4 mb-4 product-card animate__animated animate__zoomIn">
          <div class="card h-100 shadow-sm">
            <img src="${product.image}" class="card-img-top" alt="${product.name}">
            <div class="card-body d-flex flex-column">
              <h5 class="card-title">${product.name}</h5>
              <p class="card-text">${product.description || "No description"}</p>
              <p class="fw-bold">${product.price} EGP</p>
              <div class="mt-auto d-flex gap-2">
                <button class="btn btn-primary add-to-cart" data-name="${product.name}" data-price="${product.price}" data-image="${product.image}">Add to Cart</button>
                <button class="btn btn-danger remove-product">Remove</button>
              </div>
            </div>
          </div>
        </div>
      `;
    });
  } else {
    productsHtml = `
      <div class="text-center col-12">
        <p class="fs-4 text-muted">No additional products found.</p>
      </div>
    `;
  }
  document.getElementById("dynamicProducts").innerHTML = productsHtml;

  document.querySelectorAll(".remove-product").forEach((btn) => {
    btn.onclick = function () {
      Swal.fire({
        title: "Are you sure?",
        text: "This product will be permanently removed!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
      }).then((result) => {
        if (result.isConfirmed) {
          this.closest(".col-md-4").remove();
          Swal.fire({
            icon: "success",
            title: "Deleted!",
            text: "Product has been removed.",
            timer: 1500,
            showConfirmButton: false,
          });
        }
      });
    };
  });
}

document.querySelectorAll(".add-to-cart").forEach((btn) => {
  btn.onclick = function () {
    const name = this.getAttribute("data-name");
    const price = this.getAttribute("data-price");
    const image = this.getAttribute("data-image");

    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.push({ name, price, image });
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();

    Swal.fire({
      icon: "success",
      title: "Added to Cart!",
      text: `${name} has been added to your cart.`,
      timer: 1000,
      showConfirmButton: false,
    });
  };
});

if (document.getElementById("cartContainer")) {
  renderCart("cartContainer");
}

function renderCart(containerId) {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const container = document.getElementById(containerId);
  if (!container) return;

  let total = 0;
  let html = "";

  if (cart.length > 0) {
    html += '<div class="row g-4">';
    cart.forEach((item, index) => {
      total += parseFloat(item.price);
      html += `
        <div class="col-md-6 col-lg-4 animate__animated animate__fadeIn">
          <div class="card h-100 shadow-sm">
            <img src="${item.image}" class="card-img-top" alt="${item.name}">
            <div class="card-body">
              <h5 class="card-title">${item.name}</h5>
              <p class="card-text fw-bold">${item.price} EGP</p>
              <button class="btn btn-danger remove-item" data-index="${index}">Remove</button>
            </div>
          </div>
        </div>
      `;
    });
    html += '</div>';
    html += `
      <div class="text-end my-4">
        <p class="fs-4 fw-bold">Total: ${total.toLocaleString()} EGP</p>
        <button class="btn btn-success checkout-btn">Proceed to Checkout</button>
      </div>
    `;
  } else {
    html = `
      <div class="text-center p-5">
        <p class="fs-4 text-muted">Your cart is empty.</p>
        <a href="products.html" class="btn btn-primary">Continue Shopping</a>
      </div>
    `;
  }
  container.innerHTML = html;

  document.querySelectorAll(".remove-item").forEach((btn) => {
    btn.onclick = function () {
      let index = this.getAttribute("data-index");
      Swal.fire({
        title: "Are you sure?",
        text: "This item will be removed from the cart.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, remove it!",
      }).then((result) => {
        if (result.isConfirmed) {
          cart.splice(index, 1);
          localStorage.setItem("cart", JSON.stringify(cart));
          updateCartCount();
          renderCart(containerId);

          Swal.fire({
            icon: "success",
            title: "Removed",
            text: "Item removed from cart.",
            timer: 1000,
            showConfirmButton: false,
          });
        }
      });
    };
  });
}

function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const countSpan = document.getElementById("cartCount");
  if (countSpan) {
    countSpan.textContent = cart.length;
  }
}

document.addEventListener("DOMContentLoaded", updateCartCount);