let productCards = document.getElementById("productCards")
let categories = document.getElementById("categories")

fetch("https://restaurant.stepprojects.ge/api/Products/GetAll")
.then(pasuxi => pasuxi.json())
.then(data => {
    console.log(data);
    showCards(data)
    
})

function showCards(list) {
   list.forEach(item => {
    productCards.innerHTML += `
                <div class="pCard">
                    <img src="${item.image}" alt="">
                    <div class="cardInfo">
                        <h3>${item.name}</h3>
                        <p>Spiciness: ${item.spiciness}</p>
                        <div class="addIngr">
                            <p>${item.nuts ? `<i class="fi fi-rs-check-circle"></i>` : `<i class="fi fi-rs-circle"></i>`} nuts</p>
                            <p>${item.vegeterian ? `<i class="fi fi-rs-check-circle"></i>` : `<i class="fi fi-rs-circle"></i>`} vegeterian</p>
                        </div>
                        <div class="bottomInfo">
                            <p>$ ${item.price}</p>
                            <button>Add to cart</button>
                        </div>
                    </div>
                </div>`
   })
}

fetch("https://restaurant.stepprojects.ge/api/Categories/GetAll")
.then(pasuxi => pasuxi.json())
.then(data => {
    console.log(data);
    showCategories(data)
    
})

function showCategories(list) {
   list.forEach(item => {
    categories.innerHTML += `
    <span>${item.name}</span>`
   })
}


window.onscroll = function() {
    let navbar = document.getElementById("navbarScroll");
    if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
        navbar.classList.add("navScrolled");
    } else {
        navbar.classList.remove("navScrolled");
    }
};

  
