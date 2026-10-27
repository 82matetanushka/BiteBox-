
/* ============================================================
   MOCKAPI - ADD / UPDATE MENU ITEM
============================================================ */

const API_URL =
    "https://6ac5df0dbea0e72cf5c8261e.mockapi.io/menu";

const addMenuBtn =
    document.getElementById("add-menu-btn");

const menuModal =
    document.getElementById("menu-modal");

const cancelMenuForm =
    document.getElementById("cancel-menu-form");

const menuForm =
    document.getElementById("menu-form");

/* Use the menu-items section when available */
const menuDisplayContainer =
    document.getElementById("menu-items") ||
    document.getElementById("menu-container");

let editingMenuId = null;


/* ============================================================
   OPEN MENU MODAL
============================================================ */

function openMenuModal() {

    if (!menuModal) return;

    menuModal.hidden = false;
    menuModal.style.display = "block";
    menuModal.classList.add("show");
}


/* ============================================================
   CLOSE MENU MODAL
============================================================ */

function closeMenuModal() {

    if (menuModal) {
        menuModal.classList.remove("show");
        menuModal.style.display = "none";
        menuModal.hidden = true;
    }

    editingMenuId = null;

    if (menuForm) {
        menuForm.reset();
    }

    const modalTitle =
        document.querySelector(".modal-header h2");

    const submitButton =
        menuForm
            ? menuForm.querySelector("button[type='submit']")
            : null;

    if (modalTitle) {
        modalTitle.textContent = "Add Menu Item";
    }

    if (submitButton) {
        submitButton.textContent = "Add Menu Item";
    }
}


/* ============================================================
   OPEN ADD MENU FORM
============================================================ */

if (addMenuBtn) {

    addMenuBtn.addEventListener("click", function () {

        editingMenuId = null;

        if (menuForm) {
            menuForm.reset();
        }

        const modalTitle =
            document.querySelector(".modal-header h2");

        const submitButton =
            menuForm
                ? menuForm.querySelector(
                    "button[type='submit']"
                )
                : null;

        if (modalTitle) {
            modalTitle.textContent = "Add Menu Item";
        }

        if (submitButton) {
            submitButton.textContent = "Add Menu Item";
        }

        openMenuModal();

    });
}


/* ============================================================
   CANCEL MENU FORM
============================================================ */

if (cancelMenuForm) {

    cancelMenuForm.addEventListener("click", function (event) {

        event.preventDefault();

        closeMenuModal();

    });
}


/* ============================================================
   ADD / UPDATE FORM SUBMIT
============================================================ */

if (menuForm) {

    menuForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        const name =
            document.getElementById("menu-name").value.trim();

        const price =
            Number(document.getElementById("menu-price").value);

        const category =
            document.getElementById("menu-category").value.trim();

        const rating =
            Number(document.getElementById("menu-rating").value);

        const reviews =
            Number(document.getElementById("menu-reviews").value);

        const image =
            document.getElementById("menu-image").value.trim();


        /* Validate form data */

        if (
            !name ||
            !category ||
            !image ||
            !Number.isFinite(price) ||
            price <= 0 ||
            !Number.isFinite(rating) ||
            rating < 0 ||
            rating > 5 ||
            !Number.isInteger(reviews) ||
            reviews < 0
        ) {

            alert("Please enter valid menu item details.");

            return;
        }


        const menuItem = {
            name: name,
            price: price,
            category: category,
            rating: rating,
            reviews: reviews,
            image: image
        };


        const submitButton =
            menuForm.querySelector("button[type='submit']");

        if (submitButton) {
            submitButton.disabled = true;
        }


        try {

            let response;

            /* UPDATE EXISTING MENU ITEM */

            if (editingMenuId !== null) {

                response = await fetch(
                    API_URL + "/" + encodeURIComponent(editingMenuId),
                    {
                        method: "PUT",

                        headers: {
                            "Content-Type": "application/json"
                        },

                        body: JSON.stringify(menuItem)
                    }
                );

            }

            /* ADD NEW MENU ITEM */

            else {

                response = await fetch(API_URL, {

                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(menuItem)

                });

            }


            if (!response.ok) {
                throw new Error(
                    "Unable to save menu item. HTTP " +
                    response.status
                );
            }


            const savedItem = await response.json();

            console.log("Menu item saved:", savedItem);


            await fetchMenuItems();

            closeMenuModal();

            alert(
                editingMenuId === null
                    ? "Menu item added successfully!"
                    : "Menu item updated successfully!"
            );


        } catch (error) {

            console.error("Error saving menu item:", error);

            alert(
                "Could not save menu item. Please check your connection and try again."
            );

        } finally {

            if (submitButton) {
                submitButton.disabled = false;
            }

        }

    });

}


