

class ItemModel {
    
    // Get all items
    static getAllItems() {
        return db.items;
    }

    // Add new item
    static addItem(item) {
        const items = this.getAllItems();
        
        // Check if code already exists
        if (items.some(i => i.code === item.code)) {
            throw new Error('Item code already exists!');
        }
        
        items.push(item);
    }

    // Update existing item
    static updateItem(updatedItem) {
        const index = db.items.findIndex(i => i.code === updatedItem.code);
        if (index !== -1) {
            db.items[index] = updatedItem;
        }
    }

    // Delete item
    static deleteItem(code) {
        db.items = db.items.filter(i => i.code !== code);
    }

    // Search item by code
    static searchItem(code) {
        const items = this.getAllItems();
        return items.find(i => i.code === code);
    }

    // Search items by keyword
    static searchItems(keyword) {
        const items = this.getAllItems();
        if (!keyword) return items;
        return items.filter(item => 
            item.code.toLowerCase().includes(keyword.toLowerCase()) ||
            item.name.toLowerCase().includes(keyword.toLowerCase())
        );
    }

    // Auto-generate new item code
    static generateNewCode() {
        const items = this.getAllItems();
        if (items.length === 0) return 'I001';
        
        const lastCode = items[items.length - 1].code;
        const num = parseInt(lastCode.substring(1)) + 1;
        return `I${String(num).padStart(3, '0')}`;
    }

    // Update stock when order is placed
    static updateStock(code, quantitySold) {
        const item = this.searchItem(code);
        if (item) {
            item.qty -= quantitySold;
            this.updateItem(item);
        }
    }

    // Validate item data
    static validate(item) {
        if (!item.code) throw new Error('Item code is required');
        if (!item.name) throw new Error('Item name is required');
        if (!item.price || item.price <= 0) throw new Error('Price must be greater than 0');
        if (item.qty === undefined || item.qty < 0) throw new Error('Quantity cannot be negative');
        return true;
    }
}