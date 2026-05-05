

class ItemController {
    constructor() {
        this.initializeElements();
        this.bindEvents();
        this.loadItems();
        this.resetForm();
    }

    initializeElements() {
        this.codeInput = document.getElementById('itemCode');
        if (this.codeInput) this.codeInput.readOnly = true;
        this.nameInput = document.getElementById('itemName');
        this.priceInput = document.getElementById('itemPrice');
        this.qtyInput = document.getElementById('itemQty');
        
        this.saveBtn = document.getElementById('saveItemBtn');
        this.updateBtn = document.getElementById('updateItemBtn');
        this.deleteBtn = document.getElementById('deleteItemBtn');
        this.resetBtn = document.getElementById('resetItemBtn');
        
        this.searchInput = document.getElementById('itemSearch');
        this.tableBody = document.getElementById('itemTableBody');
    }

    bindEvents() {
        if (this.saveBtn) this.saveBtn.addEventListener('click', () => this.saveItem());
        if (this.updateBtn) this.updateBtn.addEventListener('click', () => this.updateItem());
        if (this.deleteBtn) this.deleteBtn.addEventListener('click', () => this.deleteItem());
        if (this.resetBtn) this.resetBtn.addEventListener('click', () => this.resetForm());
        if (this.searchInput) this.searchInput.addEventListener('input', () => this.searchItems());
        
        if (this.tableBody) {
            this.tableBody.addEventListener('click', (e) => {
                const row = e.target.closest('tr');
                if (row) this.loadItemToForm(row);
            });
        }
    }

    loadItems() {
        const items = ItemModel.getAllItems();
        this.renderItems(items);
    }

    searchItems() {
        const keyword = this.searchInput.value;
        const items = ItemModel.searchItems(keyword);
        this.renderItems(items);
    }

    renderItems(items) {
        if (!this.tableBody) return;
        
        this.tableBody.innerHTML = '';
        
        items.forEach(item => {
            const row = this.tableBody.insertRow();
            row.insertCell(0).textContent = item.code;
            row.insertCell(1).textContent = item.name;
            row.insertCell(2).textContent = `RS ${item.price.toLocaleString('en-IN')}`;
            row.insertCell(3).textContent = item.qty;
            
            //  low stock items
            if (item.qty < 10) {
                row.cells[3].style.color = '#f56565';
                row.cells[3].style.fontWeight = 'bold';
            }
        });
    }

    saveItem() {
        try {
            const item = {
                code: this.codeInput.value || ItemModel.generateNewCode(),
                name: this.nameInput.value,
                price: parseFloat(this.priceInput.value),
                qty: parseInt(this.qtyInput.value)
            };
            
            ItemModel.validate(item);
            ItemModel.addItem(item);
            
            this.resetForm();
            this.loadItems();
            this.showMessage('Item saved successfully!', 'success');
        } catch (error) {
            this.showMessage(error.message, 'error');
        }
    }

    updateItem() {
        try {
            if (!this.codeInput.value) {
                throw new Error('Please select an item to update');
            }
            
            const item = {
                code: this.codeInput.value,
                name: this.nameInput.value,
                price: parseFloat(this.priceInput.value),
                qty: parseInt(this.qtyInput.value)
            };
            
            ItemModel.validate(item);
            ItemModel.updateItem(item);
            
            this.resetForm();
            this.loadItems();
            this.showMessage('Item updated successfully!', 'success');
        } catch (error) {
            this.showMessage(error.message, 'error');
        }
    }

    deleteItem() {
        try {
            if (!this.codeInput.value) {
                throw new Error('Please select an item to delete');
            }
            
            if (confirm('Are you sure you want to delete this item?')) {
                ItemModel.deleteItem(this.codeInput.value);
                this.resetForm();
                this.loadItems();
                this.showMessage('Item deleted successfully!', 'success');
            }
        } catch (error) {
            this.showMessage(error.message, 'error');
        }
    }

    resetForm() {
        if (this.codeInput) this.codeInput.value = ItemModel.generateNewCode();
        if (this.nameInput) this.nameInput.value = '';
        if (this.priceInput) this.priceInput.value = '';
        if (this.qtyInput) this.qtyInput.value = '';
    }

    loadItemToForm(row) {
        if (this.codeInput) this.codeInput.value = row.cells[0].textContent;
        if (this.nameInput) this.nameInput.value = row.cells[1].textContent;
        if (this.priceInput) this.priceInput.value = row.cells[2].textContent.replace('RS ', '').replace(/,/g, '');
        if (this.qtyInput) this.qtyInput.value = row.cells[3].textContent;
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