/* ============================================================
   UPDATE MENU BUTTON
============================================================ */

if (menuDisplayContainer) {

    menuDisplayContainer.addEventListener(
        "click",
        function (event) {

            const button =
                event.target.closest(".update-menu-btn");

            if (!button) return;

            const card = button.closest("article");

            if (!card || !card.dataset.id) {
                alert("Menu item ID was not found.");
                return;
            }

            const nameElement =
                card.querySelector("h3");

            const priceElement =
                card.querySelector(".price");

            const ratingElement =
                card.querySelector(".rating");

            const reviewsElement =
                card.querySelector(".rating small");

            const imageElement =
                card.querySelector("img");


            if (
                !nameElement ||
                !priceElement ||
                !ratingElement ||
                !imageElement
            ) {
                console.error(
                    "Menu card is missing required information."
                );

                return;
            }


            editingMenuId = card.dataset.id;


            /* Fill the form */

            document.getElementById("menu-name").value =
                nameElement.textContent.trim();

            document.getElementById("menu-price").value =
                priceElement.textContent
                    .replace("₹", "")
                    .trim();

            document.getElementById("menu-category").value =
                card.dataset.category || "";

            document.getElementById("menu-rating").value =
                ratingElement.childNodes[0].textContent
                    .replace("⭐", "")
                    .trim();

            document.getElementById("menu-reviews").value =
                reviewsElement
                    ? reviewsElement.textContent
                        .replace(/[()]/g, "")
                        .trim()
                    : "0";

            document.getElementById("menu-image").value =
                imageElement.getAttribute("src") || "";


            /* Update modal title and button */

            const modalTitle =
                document.querySelector(".modal-header h2");

            const submitButton =
                menuForm
                    ? menuForm.querySelector(
                        "button[type='submit']"
                    )
                    : null;

            if (modalTitle) {
                modalTitle.textContent = "Update Menu Item";
            }

            if (submitButton) {
                submitButton.textContent = "Update Menu Item";
            }


            openMenuModal();

        }
    );

}


/* ============================================================
   FETCH MENU ITEMS FROM MOCKAPI
============================================================ */


/* ============================================================
   FETCH MENU ITEMS FROM MOCKAPI
============================================================ */

