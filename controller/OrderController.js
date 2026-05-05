

class OrderController {
    constructor() {
        this.cart = [];
        this.initializeElements();
        this.bindEvents();
    }

    initializeElements() {
        this.customerIdInput = document.getElementById('orderCustomerId');
        this.customerNameInput = document.getElementById('orderCustomerName');
        this.itemCodeInput = document.getElementById('orderItemCode');
        this.itemNameInput = document.getElementById('orderItemName');
        this.itemPriceInput = document.getElementById('orderItemPrice');
        this.itemQtyInput = document.getElementById('orderItemQty');
        
        this.addToCartBtn = document.getElementById('addToCartBtn');
        this.placeOrderBtn = document.getElementById('placeOrderBtn');
        this.cartTableBody = document.getElementById('cartTableBody');
        this.netTotalSpan = document.getElementById('netTotal');
    }

    bindEvents() {
        if (this.customerIdInput) {
            this.customerIdInput.addEventListener('blur', () => this.loadCustomer());
        }
        
        if (this.itemCodeInput) {
            this.itemCodeInput.addEventListener('blur', () => this.loadItem());
        }
        
        if (this.addToCartBtn) {
            this.addToCartBtn.addEventListener('click', () => this.addToCart());
        }
        
        if (this.placeOrderBtn) {
            this.placeOrderBtn.addEventListener('click', () => this.placeOrder());
        }
        
        if (this.itemQtyInput) {
            this.itemQtyInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.addToCart();
            });
        }
    }

    loadCustomer() {
        const customerId = this.customerIdInput.value;
        const customer = CustomerModel.searchCustomer(customerId);
        
        if (customer) {
            this.customerNameInput.value = customer.name;
        } else {
            this.customerNameInput.value = '';
            if (customerId) {
                this.showMessage('Customer not found!', 'error');
            }
        }
    }

    loadItem() {
        const itemCode = this.itemCodeInput.value;
        const item = ItemModel.searchItem(itemCode);
        
        if (item) {
            this.itemNameInput.value = item.name;
            this.itemPriceInput.value = item.price;
            this.itemQtyInput.focus();
            this.itemQtyInput.max = item.qty;
        } else {
            this.itemNameInput.value = '';
            this.itemPriceInput.value = '';
            if (itemCode) {
                this.showMessage('Item not found!', 'error');
            }
        }
    }

    addToCart() {
        try {
            const itemCode = this.itemCodeInput.value;
            const itemName = this.itemNameInput.value;
            const unitPrice = parseFloat(this.itemPriceInput.value);
            const quantity = parseInt(this.itemQtyInput.value);
            
            if (!itemCode) throw new Error('Please enter item code');
            if (!itemName) throw new Error('Item not found');
            if (!quantity || quantity <= 0) throw new Error('Please enter valid quantity');
            
            // Check stock 
            const item = ItemModel.searchItem(itemCode);
            if (item && quantity > item.qty) {
                throw new Error(`Only ${item.qty} items available in stock!`);
            }
            
            // Check if item 
            const existingItem = this.cart.find(i => i.code === itemCode);
            if (existingItem) {
                existingItem.quantity += quantity;
                existingItem.total = existingItem.quantity * existingItem.unitPrice;
            } else {
                const cartItem = new CartItem(itemCode, itemName, quantity, unitPrice);
                this.cart.push(cartItem);
            }
            
            // Clear inputs
            this.itemCodeInput.value = '';
            this.itemNameInput.value = '';
            this.itemPriceInput.value = '';
            this.itemQtyInput.value = '';
            this.itemCodeInput.focus();
            
            this.renderCart();
            this.updateTotal();
            this.showMessage('Item added to cart!', 'success');
            
        } catch (error) {
            this.showMessage(error.message, 'error');
        }
    }

    removeFromCart(index) {
        this.cart.splice(index, 1);
        this.renderCart();
        this.updateTotal();
    }

    renderCart() {
        if (!this.cartTableBody) return;
        
        this.cartTableBody.innerHTML = '';
        
        this.cart.forEach((item, index) => {
            const row = this.cartTableBody.insertRow();
            row.insertCell(0).textContent = item.code;
            row.insertCell(1).textContent = item.quantity;
            row.insertCell(2).textContent = `RS ${item.unitPrice.toLocaleString('en-IN')}`;
            row.insertCell(3).textContent = `RS ${item.total.toLocaleString('en-IN')}`;
            
            const removeBtn = document.createElement('button');
            removeBtn.textContent = 'Remove';
            removeBtn.className = 'remove-cart';
            removeBtn.onclick = () => this.removeFromCart(index);
            
            const actionCell = row.insertCell(4);
            actionCell.appendChild(removeBtn);
        });
    }

    updateTotal() {
        const total = CartItem.calculateTotal(this.cart);
        if (this.netTotalSpan) {
            this.netTotalSpan.textContent = `LKR ${total.toLocaleString('en-IN', {minimumFractionDigits: 2})}`;
        }
    }

    placeOrder() {
        try {
            if (!this.customerIdInput.value) {
                throw new Error('Please enter customer ID');
            }
            
            if (!this.customerNameInput.value) {
                throw new Error('Customer not found');
            }
            
            if (this.cart.length === 0) {
                throw new Error('Cart is empty!');
            }
            
            const orderId = OrderModel.generateOrderId();
            const total = CartItem.calculateTotal(this.cart);
            
            const order = new OrderModel(
                orderId,
                this.customerIdInput.value,
                this.customerNameInput.value,
                [...this.cart],
                total,
                new Date().toISOString()
            );
            
            OrderModel.addOrder(order);
            
            // Clear cart and form
            this.cart = [];
            this.renderCart();
            this.updateTotal();
            this.customerIdInput.value = '';
            this.customerNameInput.value = '';
            
            this.showMessage(`Order ${orderId} placed successfully! Total: RS ${total.toLocaleString('en-IN')}`, 'success');
            
            // Refresh dashboard stats
            if (window.dashboardController) {
                window.dashboardController.updateDashboard();
            }
            
            // Refresh items list
            if (window.itemController) {
                window.itemController.loadItems();
            }
            
        } catch (error) {
            this.showMessage(error.message, 'error');
        }
    }

    showMessage(message, type) {
        const msgDiv = document.createElement('div');
        msgDiv.className = 'toast-message';
        msgDiv.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            padding: 12px 24px;
            border-radius: 8px;
            background-color: ${type === 'success' ? '#48bb78' : '#f56565'};
            color: white;
            font-weight: 500;
            z-index: 1000;
            animation: slideIn 0.3s ease;
        `;
        msgDiv.textContent = message;
        document.body.appendChild(msgDiv);
        
        setTimeout(() => {
            msgDiv.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => msgDiv.remove(), 300);
        }, 3000);
    }
}