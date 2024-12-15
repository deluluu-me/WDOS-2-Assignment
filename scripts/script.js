// Load medicines data and display them
fetch('./data/medicines.json')
    .then(response => response.json())
    .then(displayMedicines)
    .catch(error => console.error('Error loading medicines data:', error));

let order = []; // Global order array

// Load saved order from localStorage on page load
document.addEventListener('DOMContentLoaded', () => {
    order = JSON.parse(localStorage.getItem('order')) || [];
    if (order.length > 0) updateOrderSummary();
});

// Display medicines on the page
function displayMedicines(data) {
    Object.entries(data).forEach(([category, medicines]) => {
        const categoryElement = document.getElementById(category);
        if (!categoryElement) return;

        categoryElement.insertAdjacentHTML('beforebegin', `<h2>${capitalize(category)}</h2>`);

        const gridContainer = document.createElement('div');
        gridContainer.classList.add('grid-container');

        medicines.forEach(medicine => {
            gridContainer.innerHTML += `
                <div class="medicine">
                    <img src="${medicine.image}" alt="${medicine.name}" class="medicine-image">
                    <h3>${medicine.name}</h3>
                    <p>${medicine.description}</p>
                    <p>Price: $${medicine.price}</p>
                    <input type="number" id="quantity-${medicine.id}" value="0" min="0">
                    <button class="add-to-order-btn" data-id="${medicine.id}" data-category="${category}">Add to Order</button>
                </div>`;
        });

        categoryElement.appendChild(gridContainer);
    });

    document.querySelectorAll('.add-to-order-btn').forEach(button => {
        button.addEventListener('click', () => {
            const { id, category } = button.dataset;
            addToOrder(Number(id), category);
        });
    });
}

// Add selected medicine to the order
function addToOrder(id, category) {
    const quantityInput = document.getElementById(`quantity-${id}`);
    const quantity = parseInt(quantityInput.value, 10);

    if (!quantity || quantity <= 0) {
        alert('Please enter a quantity greater than zero.');
        return;
    }

    fetch('./data/medicines.json')
        .then(response => response.json())
        .then(data => {
            const medicine = data[category]?.find(m => m.id === id);
            if (!medicine) {
                alert('Medicine not found.');
                return;
            }

            const existingItem = order.find(item => item.id === id);
            existingItem ? (existingItem.quantity += quantity) : order.push({ ...medicine, quantity });

            quantityInput.value = 0;
            updateOrderSummary();
        })
        .catch(error => console.error('Error adding medicine to order:', error));
}

// Update the order summary
function updateOrderSummary() {
    const orderTableBody = document.querySelector('#orderTable tbody');
    orderTableBody.innerHTML = '';

    const totalPrice = order.reduce((total, item) => {
        orderTableBody.innerHTML += `
            <tr>
                <td>${item.name}</td>
                <td>${item.quantity}</td>
                <td>$${(item.price * item.quantity).toFixed(2)}</td>
            </tr>`;
        return total + item.price * item.quantity;
    }, 0);

    document.getElementById('totalPrice').textContent = `${totalPrice.toFixed(2)}`;
    localStorage.setItem('order', JSON.stringify(order));
}
// To capitalize string
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
// Save and apply favorite order
document.getElementById('saveFavBtn').addEventListener('click', () => {
    if (order.length === 0) return alert('No items to save.');
    localStorage.setItem('favouriteOrder', JSON.stringify(order));
    alert('Order saved as favorite.');
});
//Apply Fvourite
document.getElementById('applyFavBtn').addEventListener('click', () => {
    const savedOrder = JSON.parse(localStorage.getItem('favouriteOrder')) || [];
    if (savedOrder.length === 0) return alert('No favorite order found.');
    order = savedOrder;
    updateOrderSummary();
});
//Buy Now
document.getElementById('buyNowBtn').addEventListener('click', () => {
    if (order.length === 0) return alert('Please add items to your order.');
    alert('Redirecting to checkout...');
    window.location.href = 'checkout.html';
});
//Reset Cart
document.getElementById('resetCartBtn').addEventListener('click', () => {
    order = [];
    updateOrderSummary();
    localStorage.removeItem('order');
    alert('Cart has been reset.');
});
