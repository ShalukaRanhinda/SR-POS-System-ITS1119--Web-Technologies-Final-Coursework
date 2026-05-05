

class DashboardModel {
    static getTotalSales() {
        const orders = db.orders;
        return orders.reduce((sum, order) => sum + order.total, 0);
    }

    static getCustomerCount() {
        return db.customers.length;
    }

    static getItemCount() {
        return db.items.length;
    }

    static getLowStockItems() {
        return db.items.filter(item => item.qty < 10);
    }
}
