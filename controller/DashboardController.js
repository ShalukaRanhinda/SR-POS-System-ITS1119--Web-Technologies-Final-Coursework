
class DashboardController {
    constructor() {
        this.updateDashboard();
    }

    updateDashboard() {
        // Update Total Sales
        const totalSales = DashboardModel.getTotalSales();
        const totalSalesElem = document.getElementById('totalSales');
        if (totalSalesElem) {
            totalSalesElem.textContent = `RS ${totalSales.toLocaleString('en-IN', {minimumFractionDigits: 2})}`;
        }
        
        // Update Orders Today
        const ordersToday = OrderModel.getTodayOrders().length;
        const ordersTodayElem = document.getElementById('ordersToday');
        if (ordersTodayElem) ordersTodayElem.textContent = ordersToday;
        
        // Update Total Customers
        const totalCustomers = DashboardModel.getCustomerCount();
        const totalCustomersElem = document.getElementById('totalCustomers');
        if (totalCustomersElem) totalCustomersElem.textContent = totalCustomers;
        
        // Update Stock Items
        const stockItems = DashboardModel.getItemCount();
        const stockItemsElem = document.getElementById('stockItems');
        if (stockItemsElem) stockItemsElem.textContent = stockItems;
        
        // Update Sales Change
        const salesChange = OrderModel.getSalesChange();
        const salesChangeElem = document.getElementById('salesChange');
        if (salesChangeElem) {
            salesChangeElem.textContent = `${Math.abs(salesChange)}% from yesterday`;
            if (salesChange < 0) {
                salesChangeElem.classList.remove('positive');
                salesChangeElem.classList.add('negative');
            } else {
                salesChangeElem.classList.remove('negative');
                salesChangeElem.classList.add('positive');
            }
        }
        
        // Update Orders Change
        const ordersChange = OrderModel.getOrdersChange();
        const ordersChangeElem = document.getElementById('ordersChange');
        if (ordersChangeElem) {
            ordersChangeElem.textContent = `${Math.abs(ordersChange)}% from yesterday`;
            if (ordersChange < 0) {
                ordersChangeElem.classList.remove('positive');
                ordersChangeElem.classList.add('negative');
            } else {
                ordersChangeElem.classList.remove('negative');
                ordersChangeElem.classList.add('positive');
            }
        }
        
        // Update New Items 
        const newItems = DashboardModel.getLowStockItems().length;
        const newItemsElem = document.getElementById('newItems');
        if (newItemsElem) {
            newItemsElem.textContent = `${newItems} new items`;
            if (newItems > 0) {
                newItemsElem.style.color = '#ed8936';
            }
        }

        // Update Recent Orders Table
        const recentOrdersTableBody = document.getElementById('recentOrdersTableBody');
        if (recentOrdersTableBody) {
            recentOrdersTableBody.innerHTML = '';
            const allOrders = OrderModel.getAllOrders() || [];
            // Get last 5 orders
            const recentOrders = allOrders.slice(-5).reverse();
            
            recentOrders.forEach(order => {
                const row = recentOrdersTableBody.insertRow();
                row.insertCell(0).textContent = order.orderId;
                
                // Format date nicely
                const dateObj = new Date(order.date);
                const formattedDate = dateObj.toLocaleDateString() + ' ' + dateObj.toLocaleTimeString();
                
                row.insertCell(1).textContent = formattedDate;
                row.insertCell(2).textContent = order.customerId;
                row.insertCell(3).textContent = `RS ${order.total.toLocaleString('en-IN', {minimumFractionDigits: 2})}`;
            });
            
            if (recentOrders.length === 0) {
                const row = recentOrdersTableBody.insertRow();
                const cell = row.insertCell(0);
                cell.colSpan = 4;
                cell.textContent = "No recent orders found.";
                cell.style.textAlign = "center";
            }
        }
    }
}