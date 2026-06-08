let product = {};
let products = [];
let users = JSON.parse(localStorage.getItem("users"));
let logged, user, tileSize;
let api = "../data.json";

const container = document.getElementById("product-detail");

const params = new URLSearchParams(window.location.search);
const id = params.get("id");

async function detailProduct(id) {
  try {
    let response = await fetch(api);
    products = await response.json();
    product = products[id - 1];

    await getUser();
    let x = product.dimension.length;
    let y = product.dimension.width;
    let tilePreview = await generateTile(x, y);

    container.innerHTML = `<div class="flex relative flex-col lg:flex-row min-h-70 gap-10">
      <aside class="w-full aspect-square flex-1 justify-center flex"><img src="${product.images}" alt="" class="aspect-square rounded-2xl border-2 border-gray-700 object-cover"/></aside>
        <section class="flex flex-3 flex-col gap-3 w-full h-full">
          <h1 class="text-2xl lg:text-4xl font-bold">${product.title}</h1>
          <p class="lg:text-lg text-gray-400 flex items-center gap-2"><i data-feather="star"></i> <span>${product.rating.rate} (${product.rating.count})</span></p>
          <p class="text-xl lg:text-2xl font-bold text-amber-400">Rp${product.price.toLocaleString()}</p>
          <p class="lg:text-lg text-gray-300">
            ${product.description}
          </p>
          <div class="flex flex-col mt-auto gap-5">
            <button
              onclick="addToCart(${product.id})"
              class="w-full cursor-pointer bg-amber-400 rounded-full hidden lg:flex px-4 py-2 items-center justify-center text-black-primary hover:bg-black-primary hover:text-amber-400 transition ease-in-out duration-300"
            >
              <p class="flex gap-2 text-lg font-bold"><i data-feather="shopping-cart"></i> Add to Cart</p>
            </button>
          </div>
        </section>
        </div>
        <div class="flex w-full gap-4">
        <div class="grid w-full grid-cols-1 md:grid-cols-3 gap-4">
          <section
            class="flex items-center w-full flex-col gap-5 border-2 rounded-2xl p-2 lg:p-5 font-semibold text-lg border-gray-700"
          >
            <h1 class="md:text-2xl font-bold">Length</h1>
            <p class="text-sm md:text-lg font-semibold">${x}cm</p>
          </section>
          <section
            class="flex items-center w-full flex-col gap-5 border-2 rounded-2xl p-2 lg:p-5 font-semibold text-lg border-gray-700"
          >
            <h1 class="md:text-2xl font-bold">Width</h1>
            <p class="text-sm md:text-lg  font-semibold">${y}cm</p>
          </section>
          <section
            class="flex items-center w-full flex-col gap-5 border-2 rounded-2xl p-2 lg:p-5 font-semibold text-lg border-gray-700"
          >
            <h1 class="md:text-2xl font-bold">Height</h1>
            <p class="text-sm md:text-lg font-semibold">${product.dimension.height}cm</p>
          </section>
        </div>
      </div>
      <section class="flex items-center w-full flex-col gap-5 border-2 rounded-2xl p-5 font-semibold text-lg border-gray-700">
          <h1 class="text-2xl font-bold flex items-center">Tile Preview (${Math.ceil(x / tileSize)}&times;${Math.ceil(y / tileSize)}) </h1>
          <div class="w-fit grid grid-cols-${Math.ceil(x / tileSize)}">
            ${tilePreview}
          </div>
        </section>
        <button
              onclick="addToCart(${product.id})"
              class="w-full cursor-pointer bg-amber-400 rounded-full flex lg:hidden px-4 py-2 items-center justify-center text-black-primary hover:bg-black-primary hover:text-amber-400 transition ease-in-out duration-300"
            >
              <p class="flex gap-2 text-lg font-bold"><i data-feather="shopping-cart"></i> Add to Cart</p>
            </button>`;
    showRec();
    feather.replace();
  } catch (error) {
    console.log("Error :", error);
  }
}

detailProduct(id);

function generateTile(x, y) {
  let tiles = "";
  let amount = Math.ceil(x / tileSize) * Math.ceil(y / tileSize);
  for (let i = 0; i < amount; i++) {
    tiles +=
      '<div class="w-5 h-5 md:w-10 md:h-10 lg:w-20 lg:h-20 outline outline-dashed outline-gray-500"></div>';
  }
  return tiles;
}

function showRec() {
  let el = "";
  let limit = 0;
  products.forEach((i) => {
    if (product.category == i.category && product.id != i.id) {
      el += `<a
              data-title="${i.title}"
              data-category="${i.category}"
              href="/view/detail.html?id=${i.id}"
              class="cards relative group flex w-full aspect-square items-center justify-center rounded-2xl font-semibold text-lg border-gray-700 hover:border-amber-400 border-2 transition ease-in-out duration-300"
              ><img
                src="${i.images}"
                alt=""
                class="absolute rounded-2xl h-full w-full object-cover"
              />
              <section class="absolute opacity-0 group-hover:opacity-100 rounded-2xl inset-0 justify-center items-center bg-black/50 transition ease-in-out duration-300">
                <button 
                  class="cursor-pointer absolute flex p-2 bottom-2 right-2 text-xl bg-amber-400 rounded-full text-black hover:bg-black-primary hover:text-amber-400 transition ease-in-out duration-300" 
                  onclick="addToCart(${i.id})"
                ><i data-feather="shopping-cart"></i></button>
              </section></a>`;
      limit += 1;
    }
  });
  products.forEach((i, index) => {
    if (
      (index + product.id * 33550336) % 7 == 0 && // anggep ini milih produk random karena kalau per kategori dikit
      product.id != i.id &&
      limit < 6
    ) {
      el += `<a
              data-title="${i.title}"
              data-category="${i.category}"
              href="/view/detail.html?id=${i.id}"
              class="cards nth-[n+5]:hidden md:nth-[n+5]:block  lg:nth-[n+5]:hidden relative group flex w-full aspect-square items-center justify-center rounded-2xl font-semibold text-lg border-gray-700 hover:border-amber-400 border-2 transition ease-in-out duration-300"
              ><img
                src="${i.images}"
                alt=""
                class=" absolute rounded-2xl h-full w-full object-cover"
              />
              <section class="absolute opacity-0 group-hover:opacity-100 rounded-2xl inset-0 justify-center items-center bg-black/50 transition ease-in-out duration-300">
                <button 
                  class="cursor-pointer absolute flex p-2 bottom-2 right-2 text-xl bg-amber-400 rounded-full text-black hover:bg-black-primary hover:text-amber-400 transition ease-in-out duration-300" 
                  onclick="addToCart(${i.id})"
                ><i data-feather="shopping-cart"></i></button>
              </section></a>`;
      limit += 1;
    }
  });

  document.getElementById("rec-products").innerHTML = el;
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

  tileSize = config.c2;
}

function addToCart(id) {
  event.preventDefault();
  let indexSel = cart.findIndex((item) => item.id == id);
  if (indexSel == -1) {
    let item = {
      id: id,
      price: product.price,
      totalPrice: product.price,
      quantity: 1,
      checked: false,
    };
    cart.push(item);
  } else {
    cart[indexSel].quantity += 1;
    cart[indexSel].prices = product.price * cart[indexSel].quantity;
  }
  if (config.c3 == "any" || config.c3 == "add") {
    alert(`Product ${product.title} Added to Cart Successfully!`);
  }
  localStorage.setItem(`cart_${user.id}`, JSON.stringify(cart));
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