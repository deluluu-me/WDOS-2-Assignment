// Initialize cart on page load
document.addEventListener('DOMContentLoaded', () => {
    const order = JSON.parse(localStorage.getItem('order')) || [];
    updateCheckoutSummary(order);

    // Toggle card details visibility based on payment method
    document.getElementById('payment-method').addEventListener('change', (e) => {
        document.getElementById('card-details').style.display = e.target.value === 'card' ? 'block' : 'none';
    });

    // Place order on button click
    document.getElementById('placeOrderBtn').addEventListener('click', () => {
        if (!order.length) return alert('Please add items to your cart before proceeding.');
        if (validateForms()) {
            alert('Your order has been placed!');
            localStorage.removeItem('order');
            window.location.href = 'index.html';
        }
    });
});

// Update checkout summary
function updateCheckoutSummary(order) {
    const orderTableBody = document.querySelector('#checkoutTable tbody');
    orderTableBody.innerHTML = '';

    const totalPrice = order.reduce((total, item) => {
        orderTableBody.innerHTML += `
            <tr>
                <td data-label="Item">${item.name}</td>
                <td data-label="Quantity">${item.quantity}</td>
                <td data-label="Price">$${item.price.toFixed(2)}</td>
                <td data-label="Subtotal">$${(item.price * item.quantity).toFixed(2)}</td>
            </tr>`;
        return total + item.price * item.quantity;
    }, 0);

    document.getElementById('checkoutTotal').textContent = `${totalPrice.toFixed(2)}`;
}

// Validate all forms
function validateForms() {
    const forms = ['personal-details-form', 'delivery-details-form', 'payment-details-form'];
    for (let formId of forms) {
        if (!document.getElementById(formId).checkValidity()) {
            alert('Please fill in all required fields.');
            return false;
        }
    }
    return true;
}
