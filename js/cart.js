let products = [];
let users = JSON.parse(localStorage.getItem("users"));
let logged,
  user,
  cart,
  allPrice = 0;
let discount = Number(document.getElementById("discount").textContent);

let api = "../data.json";
async function getProduct() {
  try {
    let response = await fetch(api);
    if (!response.ok) throw new Error("Data not found");
    products = await response.json();
    getUser();
    showCart();
    // checks();
  } catch (error) {
    console.log("Error :", error);
  }
}

function getUser() {
  logged = Number(localStorage.getItem("logged"));
  user = users.find((u) => u.id == logged);
  cart = JSON.parse(localStorage.getItem(`cart_${user.id}`)) || [];
  config = JSON.parse(localStorage.getItem(`config_${user.id}`)) || {
    c1: "any",
    c2: 30,
    c3: "any",
  };

  document.getElementById("name").innerHTML = user.username;
}

function showCart() {
  let el = "";
  allPrice = 0;
  if (cart.length <= 0) {
    document.getElementById("cart").innerHTML =
      `<p class="text-center text-gray-400">Your cart is empty</p>`;
  } else {
    el += `<p id="error-query"></p>`;
    cart.forEach((item) => {
      let product = products.find((product) => product.id == item.id);
      el += `<ul class="carts" data-title="${product.title}"><div class="md:flex-row flex-col cart-item relative flex items-center gap-5 mt-5">
            <a
              href="/view/detail.html?id=${product.id}" 
              class="max-w-40 max-h-40 md:w-25 md:h-25 aspect-square">
              <img
                src="${product.images}"
                class="w-full h-full object-cover border-2 rounded-2xl border-gray-700"
                alt=""
              />
            </a>
            <section class="desc w-full flex flex-col items-center md:items-start lg:max-w-[45%]">   
              <h1 class="text-sm md:text-base text-clip font-semibold">${product.title}</h1>
              <p class="flex md:text-base items-center gap-2 font-semibold text-amber-400"><span class="price">Rp${item.totalPrice.toLocaleString()}</span> <span class="text-xs text-thin text-gray-400">(Rp${item.price.toLocaleString()}/unit)</span></p>
            </section>
            <input data-id="${item.id}" type="checkbox" ${item.checked ? "checked" : ""} class="check absolute top-0 right-0 w-5 aspect-square accent-amber-400">
            <section class="md:absolute flex gap-3 items-center bottom-0 right-0">
              <section class="flex items-center p-1 gap-4 bg-amber-400 rounded-full">
                <button
                  onclick="modifyQty(${item.id}, 'decrease', this)"
                  class="cursor-pointer flex p-1 w-8 h-8 items-center justify-center bg-amber-400 rounded-full text-black hover:bg-black-primary hover:text-amber-400 transition ease-in-out duration-300"
                >
                  -
                </button>
                <p class="qty-text font-bold text-black">${item.quantity}</p>
                <button
                  onclick="modifyQty(${item.id}, 'increase', this)"
                  class="cursor-pointer flex p-1 w-8 h-8 items-center justify-center bg-amber-400 rounded-full text-black hover:bg-black-primary hover:text-amber-400 transition ease-in-out duration-300"
                >
                  +
                </button>
              </section>
              <button
                onclick="removeItem(${item.id})"
                class="cursor-pointer flex py-1.5 px-3 items-center justify-center bg-red-400 rounded-full text-black hover:bg-red-300 transition ease-in-out duration-300"
              >
                Remove
              </button>
            </section>
          </div>
          <hr class="border-b-2 mt-5 border-gray-700 rounded-full"></ul>`;

      if (item.checked) {
        allPrice += item.totalPrice;
      }
    });
    el += `<button onclick="clearCart()" class="bg-red-500 mt-5 hover:bg-red-400 transition ease-in-out duration-300 cursor-pointer max-w-50 rounded-full py-1.5 px-3 flex items-center justify-center">Clear Cart</button>`;
    document.getElementById("cart").innerHTML = el;
    // search();

    document.querySelectorAll(".check").forEach((check) => {
      check.addEventListener("change", () => checkbox(check));
    });
  }

  updatePrice();
}


function checkbox(check) {
  let item = cart.find((i) => i.id == check.dataset.id);
  item.checked = check.checked;
  localStorage.setItem(`cart_${user.id}`, JSON.stringify(cart));

  if (item.checked) {
    allPrice += item.totalPrice;
  } else {
    allPrice -= item.totalPrice;
  }

  updatePrice();
}

