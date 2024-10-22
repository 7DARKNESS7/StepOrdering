let productCards = document.getElementById("productCards");
let categories = document.getElementById("categories");
let cartProduct = document.getElementById("cartProd");
let total = document.getElementById("cartTotal");
let generalTotal = document.getElementById("generalTotal");

async function getCart() {
  let cartList = await fetch(
    "https://restaurant.stepprojects.ge/api/Baskets/GetAll"
  );
  return cartList.json();
}

getCart().then((data) => {
  showBasket(data);
});

function showBasket(list) {
  let total = 0;

  cartProduct.innerHTML = "";

  list.forEach((item) => {
    let fullPrice = item.quantity * item.price;

    if (item.product.quantity >= 1) {
      item.quantity++;
    }

    cartProduct.innerHTML += `
      <div class="cart-item" id="item-${item.product.id}">
        <div class="name-image">
          <div class="deleteIcon">
            <i class="fi fi-br-cross-small" data-id="${item.product.id}"></i>
            <i class="fi fi-sc-pencil" data-id="${item.product.id}"></i>
          </div>
          <div class="imgName">
            <img src="${item.product.image}" alt="">
            <span>${item.product.name}</span>
          </div>
        </div>
        <div class="qty">
          <div>
            <i class="fi fi-ss-add qtyBtn" onclick="quantityIncrease(${item.price}, ${item.quantity}, ${item.product.id})"></i>
            <span>${item.quantity}</span>
            <i class="fi fi-ss-minus-circle qtyBtn" onclick="quantityDecrease(${item.price}, ${item.quantity}, ${item.product.id})"></i>
          </div>
          <span>$ ${item.price}</span>
          <span class="item-total">$ ${fullPrice}</span>
        </div>
      </div>
    `;

    total += fullPrice;
  });

  generalTotal.innerText = `Total: $${total.toFixed(2)}`;

  document.querySelectorAll(".fi-br-cross-small").forEach((icon) => {
    icon.addEventListener("click", function () {
      const productId = this.getAttribute("data-id");
      deleteProductFromCart(productId);
    });
  });
}

function quantityIncrease(cardPrice, cardQuantity, cartID) {
  cardQuantity++;
  let forUpdate = {
    quantity: cardQuantity,
    price: cardPrice,
    productId: cartID,
  };

  fetch("https://restaurant.stepprojects.ge/api/Baskets/UpdateBasket", {
    method: "PUT",
    headers: {
      accept: "*/*",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(forUpdate),
  }).then((res) =>
    res.text().then((data) => {
      getCart().then((cartItems) => showBasket(cartItems));
    })
  );
}

function quantityDecrease(cardPrice, cardQuantity, cartID) {
  if (cardQuantity > 1) {
    cardQuantity--;
    let forUpdate = {
      quantity: cardQuantity,
      price: cardPrice,
      productId: cartID,
    };

    fetch("https://restaurant.stepprojects.ge/api/Baskets/UpdateBasket", {
      method: "PUT",
      headers: {
        accept: "*/*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(forUpdate),
    }).then((res) =>
      res.text().then((data) => {
        getCart().then((cartItems) => showBasket(cartItems));
      })
    );
  } else {
    deleteProductFromCart(cartID);
  }
}

function deleteProductFromCart(productId) {
  fetch(
    `https://restaurant.stepprojects.ge/api/Baskets/DeleteProduct/${productId}`,
    {
      method: "DELETE",
    }
  )
    .then((response) => {
      if (response) {
        document.getElementById(`item-${productId}`).remove();
        recalculateTotal();
      } else {
        console.error("Failed to delete the product.");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function recalculateTotal() {
  let newTotal = 0;

  document.querySelectorAll(".item-total").forEach((item) => {
    newTotal += parseFloat(item.innerText.replace("$", ""));
  });

  generalTotal.innerText = `Total: $${newTotal.toFixed(2)}`;
}

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
