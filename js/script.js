

/* ============================================================
   BITEBOX JAVASCRIPT
============================================================ */

console.log("BiteBox Javascript is working now!!!");

let restaurantName = "BiteBox";


/* ============================================================
   CART DATA
============================================================ */

let cart = JSON.parse(localStorage.getItem("biteboxCart")) || [];


/* ============================================================
   MENU SECTION
============================================================ */

let menuSection = document.getElementById("menu-items");


/* ============================================================
   ADD TO CART
============================================================ */

if (menuSection) {

    menuSection.addEventListener("click", function (event) {

        let button = event.target.closest("button");

        if (!button) {
            return;
        }

        if (button.classList.contains("add-to-cart")) {

            let card = button.closest("article");

            if (card) {
                addToCart(card);
            }
        }
    });
}


/* ============================================================
   ADD ITEM TO CART
============================================================ */

function addToCart(card) {

    let nameElement = card.querySelector("h3");
    let priceElement = card.querySelector(".price");
    let imageElement = card.querySelector("img");

    if (!nameElement || !priceElement || !imageElement) {
        return;
    }

    let name = nameElement.textContent.trim();

    let priceText = priceElement.textContent;

    let price = parseFloat(
        priceText.replace("₹", "").trim()
    );

    let image = imageElement.getAttribute("src");

    let cartItem = {
        name: name,
        price: price,
        image: image,
        quantity: 1
    };

    let existingItem = cart.find(function (item) {
        return item.name === name;
    });

    if (existingItem) {

        existingItem.quantity++;

    } else {

        cart.push(cartItem);
    }

    localStorage.setItem(
        "biteboxCart",
        JSON.stringify(cart)
    );

    renderCart();

    updateOrderSummary();

    updateCartCount();

    console.log("Cart:", cart);
}


/* ============================================================
   CART TABLE
============================================================ */

let cartBody = document.querySelector(
    "#shopping-cart tbody"
);


/* ============================================================
   RENDER CART
============================================================ */

function renderCart() {

    if (!cartBody) {
        return;
    }

    cartBody.innerHTML = "";

    if (cart.length === 0) {

        let row = document.createElement("tr");

        row.innerHTML = `
            <td colspan="5">
                <div class="empty-cart">
                    <h3>Your Cart is Empty</h3>
                    <p>Add some delicious food from our Menu!</p>
                </div>
            </td>
        `;

        cartBody.appendChild(row);

        return;
    }

    cart.forEach(function (item, index) {

        let itemTotal =
            item.price * item.quantity;

        let row = document.createElement("tr");

        row.innerHTML = `
            <td>
                <img
                    src="${item.image}"
                    alt="${item.name}"
                    width="80"
                >
                <h3>${item.name}</h3>
            </td>

            <td>
                ₹${item.price}
            </td>

            <td>
                <div class="quantity-box">

                    <button
                        type="button"
                        class="decrease"
                        data-index="${index}"
                    >
                        -
                    </button>

                    <span>${item.quantity}</span>

                    <button
                        type="button"
                        class="increase"
                        data-index="${index}"
                    >
                        +
                    </button>

                </div>
            </td>

            <td>
                ₹${itemTotal.toFixed(2)}
            </td>

            <td>
                <a
                    href="#"
                    class="remove-item"
                    data-index="${index}"
                >
                    <img
                        src="Assests/icons/delete.png"
                        alt="Delete"
                        width="25"
                    >
                </a>
            </td>
        `;

        cartBody.appendChild(row);
    });
}


/* ============================================================
   INCREASE QUANTITY
============================================================ */

function increaseQuantity(index) {

    if (!cart[index]) {
        return;
    }

    cart[index].quantity++;

    localStorage.setItem(
        "biteboxCart",
        JSON.stringify(cart)
    );

    renderCart();
    updateOrderSummary();
    updateCartCount();
}


/* ============================================================
   DECREASE QUANTITY
============================================================ */

function decreaseQuantity(index) {

    if (!cart[index]) {
        return;
    }

    if (cart[index].quantity > 1) {
        cart[index].quantity--;
    }

    localStorage.setItem(
        "biteboxCart",
        JSON.stringify(cart)
    );

    renderCart();
    updateOrderSummary();
    updateCartCount();
}


/* ============================================================
   REMOVE ITEM
============================================================ */

function removeFromCart(index) {

    if (!cart[index]) {
        return;
    }

    cart.splice(index, 1);

    localStorage.setItem(
        "biteboxCart",
        JSON.stringify(cart)
    );

    renderCart();
    updateOrderSummary();
    updateCartCount();
}


/* ============================================================
   CART BUTTON EVENTS
============================================================ */

