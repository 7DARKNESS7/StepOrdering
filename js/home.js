let productCards = document.getElementById("productCards");
let categories = document.getElementById("categories");
let cartProduct = document.getElementById("cartProd");
let total = document.getElementById("cartTotal");
let generalTotal = document.getElementById("generalTotal");
let addToCartBtn = document.getElementById("addToCartBtn");
let nuts = document.getElementById("nuts");
let vegan = document.getElementById("vegan");
let spicinessRange = document.getElementById("spicinessRange");
let spicinessValue = document.getElementById("spicinessValue");
let filterReset = document.getElementById("filterReset");
let filterApply = document.getElementById("filterApply");
let filterErrorResult = document.getElementById("filterErrorResult");
let filterSuccessResult = document.getElementById("filterSuccessResult");
let errorBox = document.getElementById("errorBox");
let successBox = document.getElementById("successBox");

async function getProducts() {
  let productList = await fetch(
    "https://restaurant.stepprojects.ge/api/Products/GetAll"
  );
  return productList.json();
}
getProducts().then((data) => {
  showCards(data);
});

function showCards(items) {
  productCards.innerHTML = "";

  items.forEach((item) => {
    productCards.innerHTML += `
        <div class="pCard">
          <img src="${item.image}" alt="">
          <div class="cardInfo">
            <h3>${item.name}</h3>
            <p>Spiciness: ${item.spiciness}</p>
            <div class="addIngr">
              <p>${
                item.nuts
                  ? `<i class="fi fi-rs-circle"></i>`
                  : `<i class="fi fi-rs-check-circle"></i>`
              } nuts</p>
              <p>${
                item.vegeterian
                  ? `<i class="fi fi-rs-check-circle"></i>`
                  : `<i class="fi fi-rs-circle"></i>`
              } vegetarian</p>
            </div>
            <div class="bottomInfo">
              <p>$ ${item.price}</p>
              <button onclick="addToCart(${item.price},${
      item.id
    })">Add to cart</button>
            </div>
          </div>
        </div>
      `;
  });
}

fetch("https://restaurant.stepprojects.ge/api/Categories/GetAll")
  .then((response) => response.json())
  .then((data) => {
    showCategories(data);
  });

function showAllProducts() {
  fetch("https://restaurant.stepprojects.ge/api/Products/GetAll")
    .then((response) => response.json())
    .then((data) => {
      showCards(data);
    });
}

// Categories
function showCategories(list) {
  categories.innerHTML = '<span onclick="showAllProducts()">All</span>';

  list.forEach((item) => {
    categories.innerHTML += `
      <span onclick="showCardsByCategory(${item.id})">${item.name}</span>
    `;
  });
}

function showCardsByCategory(id) {
  fetch(`https://restaurant.stepprojects.ge/api/Categories/GetCategory/${id}`)
    .then((response) => response.json())
    .then((finalData) => {
      let productList = finalData.products;
      showCards(productList);
    });
}

// Cart Add
let cartItems = [];

function addToCart(price, id) {
  let existingItem = cartItems.find((item) => item.productId === id);

  if (existingItem) {
    existingItem.quantity++;

    fetch("https://restaurant.stepprojects.ge/api/Baskets/UpdateBasket", {
      method: "PUT",
      headers: {
        accept: "text/plain",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        quantity: existingItem.quantity,
        price: price,
        productId: id,
      }),
    })
      .then(() => {
        successBox.style.opacity = 1;
        successBox.style.transform = "translateY(30px)";
        filterSuccessResult.innerText = "Cart Updated!";
        setTimeout(() => {
          successBox.style.transform = "translateY(-100px)";
        }, 1500);
      })
      .catch((error) => {
        errorBox.style.opacity = 1;
        errorBox.style.transform = "translateY(30px)";
        filterErrorResult.innerText = "Error Updating Cart!";
        setTimeout(() => {
          errorBox.style.transform = "translateY(-100px)";
        }, 1500);
      });
  } else {
    let newItem = { productId: id, quantity: 1, price: price };
    cartItems.push(newItem);

    fetch("https://restaurant.stepprojects.ge/api/Baskets/AddToBasket", {
      method: "POST",
      headers: {
        accept: "text/plain",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newItem),
    })
      .then(() => {
        successBox.style.opacity = 1;
        successBox.style.transform = "translateY(30px)";
        filterSuccessResult.innerText = "Item Added To Cart!";
        setTimeout(() => {
          successBox.style.transform = "translateY(-100px)";
        }, 1500);
      })
      .catch((error) => {
        errorBox.style.opacity = 1;
        errorBox.style.transform = "translateY(30px)";
        filterErrorResult.innerText = "Error Adding To Cart!";
        setTimeout(() => {
          errorBox.style.transform = "translateY(-100px)";
        }, 1500);
      });
  }
}

// Filter
let spiciness = "";

filterApply.addEventListener("click", function (e) {
  e.preventDefault();
  spicinessRange.value > "-1"
    ? (spiciness = spicinessRange.value)
    : (spiciness = "");
  nuts.checked ? (nuts.value = true) : "";
  vegan.checked ? (vegan.value = true) : "";
  !nuts.checked ? (nuts.value = "") : (nuts.value = true);
  !vegan.checked ? (vegan.value = "") : (vegan.value = true);

  fetch(
    `https://restaurant.stepprojects.ge/api/Products/GetFiltered?vegeterian=${vegan.value}&nuts=${nuts.value}&spiciness=${spiciness}`
  )
    .then((res) => res.json())
    .then((data) => {
      if (Array.isArray(data)) {
        if (data.length > 0) {
          showCards(data);
        } else {
          errorBox.style.opacity = 1;
          errorBox.style.transform = "translateY(30px)";

          setTimeout(() => {
            errorBox.style.transform = "translateY(-100px)";
          }, 1500);
        }
      }
      filterErrorResult.innerText = "No Product Found!";
    });
});

filterReset.addEventListener("click", function () {
  fetch("https://restaurant.stepprojects.ge/api/Products/GetAll")
    .then((response) => response.json())
    .then((data) => {
      showCards(data);
    });
  spicinessRange.value = "-1";
  spicinessValue.innerText =
    spicinessRange > -1 ? spicinessRange : "Not Chosen";
  nuts.checked ? (nuts.checked = false) : "";
  vegan.checked ? (vegan.checked = false) : "";
});

spicinessRange.addEventListener("input", function () {
  let spicinessRangeVal = spicinessRange.value;
  spicinessValue.innerText =
    spicinessRangeVal > -1 ? spicinessRangeVal : "Not Chosen";
});

window.onscroll = function () {
  let navbar = document.getElementById("navbarScroll");
  if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
    navbar.classList.add("navScrolled");
  } else {
    navbar.classList.remove("navScrolled");
  }
};

let burgerBtn = document.getElementById("burgerBtn");
let burgerMenu = document.getElementById("burgerMenu");

burgerBtn.addEventListener("click", function () {
  burgerMenu.classList.toggle("hidden");
  burgerBtn.classList.toggle("burgerToggle");
});
