

class OrderModel {
    
    constructor(orderId, customerId, customerName, items, total, date) {
        this.orderId = orderId;
        this.customerId = customerId;
        this.customerName = customerName;
        this.items = items;
        this.total = total;
        this.date = date || new Date().toISOString();
    }

    // Get all orders
    static getAllOrders() {
        return db.orders;
    }

    // Add new order
    static addOrder(order) {
        // Update stock 
        order.items.forEach(item => {
            ItemModel.updateStock(item.code, item.quantity);
        });
        
        db.orders.push(order);
    }

    // Generate new order ID
    static generateOrderId() {
        const orders = this.getAllOrders();
        if (orders.length === 0) return 'ORD001';
        
        const lastId = orders[orders.length - 1].orderId;
        const num = parseInt(lastId.substring(3)) + 1;
        return `ORD${String(num).padStart(3, '0')}`;
    }

    // Get today's orders
    static getTodayOrders() {
        const orders = this.getAllOrders();
        const today = new Date().toDateString();
        return orders.filter(order => new Date(order.date).toDateString() === today);
    }

    // Get yesterday's orders
    static getYesterdayOrders() {
        const orders = this.getAllOrders();
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        return orders.filter(order => new Date(order.date).toDateString() === yesterday.toDateString());
    }

    // Calculate sales change percentage
    static getSalesChange() {
        const todayTotal = this.getTodayOrders().reduce((sum, order) => sum + order.total, 0);
        const yesterdayTotal = this.getYesterdayOrders().reduce((sum, order) => sum + order.total, 0);
        
        if (yesterdayTotal === 0) return todayTotal > 0 ? 100 : 0;
        return ((todayTotal - yesterdayTotal) / yesterdayTotal * 100).toFixed(1);
    }

    // Calculate orders change percentage
    static getOrdersChange() {
        const todayCount = this.getTodayOrders().length;
        const yesterdayCount = this.getYesterdayOrders().length;
        
        if (yesterdayCount === 0) return todayCount > 0 ? 100 : 0;
        return ((todayCount - yesterdayCount) / yesterdayCount * 100).toFixed(1);
    }
}

// Cart Item class for managing shopping cart
class CartItem {
    constructor(code, name, quantity, unitPrice) {
        this.code = code;
        this.name = name;
        this.quantity = parseInt(quantity);
        this.unitPrice = parseFloat(unitPrice);
        this.total = this.quantity * this.unitPrice;
    }

    static calculateTotal(items) {
        return items.reduce((sum, item) => sum + item.total, 0);
    }
}