async function fetchMenuItems() {

    try {

        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Failed to fetch menu items");
        }

        const menuItems = await response.json();

        console.log("Menu items fetched:", menuItems);

        // IMPORTANT: Render inside menu-container,
        // not inside the entire menu-items section.
        const container =
            document.getElementById("menu-container");

        if (!container) {
            console.error("menu-container was not found in HTML.");
            return;
        }

        // Clear only the food cards, preserving the heading.
       

        menuItems.forEach(function (item) {

            const article = document.createElement("article");

            article.dataset.id = item.id;
            article.dataset.category =
                (item.category || "").toLowerCase();

            const image = document.createElement("img");
            image.src = item.image || "";
            image.alt = item.name || "Menu item";

            const heading = document.createElement("h3");
            heading.textContent = item.name || "Menu Item";

            const price = document.createElement("p");
            price.className = "price";
            price.textContent = "₹" + item.price;

            const rating = document.createElement("p");
            rating.className = "rating";

            rating.appendChild(
                document.createTextNode(
                    "★".repeat(
                        Math.max(
                            0,
                            Math.min(
                                5,
                                Math.floor(Number(item.rating) || 0)
                            )
                        )
                    ) + " "
                )
            );

            const reviews = document.createElement("small");
            reviews.textContent =
                "(" + (item.reviews ?? 0) + ")";

            rating.appendChild(reviews);

            const actions = document.createElement("div");
            actions.className = "menu-actions";

            
            const updateButton = document.createElement("button");
            updateButton.type = "button";
            updateButton.className = "update-menu-btn";
            updateButton.textContent = "Update";

            const addButton = document.createElement("button");
            addButton.type = "button";
            addButton.className = "add-to-cart";
            addButton.textContent = "Add to Cart";

            actions.appendChild(updateButton);

            article.append(
                image,
                heading,
                price,
                rating,
                actions,
                addButton
            );

            container.appendChild(article);

        });

        // Refresh cart information if those functions exist.
        if (typeof renderCart === "function") {
            renderCart();
        }

        if (typeof updateOrderSummary === "function") {
            updateOrderSummary();
        }

        if (typeof updateCartCount === "function") {
            updateCartCount();
        }

    } catch (error) {

        console.error("Error fetching menu items:", error);

    }

}

/* ============================================================
   LOAD MENU ITEMS
============================================================ */

fetchMenuItems();


/* =========================================================
   BITEBOX CART PAGE JAVASCRIPT
========================================================= */

const CART_STORAGE_KEY = "biteboxCart";

const cartTableBody = document.querySelector("#shopping-cart tbody");
const cartCountElement = document.getElementById("cart-count");
const subtotalElement = document.getElementById("subtotal-amount");
const deliveryElement = document.getElementById("delivery-amount");
const packagingElement = document.getElementById("packaging-amount");
const discountElement = document.getElementById("discount-amount");
const totalElement = document.getElementById("total-amount");
const clearCartButton = document.getElementById("clear-cart");
const checkoutButton = document.querySelector("#order-summary button");

/* Initial sample items */
const sampleCartItems = [
    {
        name: "Margherita Pizza",
        price: 249,
        image: "Assests/images/MargheritaPizza.png",
        quantity: 1
    },
    {
        name: "Cheese Burger",
        price: 189,
        image: "Assests/images/cheeseBurger1.png",
        quantity: 2
    },
    {
        name: "Creamy Pasta",
        price: 199,
        image: "Assests/images/AlofredapastaCard4.png",
        quantity: 1
    }
];

/* Load cart */
function getCartItems() {
    try {
        const savedCart = localStorage.getItem(CART_STORAGE_KEY);

        if (savedCart === null) {
            localStorage.setItem(
                CART_STORAGE_KEY,
                JSON.stringify(sampleCartItems)
            );

            return sampleCartItems.map(item => ({ ...item }));
        }

        const items = JSON.parse(savedCart);
        return Array.isArray(items) ? items : [];
    } catch (error) {
        console.error("Unable to load cart:", error);
        return [];
    }
}

let cartItems = getCartItems();

/* Save cart */
function saveCartItems() {
    localStorage.setItem(
        CART_STORAGE_KEY,
        JSON.stringify(cartItems)
    );
}

/* Format price */
function formatPrice(amount) {
    return "₹" + amount.toFixed(2);
}

/* Create text element safely */
function createTextElement(tag, className, text) {
    const element = document.createElement(tag);

    if (className) {
        element.className = className;
    }

    element.textContent = text;
    return element;
}

/* Calculate subtotal */
function getSubtotal() {
    return cartItems.reduce(function (sum, item) {
        return sum +
            (Number(item.price) || 0) *
            (Number(item.quantity) || 1);
    }, 0);
}