if (cartBody) {

    cartBody.addEventListener("click", function (event) {

        let button = event.target.closest("button");

        if (button) {

            let index =
                parseInt(button.dataset.index);

            if (button.classList.contains("increase")) {
                increaseQuantity(index);
            }

            if (button.classList.contains("decrease")) {
                decreaseQuantity(index);
            }
        }

        let link = event.target.closest("a");

        if (
            link &&
            link.classList.contains("remove-item")
        ) {

            event.preventDefault();

            let index =
                parseInt(link.dataset.index);

            removeFromCart(index);
        }
    });
}


/* ============================================================
   CLEAR CART
============================================================ */

function clearCart() {

    cart = [];

    localStorage.removeItem("biteboxCart");

    renderCart();
    updateOrderSummary();
    updateCartCount();
}


let clearCartButton =
    document.getElementById("clear-cart");


if (clearCartButton) {

    clearCartButton.addEventListener(
        "click",
        function () {

            clearCart();

        }
    );
}


/* ============================================================
   ORDER SUMMARY
============================================================ */

function calculateSubtotal() {

    let subtotal = 0;

    cart.forEach(function (item) {

        subtotal +=
            item.price * item.quantity;

    });

    return subtotal;
}


function calculateDeliveryCharge(subtotal) {

    if (subtotal === 0) {
        return 0;
    }

    return 40;
}


function calculatePackagingCharge(subtotal) {

    if (subtotal === 0) {
        return 0;
    }

    return 20;
}


function calculateDiscount(subtotal) {

    if (subtotal > 500) {

        return subtotal * 0.10;
    }

    return 0;
}


function calculateTotal(
    subtotal,
    deliveryCharge,
    packagingCharge,
    discount
) {

    return (
        subtotal +
        deliveryCharge +
        packagingCharge -
        discount
    );
}


function updateOrderSummary() {

    let subtotal =
        calculateSubtotal();

    let deliveryCharge =
        calculateDeliveryCharge(subtotal);

    let packagingCharge =
        calculatePackagingCharge(subtotal);

    let discount =
        calculateDiscount(subtotal);

    let total =
        calculateTotal(
            subtotal,
            deliveryCharge,
            packagingCharge,
            discount
        );


    let subtotalAmount =
        document.getElementById(
            "subtotal-amount"
        );

    let deliveryAmount =
        document.getElementById(
            "delivery-amount"
        );

    let packagingAmount =
        document.getElementById(
            "packaging-amount"
        );

    let discountAmount =
        document.getElementById(
            "discount-amount"
        );

    let totalAmount =
        document.getElementById(
            "total-amount"
        );


    if (subtotalAmount) {
        subtotalAmount.textContent =
            "₹" + subtotal.toFixed(2);
    }

    if (deliveryAmount) {
        deliveryAmount.textContent =
            "₹" + deliveryCharge.toFixed(2);
    }

    if (packagingAmount) {
        packagingAmount.textContent =
            "₹" + packagingCharge.toFixed(2);
    }

    if (discountAmount) {
        discountAmount.textContent =
            "-₹" + discount.toFixed(2);
    }

    if (totalAmount) {
        totalAmount.textContent =
            "₹" + total.toFixed(2);
    }
}


/* ============================================================
   CART COUNT
============================================================ */

function updateCartCount() {

    let cartCount = 0;

    cart.forEach(function (item) {

        cartCount += item.quantity;

    });

    let cartCountElement =
        document.getElementById("cart-count");

    if (cartCountElement) {

        cartCountElement.textContent =
            cartCount;
    }
}


/* ============================================================
   SEARCH
============================================================ */

let searchInput =
    document.getElementById("menu-search");

let searchButton =
    document.getElementById("search-button");


function searchMenu(searchText) {

    let searchValue =
        searchText.trim().toLowerCase();

    let menuCards =
        document.querySelectorAll(
            "#menu-items article"
        );


    menuCards.forEach(function (card) {

        let heading =
            card.querySelector("h3");

        if (!heading) {
            return;
        }

        let foodName =
            heading.textContent
                .trim()
                .toLowerCase();


        if (foodName.includes(searchValue)) {

            card.style.display = "";

        } else {

            card.style.display = "none";
        }
    });
}


if (searchButton && searchInput) {

    searchButton.addEventListener(
        "click",
        function () {

            searchMenu(searchInput.value);

        }
    );
}


if (searchInput) {

    searchInput.addEventListener(
        "input",
        function () {

            searchMenu(searchInput.value);

        }
    );
}


/* ============================================================
   CATEGORY FILTER
============================================================ */

let categoryCards =
    document.querySelectorAll(
        "#categories article"
    );


