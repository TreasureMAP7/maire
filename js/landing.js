let products = [];

let api = "data.json";
async function getProduct() {
  try {
    let response = await fetch(api);
    if (!response.ok) throw new Error("Data not found");
    products = await response.json();
    showProduct();
  } catch (error) {
    console.log("Error :", error);
  }
}

function showProduct() {
  let el = "";
  products.forEach((item) => {
    el += `<a
              href="/view/register.html"
              class="relative group flex w-full aspect-square items-center justify-center rounded-2xl font-semibold text-lg border-gray-700 hover:border-amber-400 border-2 transition ease-in-out duration-300"
              ><img
                src="${item.images}"
                alt=""
                class="absolute rounded-2xl h-full w-full object-cover"
              />
              <section class="absolute opacity-0 group-hover:opacity-100 rounded-2xl inset-0 justify-center items-center bg-black/50 transition ease-in-out duration-300">
                <button class="cursor-pointer absolute flex p-2 bottom-2 right-2 text-xl bg-amber-400 rounded-full text-black hover:bg-black-primary hover:text-amber-400 transition ease-in-out duration-300"><i data-feather="shopping-cart"></i></button>
              </section>`;
  });

  document.getElementById("product-container").innerHTML = el;
  feather.replace()
}

getProduct();