/* Update order summary */
function updateCartSummary() {
    const subtotal = getSubtotal();

    const delivery = subtotal === 0
        ? 0
        : subtotal >= 499 ? 0 : 40;

    const packaging = subtotal === 0 ? 0 : 10;

    const discount = 0;
    const total = subtotal + delivery + packaging;

    if (subtotalElement) {
        subtotalElement.textContent = formatPrice(subtotal);
    }

    if (deliveryElement) {
        deliveryElement.textContent = formatPrice(delivery);
    }

    if (packagingElement) {
        packagingElement.textContent = formatPrice(packaging);
    }

    if (discountElement) {
        discountElement.textContent = formatPrice(discount);
    }

    if (totalElement) {
        totalElement.textContent = formatPrice(total);
    }

    const summaryLabel = document.querySelector(
        "#order-summary p span:first-child"
    );

    if (summaryLabel) {
        const totalQuantity = cartItems.reduce(function (sum, item) {
            return sum + (Number(item.quantity) || 1);
        }, 0);

        summaryLabel.textContent =
            "Subtotal (" + totalQuantity + " Items)";
    }

    if (cartCountElement) {
        cartCountElement.textContent = cartItems.reduce(
            (sum, item) => sum + (Number(item.quantity) || 1),
            0
        );
    }

    if (checkoutButton) {
        checkoutButton.disabled = cartItems.length === 0;
    }

    return {
        subtotal: subtotal,
        delivery: delivery,
        packaging: packaging,
        discount: discount,
        total: total
    };
}

/* Display cart items */
function displayCartItems() {
    if (!cartTableBody) return;

    cartTableBody.replaceChildren();

    if (cartItems.length === 0) {
        const row = document.createElement("tr");
        const cell = document.createElement("td");

        cell.colSpan = 5;
        cell.textContent = "Your cart is empty. Start shopping!";
        cell.style.textAlign = "center";
        cell.style.padding = "30px";

        row.appendChild(cell);
        cartTableBody.appendChild(row);

        updateCartSummary();
        return;
    }

    cartItems.forEach(function (item, index) {
        const row = document.createElement("tr");

        /* Item details */
        const itemCell = document.createElement("td");

        const image = document.createElement("img");
        image.src = item.image || "";
        image.alt = item.name || "Food item";
        image.width = 80;

        const heading = createTextElement(
            "h3",
            "",
            item.name || "Menu Item"
        );

        itemCell.append(image, heading);

        /* Price */
        const priceCell = createTextElement(
            "td",
            "",
            formatPrice(Number(item.price) || 0)
        );

        /* Quantity controls */
        const quantityCell = document.createElement("td");

        const minusButton = createTextElement("button", "", "−");
        minusButton.type = "button";
        minusButton.dataset.action = "decrease";
        minusButton.dataset.index = index;

        const quantity = createTextElement(
            "span",
            "cart-quantity",
            String(Number(item.quantity) || 1)
        );

        quantity.style.margin = "0 12px";

        const plusButton = createTextElement("button", "", "+");
        plusButton.type = "button";
        plusButton.dataset.action = "increase";
        plusButton.dataset.index = index;

        quantityCell.append(
            minusButton,
            quantity,
            plusButton
        );

        /* Item total */
        const itemTotal =
            (Number(item.price) || 0) *
            (Number(item.quantity) || 1);

        const totalCell = createTextElement(
            "td",
            "",
            formatPrice(itemTotal)
        );

        /* Delete button */
        const actionCell = document.createElement("td");
        const deleteButton = document.createElement("button");

        deleteButton.type = "button";
        deleteButton.className = "cart-delete-button";
        deleteButton.dataset.action = "delete";
        deleteButton.dataset.index = index;
        deleteButton.setAttribute("aria-label", "Delete item");

        const deleteImage = document.createElement("img");
        deleteImage.src = "Assests/icons/delete.png";
        deleteImage.alt = "Delete";
        deleteImage.width = 25;

        deleteButton.appendChild(deleteImage);
        actionCell.appendChild(deleteButton);

        row.append(
            itemCell,
            priceCell,
            quantityCell,
            totalCell,
            actionCell
        );

        cartTableBody.appendChild(row);
    });

    updateCartSummary();
}