function filterMenu(category) {

    let menuCards =
        document.querySelectorAll(
            "#menu-items article"
        );

    let selectedCategory =
        category.trim().toLowerCase();


    menuCards.forEach(function (card) {

        let cardCategory =
            card.dataset.category;

        if (!cardCategory) {
            return;
        }

        cardCategory =
            cardCategory.trim().toLowerCase();


        if (
            cardCategory ===
            selectedCategory
        ) {

            card.style.display = "";

        } else {

            card.style.display = "none";
        }
    });
}


categoryCards.forEach(function (card) {

    card.addEventListener(
        "click",
        function () {

            let heading =
                card.querySelector("h3");

            if (!heading) {
                return;
            }

            let category =
                heading.textContent
                    .trim()
                    .toLowerCase();

            filterMenu(category);
        }
    );
});


/* ============================================================
   DAY / NIGHT THEME
============================================================ */

let themeButton =
    document.getElementById("theme-toggle");


function updateThemeButton() {

    if (!themeButton) {
        return;
    }

    let themeIcon =
        themeButton.querySelector(
            ".theme-icon"
        );

    let themeText =
        themeButton.querySelector(
            ".theme-text"
        );


    if (
        document.body.classList.contains(
            "dark-theme"
        )
    ) {

        if (themeIcon) {
            themeIcon.textContent = "☾";
        }

        if (themeText) {
            themeText.textContent =
                "NIGHT MODE";
        }

    } else {

        if (themeIcon) {
            themeIcon.textContent = "☀";
        }

        if (themeText) {
            themeText.textContent =
                "DAY MODE";
        }
    }
}


function toggleTheme() {

    document.body.classList.toggle(
        "dark-theme"
    );


    if (
        document.body.classList.contains(
            "dark-theme"
        )
    ) {

        localStorage.setItem(
            "biteboxTheme",
            "dark"
        );

    } else {

        localStorage.setItem(
            "biteboxTheme",
            "light"
        );
    }

    updateThemeButton();
}


function loadTheme() {

    let savedTheme =
        localStorage.getItem(
            "biteboxTheme"
        );


    document.body.classList.add(
        "theme-loading"
    );


    if (savedTheme === "dark") {

        document.body.classList.add(
            "dark-theme"
        );

    } else {

        document.body.classList.remove(
            "dark-theme"
        );
    }


    updateThemeButton();


    setTimeout(function () {

        document.body.classList.remove(
            "theme-loading"
        );

    }, 50);
}


if (themeButton) {

    themeButton.addEventListener(
        "click",
        function () {

            toggleTheme();

        }
    );
}


loadTheme();


/* ============================================================
   CONTACT FORM
============================================================ */

let contactForm =
    document.querySelector(
        ".right-column form"
    );


function showToast(message, type) {

    let toast =
        document.createElement("div");

    toast.className =
        "toast " + type;

    toast.textContent =
        message;

    document.body.appendChild(toast);


    setTimeout(function () {

        toast.classList.add("show");

    }, 100);


    setTimeout(function () {

        toast.classList.remove("show");

        setTimeout(function () {

            toast.remove();

        }, 300);

    }, 3000);
}


if (contactForm) {

    contactForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();

            showToast(
                "Message sent successfully!",
                "success"
            );

            contactForm.reset();

        }
    );
}


/* ============================================================
   MOCKAPI
   ADD / UPDATE MENU ITEM
============================================================ */

const API_URL =
    "https://6ac5df0dbea0e72cf5c8261e.mockapi.io/menu";

const addMenuBtn = document.getElementById("add-menu-btn");
const menuModal = document.getElementById("menu-modal");
const cancelMenuForm = document.getElementById("cancel-menu-form");
const menuForm = document.getElementById("menu-form");
const menuContainer = document.getElementById("menu-container");

/*
    null = Add mode
    ID   = Update mode
*/
let editingMenuId = null;


/* ============================================================
   OPEN ADD MENU MODAL
============================================================ */

if (addMenuBtn) {

    addMenuBtn.addEventListener("click", function () {

        editingMenuId = null;

        menuForm.reset();

        document.querySelector(".modal-header h2").textContent =
            "Add Menu Item";

        document.querySelector(
            "#menu-form button[type='submit']"
        ).textContent =
            "Add Menu Item";

        menuModal.classList.add("show");

    });

}


/* ============================================================
   CANCEL MODAL
============================================================ */
if (cancelMenuForm) {
    cancelMenuForm.addEventListener("click", function () {

        console.log("CANCEL BUTTON CLICKED");

        menuModal.classList.remove("show");
        menuModal.style.display = "none";

        editingMenuId = null;
        menuForm.reset();
    });
}

/* ============================================================
   ADD / UPDATE FORM SUBMIT
============================================================ */