function updatePrice() {
  document.getElementById("total-price").innerHTML =
    `Rp${allPrice.toLocaleString()}`;
  document.getElementById("final-price").innerHTML =
    `Rp${(allPrice - (allPrice * discount) / 100).toLocaleString()}`;
}

function modifyQty(id, action, button) {
  let item = cart.find((item) => item.id == id);
  let container = button.parentElement;
  let quantityEl = container.querySelector(".qty-text");
  let priceEl = container.parentElement.parentElement.querySelector(".price");

  if (action == "increase") {
    item.quantity += 1;
  } else if (action == "decrease") {
    if (item.quantity > 1) {
      item.quantity -= 1;
    } else {
      removeItem(item.id);
    }
  }

  item.totalPrice = item.price * item.quantity;
  localStorage.setItem(`cart_${user.id}`, JSON.stringify(cart));

  showCart();
}

function removeItem(id) {
  if (config.c1 == "any") {
    if (confirm("Are you sure you want to remove the product from cart?")) {
      let indexSel = cart.findIndex((item) => item.id == id);
      cart.splice(indexSel, 1);
      localStorage.setItem(`cart_${user.id}`, JSON.stringify(cart));
      showCart();
    }
  } else {
    let item = cart.find((item) => item.id == id);
    let indexSel = cart.findIndex((item) => item.id == id);
    cart.splice(indexSel, 1);
    localStorage.setItem(`cart_${user.id}`, JSON.stringify(cart));
    showCart();
    if (config.c3 == "any" || config.c3 == "remove") {
      alert("Product $ from cart successfully!");
    }
  }
}

function clearCart() {
  if (config.c1 == "none") {
    cart.length = 0;
    localStorage.setItem(`cart_${user.id}`, JSON.stringify(cart));
    showCart();
    alert("Cart cleared successfully!");
  } else {
    if (
      confirm(
        "Are you sure you want to proceed? This will remove all items in the cart",
      )
    ) {
      cart.length = 0;
      localStorage.setItem(`cart_${user.id}`, JSON.stringify(cart));
      showCart();
      alert("Cart cleared successfully!");
    }
  }
}

function checkout() {
  if (allPrice > 0) {
    if (confirm("Are you sure you want to checkout now?")) {
      cart = cart.filter((item) => !item.checked);
      localStorage.setItem(`cart_${user.id}`, JSON.stringify(cart));
      showCart();
      alert("Checkout success!");
    }
  } else {
    alert("No items found, please check items to proceed!");
  }
}

function search() {
  let mismatch = 0;
  let searchKey = document.getElementById("search").value.toLowerCase().trim();
  const carts = document.querySelectorAll(".carts");
  carts.forEach((item) => {
    item.classList.remove("hidden");
    let title = item.dataset.title.toLowerCase();

    if (!title.includes(searchKey)) {
      mismatch += 1;
      item.classList.add("hidden");
    }
  });
  // console.log(searchKey, carts);

  // console.log(mismatch, carts.length);

  if (mismatch >= carts.length) {
    document.getElementById("error-query").innerHTML =
      `<p class="text-center text-gray-400">Item not found</p>`;
  } else {
    document.getElementById("error-query").innerHTML = `<p></p>`;
  }
}

function search() {
  let el = "";
  let query = document.getElementById("search").value
  listContainer.classList.remove("hidden");

  products.forEach((product) => {
    let match = product.tag.some((tag) =>
      tag.toLowerCase().includes(query.toLowerCase()),
    );

    if (match) {
      el += `<a
                href="/view/detail.html?id=${product.id}"
                class="relative group gap-2 flex w-full h-25 items-center py-2 bg-black-primary rounded-2xl font-semibold text-lgborder-2 transition ease-in-out duration-300"
              >
                <img
                  src="${product.images}"
                  alt=""
                  class="rounded-2xl aspect-square max-w-20 max-h-20 object-cover"
                />
                <p class="group-hover:underline group-hover:text-amber-400 font-medium transition ease-in-out duration-300">${product.title}</p>
              </a>
              <hr class="border-b-2 border-gray-700 rounded-full" />`;
    }
  });

  document.getElementById("search-container").innerHTML = el;
  feather.replace();
}

let listBox = document.getElementById("search-box");
let listContainer = document.getElementById("search-container");

document.addEventListener("click", (e) => {
  if (!listBox.contains(e.target)) {
    listContainer.classList.add("hidden");
  }
});

getProduct();