/* Quantity and delete button actions */
if (cartTableBody) {
    cartTableBody.addEventListener("click", function (event) {
        const button = event.target.closest("button[data-action]");

        if (!button) return;

        const index = Number(button.dataset.index);
        const action = button.dataset.action;

        if (!Number.isInteger(index) || !cartItems[index]) return;

        if (action === "increase") {
            cartItems[index].quantity =
                (Number(cartItems[index].quantity) || 1) + 1;
        }

        if (action === "decrease") {
            const quantity = Number(cartItems[index].quantity) || 1;

            if (quantity > 1) {
                cartItems[index].quantity = quantity - 1;
            } else {
                if (!confirm("Remove this item from your cart?")) return;

                cartItems.splice(index, 1);
            }
        }

        if (action === "delete") {
            if (!confirm("Remove this item from your cart?")) return;

            cartItems.splice(index, 1);
        }

        saveCartItems();
        displayCartItems();
    });
}

/* Clear entire cart */
if (clearCartButton) {
    clearCartButton.addEventListener("click", function () {
        if (cartItems.length === 0) {
            alert("Your cart is already empty.");
            return;
        }

        if (!confirm("Are you sure you want to clear your cart?")) {
            return;
        }

        cartItems = [];
        saveCartItems();
        displayCartItems();
    });
}

/* Checkout summary */
if (checkoutButton) {
    checkoutButton.addEventListener("click", function () {
        if (cartItems.length === 0) {
            alert("Your cart is empty.");
            return;
        }

        const summary = updateCartSummary();

        alert(
            "Your Order Summary\n\n" +
            "Subtotal: " + formatPrice(summary.subtotal) + "\n" +
            "Delivery: " + formatPrice(summary.delivery) + "\n" +
            "Packaging: " + formatPrice(summary.packaging) + "\n" +
            "Total Amount: " + formatPrice(summary.total) +
            "\n\nCheckout and payment are not connected yet."
        );
    });
}

/* Initialize cart */
displayCartItems();

/* ADD TO CART - ORIGINAL AND MOCKAPI MENU CARDS */

document.addEventListener("click", function (event) {
    const button = event.target.closest(".add-to-cart");

    if (!button) return;

    const card = button.closest("article");

    if (!card) return;

    const name = card.querySelector("h3")?.textContent.trim();

    const priceText = card.querySelector(".price")?.textContent || "";
    const price = Number(priceText.replace(/[^\d.]/g, ""));

    const image = card.querySelector("img")?.getAttribute("src") || "";

    if (!name || !Number.isFinite(price) || price <= 0) {
        alert("Unable to add this item. Please check its name and price.");
        return;
    }

    let cart = [];

    try {
        cart = JSON.parse(localStorage.getItem("biteboxCart")) || [];
        if (!Array.isArray(cart)) cart = [];
    } catch (error) {
        cart = [];
    }

    const existingItem = cart.find(item => item.name === name);

    if (existingItem) {
        existingItem.quantity = (Number(existingItem.quantity) || 1) + 1;
    } else {
        cart.push({
            name: name,
            price: price,
            image: image,
            quantity: 1
        });
    }

    localStorage.setItem("biteboxCart", JSON.stringify(cart));

    const cartCount = document.getElementById("cart-count");

    if (cartCount) {
        cartCount.textContent = cart.reduce(
            (sum, item) => sum + (Number(item.quantity) || 1),
            0
        );
    }

    alert(name + " added to cart successfully!");
});
