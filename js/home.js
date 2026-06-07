let products = [];
let users = JSON.parse(localStorage.getItem("users"));
let logged, user, cart;

let api = "../data.json";
async function getProduct() {
  try {
    let response = await fetch(api);
    if (!response.ok) throw new Error("Data not found");
    products = await response.json();
    showProduct();
    getUser();
  } catch (error) {
    console.log("Error :", error);
  }
}

function showProduct() {
  let el = "";
  products.forEach((product) => {
    el += `<a
              href="/view/detail.html?id=${product.id}"
              class="cards relative group flex w-full aspect-square items-center justify-center rounded-2xl font-semibold text-lg border-gray-700 hover:border-amber-400 border-2 transition ease-in-out duration-300"
              ><img
                src="${product.images}"
                alt=""
                class="absolute rounded-2xl h-full w-full object-cover"
              />
              <section class="absolute opacity-0 group-hover:opacity-100 rounded-2xl inset-0 justify-center items-center bg-black/50 transition ease-in-out duration-300">
                <button 
                  class="cursor-pointer absolute flex p-2 bottom-2 right-2 text-xl bg-amber-400 rounded-full text-black hover:bg-black-primary hover:text-amber-400 transition ease-in-out duration-300" 
                  onclick="addToCart(${product.id})"
                ><i data-feather="shopping-cart"></i></button>
              </section></a>`;
  });

  document.getElementById("product-container").innerHTML = el;
  feather.replace();
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

function addToCart(id) {
  event.preventDefault();
  // let itemId = id
  let productSel = products.find((product) => product.id == id);
  let indexSel = cart.findIndex((item) => item.id == id);
  if (indexSel == -1) {
    let item = {
      id: id,
      price: productSel.price,
      totalPrice: productSel.price,
      quantity: 1,
      checked: false,
    };
    cart.push(item);
  } else {
    cart[indexSel].quantity += 1;
    cart[indexSel].totalPrice = productSel.price * cart[indexSel].quantity;
  }
  if (config.c3 == "any" || config.c3 == "add") {
    alert(`Product ${productSel.title} Added to Cart Successfully!`);
  }
  localStorage.setItem(`cart_${user.id}`, JSON.stringify(cart));
}

// function search() {
//   let mismatch = 0;
//   let searchKey = document.getElementById("search").value.toLowerCase().trim();
//   const cards = document.querySelectorAll(".cards");
//   cards.forEach((card) => {
//     card.classList.remove("hidden");
//     let title = card.dataset.title.toLowerCase();

//     if (!title.includes(searchKey)) {
//       mismatch += 1;
//       card.classList.add("hidden");
//     }
//   });

//   if (mismatch >= cards.length) {
//     document.getElementById("error-query").innerHTML =
//       "<p class='text-center text-2xl font-semibold'>Item Not Found</p>";
//   } else {
//     document.getElementById("error-query").innerHTML = "<p></p>";
//   }
// }

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
