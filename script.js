// Global arrays to store cart items and total cost
let cartItems = []; // Array to hold cart items
let cartTotal = 0; // Total cost of items in the cart
let attempts = 0; // Number of login attempts

// Array of sample login credentials
const credentials = [
    { username: "user123", password: "password123" },
    { username: "admin", password: "adminpass" },
    { username: "CAnuli", password: "wpcit2011" }
];

// Function to add items to the cart
function addToCart(itemName, itemPrice) {
    const existingItemIndex = cartItems.findIndex(item => item.name === itemName);
    if (existingItemIndex > -1) {
        cartItems[existingItemIndex].quantity += 1;
    } else {
        cartItems.push({ name: itemName, price: itemPrice, quantity: 1 });
    }
    cartTotal += itemPrice; // Update the total cost

    // Save cart data to LocalStorage
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    localStorage.setItem('cartTotal', cartTotal);

    // Update the cart
    updateCart();
}

// Function to update the cart display
function updateCart() {
    const cartItemCount = document.getElementById('cart-item-count');
    const cartItemsContainer = document.getElementById('cart-items-container');
    cartItemsContainer.innerHTML = ''; // Clear previous items
    let totalCost = 0; // Initialize total cost

    cartItems.forEach(item => {
        const itemCost = item.price * item.quantity; // Calculate cost based on quantity (days)
        totalCost += itemCost; // Update total cost

        cartItemsContainer.innerHTML += `
            <div class="cart-item">
                ${item.name} - $${item.price}/day
                <input type="number" class="days-input" value="${item.quantity}" min="1" onchange="updateItemQuantity('${item.name}', this.value, ${item.price})">
                Days
                <span>Cost: $${itemCost.toFixed(2)}</span> <!-- Display cost for this item -->
            </div>
        `;
    });

    if (cartItems.length > 0) {
        document.getElementById('checkout-button').style.display = 'block';
        document.getElementById('checkout-button').onclick = function() {
            const invoiceLink = `invoice.html?total=${totalCost}`;
            window.location.href = invoiceLink; // Redirect to invoice page with total cost
        };
    } else {
        document.getElementById('checkout-button').style.display = 'none';
    }

    cartItemCount.innerText = cartItems.length; // Update cart item count
}

// Function to update item quantity in the cart
function updateItemQuantity(itemName, quantity, itemPrice) {
    const itemIndex = cartItems.findIndex(item => item.name === itemName);
    if (itemIndex > -1) {
        cartItems[itemIndex].quantity = Number(quantity);
        if (cartItems[itemIndex].quantity <= 0) {
            cartItems.splice(itemIndex, 1); // Remove item if quantity is zero
        }
    }
    // Update the cart total based on the updated quantities
    cartTotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    
    // Save the updated cart to LocalStorage
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    localStorage.setItem('cartTotal', cartTotal);

    updateCart();
}

// Function to generate the invoice
function generateInvoice() {
    const storedCartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const storedCartTotal = parseFloat(localStorage.getItem('cartTotal')) || 0;

    if (storedCartItems.length === 0) {
        document.getElementById('invoice-details').innerHTML = "<p>No items in the cart.</p>";
        return;
    }

    const taxRate = 0.15; // 15% tax
    const discountRate = 0.1; // 10% discount for orders over $50,000
    const subtotal = storedCartTotal;
    const tax = subtotal * taxRate;
    const discount = subtotal > 50000 ? subtotal * discountRate : 0;
    const total = subtotal + tax - discount;

    const invoiceDetails = `
        <h2>Order Summary</h2>
        <p>Date: ${new Date().toLocaleDateString()}</p>
        <h3>Products:</h3>
        <ul>
            ${storedCartItems.map(item => `<li>${item.name}: $${item.price.toFixed(2)} for ${item.quantity} days (Total: $${(item.price * item.quantity).toFixed(2)})</li>`).join('')}
        </ul>
        <p>Subtotal: $${subtotal.toFixed(2)}</p>
        <p>Tax (15%): $${tax.toFixed(2)}</p>
        <p>Discount (10% if applicable): $${discount.toFixed(2)}</p>
        <h3>Total: $${total.toFixed(2)}</h3>
    `;

    document.getElementById('invoice-details').innerHTML = invoiceDetails;
}

// Function to cancel the order
function cancelOrder() {
    cartItems = [];
    cartTotal = 0;

    // Clear cart data from LocalStorage
    localStorage.removeItem('cartItems');
    localStorage.removeItem('cartTotal');

    alert("Order has been canceled.");
    window.location.href = 'products.html'; // Adjust to your products page
}

// Function to exit to the home page
function exitOrder() {
    window.location.href = 'about us.html'; // Change to your home page
}

// Login Form Logic
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('loginForm').addEventListener('submit', function(event) {
        event.preventDefault();

        let usernameInput = document.getElementById('username').value;
        let passwordInput = document.getElementById('password').value;
        let errorMessage = document.getElementById('error-message');

        // Check if the entered credentials match any in the credentials array
        const user = credentials.find(cred => cred.username === usernameInput && cred.password === passwordInput);

        if (user) {
            // Redirect to products page on successful login
            window.location.href = "products.html";
        } else {
            attempts++;
            if (attempts >= 3) {
                // Redirect to error page after 3 failed attempts
                window.location.href = "error.html";
            } else {
                errorMessage.textContent = "Invalid login, please try again.";
            }
        }
    });

    // Update the cart count on every page load
    updateCartCount();
});
const dropdowns = document.querySelectorAll('.dropdown');

dropdowns.forEach(dropdown => {
    dropdown.addEventListener('mouseenter', () => {
        const dropdownContent = dropdown.querySelector('.dropdown-content');
        const rect = dropdown.getBoundingClientRect();

        // Check if dropdown is offscreen and adjust position
        if (rect.right + dropdownContent.offsetWidth > window.innerWidth) {
            dropdownContent.style.left = 'auto'; // Reset left
            dropdownContent.style.right = '0'; // Align to the right
        }
    });
});

// Call generateInvoice() to display the invoice on page load if you're on the invoice page
if (window.location.pathname.endsWith('invoice.html')) {
    generateInvoice();
}