if (menuForm) {

    menuForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        const name =
            document.getElementById("menu-name").value;

        const price =
            document.getElementById("menu-price").value;

        const category =
            document.getElementById("menu-category").value;

        const rating =
            document.getElementById("menu-rating").value;

        const reviews =
            document.getElementById("menu-reviews").value;

        const image =
            document.getElementById("menu-image").value;


        const menuItem = {
            name: name,
            price: price,
            category: category,
            rating: rating,
            reviews: reviews,
            image: image
        };


        try {

            /* =========================
               UPDATE MODE
            ========================= */

            if (editingMenuId !== null) {

                await updateMenuItem(
                    editingMenuId,
                    menuItem
                );

                editingMenuId = null;

            }

            /* =========================
               ADD MODE
            ========================= */

            else {

                const response = await fetch(API_URL, {

                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(menuItem)

                });


                if (!response.ok) {
                    throw new Error("Failed to add menu item");
                }


                const data = await response.json();

                console.log(
                    "Menu item added:",
                    data
                );

                //displayMenuItems([data]);

            }


            /* =========================
               CLOSE MODAL
            ========================= */

            menuModal.classList.remove("show");

            menuForm.reset();


        } catch (error) {

            console.error(
                "Error saving menu item:",
                error
            );

        }

    });

}


/* ============================================================
   UPDATE MENU BUTTON
============================================================ */

if (menuContainer) {

    menuContainer.addEventListener(
        "click",
        function (event) {

            const button =
                event.target.closest(".update-menu-btn");


            if (!button) {
                return;
            }


            const card =
                button.closest("article");


            if (!card) {
                return;
            }


            /* =========================
               GET MOCKAPI ID
            ========================= */

            const menuId =
                card.dataset.id;


            editingMenuId = menuId;


            console.log(
                "Editing Menu ID:",
                editingMenuId
            );


            /* =========================
               GET CURRENT VALUES
            ========================= */

            const menuName =
                card.querySelector("h3")
                    .textContent
                    .trim();


            const price =
                card.querySelector(".price")
                    .textContent
                    .replace("₹", "")
                    .trim();


            const rating =
                card.querySelector(".rating")
                    .childNodes[0]
                    .textContent
                    .trim();


            const reviews =
                card.querySelector(".rating small")
                    .textContent
                    .replace("(", "")
                    .replace(")", "")
                    .trim();


            const category =
                card.dataset.category;


            const image =
                card.querySelector("img")
                    .getAttribute("src");


            /* =========================
               PUT VALUES INTO FORM
            ========================= */

            document.getElementById("menu-name").value =
                menuName;

            document.getElementById("menu-price").value =
                price;

            document.getElementById("menu-category").value =
                category;

            document.getElementById("menu-rating").value =
                rating;

            document.getElementById("menu-reviews").value =
                reviews;

            document.getElementById("menu-image").value =
                image;


            /* =========================
               CHANGE MODAL TITLE
            ========================= */

            document.querySelector(
                ".modal-header h2"
            ).textContent =
                "Update Menu Item";


            /* =========================
               CHANGE BUTTON
            ========================= */

            document.querySelector(
                "#menu-form button[type='submit']"
            ).textContent =
                "Update Menu Item";


            /* =========================
               OPEN MODAL
            ========================= */

            menuModal.classList.add("show");

        }
    );

}


/* ============================================================
   UPDATE MENU ITEM
============================================================ */

async function updateMenuItem(menuId, menuItem) {

    try {

        const response = await fetch(
            API_URL + "/" + menuId,
            {
                method: "PUT",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(menuItem)
            }
        );


        if (!response.ok) {
            throw new Error("Failed to update menu item");
        }


        const data =
            await response.json();


        console.log(
            "Menu item updated:",
            data
        );


    } catch (error) {

        console.error(
            "Error updating menu item:",
            error
        );

    }

}

async function fetchMenuItems() {

    try {

        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Failed to fetch menu items");
        }

        const menuItems = await response.json();

        console.log("Menu items fetched:", menuItems);

        // Find your menu container
        const menuContainer =
            document.getElementById("menu-container");

        if (!menuContainer) {
            return;
        }

        // Clear existing API-generated cards
        menuContainer.innerHTML = "";

        menuItems.forEach(function (item) {

            const article =
                document.createElement("article");

            article.dataset.id = item.id;
            article.dataset.category = item.category;

            article.innerHTML = `
                <img src="${item.image}" alt="${item.name}">

                <h3>${item.name}</h3>

                <p class="price">₹${item.price}</p>

                <div class="rating">
                    ${item.rating} ⭐
                    <small>(${item.reviews})</small>
                </div>

                <button
                    type="button"
                    class="add-to-cart"
                >
                    Add to Cart
                </button>

                <button
                    type="button"
                    class="update-menu-btn"
                >
                    Update
                </button>
            `;

            menuContainer.appendChild(article);
        });

    } catch (error) {

        console.error(
            "Error fetching menu items:",
            error
        );

    }
}fetchMenuItems();