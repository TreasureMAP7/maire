let users = JSON.parse(localStorage.getItem("users"));
let logged,
  user,
  config,
  inputData = [];

const params = new URLSearchParams(window.location.search);
const editMode = params.get("edit");

function getUser() {
  logged = Number(localStorage.getItem("logged"));
  user = users.find((u) => u.id == logged);
  config = JSON.parse(localStorage.getItem(`config_${user.id}`)) || {
    c1: "any",
    c2: 30,
    c3: "any",
  };

  document.getElementById("first").value = user.first || "";
  document.getElementById("last").value = user.last || "";
  document.getElementById("username").value = user.username || "";
  document.getElementById("email").value = user.email || "";
  // document.getElementById("password").value = user.password || "";

  document.getElementById("nameA").innerHTML =
    user.first && user.last ? `${user.first} ${user.last}` : user.username;
  document.getElementById("emailA").innerHTML = user.email;

  document.getElementById("c1").value = config.c1;
  document.getElementById("c2").value = config.c2;
  document.getElementById("c3").value = config.c3;

  if (editMode) {
    edit();
  }
}

function edit() {
  document.querySelectorAll(".profile-data").forEach((input) => {
    input.classList.remove("opacity-50", "cursor-not-allowed");
    input.disabled = false;
  });

  document
    .getElementById("c1")
    .classList.remove("opacity-50", "cursor-not-allowed");
  document.getElementById("c1").disabled = false;
  document
    .getElementById("c2")
    .classList.remove("opacity-50", "cursor-not-allowed");
  document.getElementById("c2").disabled = false;
  document
    .getElementById("c3")
    .classList.remove("opacity-50", "cursor-not-allowed");
  document.getElementById("c3").disabled = false;

  document.getElementById("save").classList.remove("hidden");
  document.querySelectorAll(".edit-btn").forEach((btn) => {
    btn.classList.add("hidden");
  });
}

function save() {
  inputData = [];
  document.querySelectorAll(".profile-data").forEach((input) => {
    inputData.push(input.value);
  });

  config.c1 = document.getElementById("c1").value;
  config.c2 = document.getElementById("c2").value;
  config.c3 = document.getElementById("c3").value;

  user.first = inputData[0];
  user.last = inputData[1];
  user.username = inputData[2];
  user.email = inputData[3];

  localStorage.setItem(`config_${user.id}`, JSON.stringify(config));
  localStorage.setItem("users", JSON.stringify(users));
  window.location.href = "/view/profile.html";
}

function logout() {
  if (
    confirm(
      "Are you sure you want to log out of this account? your data will be saved",
    )
  ) {
    window.location.href = "../";
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

getUser();
