

class AppController {
    constructor() {
        this.initializeApp();
    }

    initializeApp() {
        // Setup navigation
        this.setupNavigation();
        
        // Setup logout
        this.setupLogout();
    }

    setupNavigation() {
        const navBtns = document.querySelectorAll('.nav-btn:not(#logoutBtn)');
        
        navBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Update active button
                document.querySelectorAll('.nav-btn').forEach(b => 
                    b.classList.remove('active')
                );
                btn.classList.add('active');
                
                // Show selected page
                document.querySelectorAll('.page').forEach(page => 
                    page.classList.remove('active')
                );
                
                const pageId = btn.getAttribute('data-page') + 'Page';
                document.getElementById(pageId).classList.add('active');

                if (pageId === 'dashboardPage' && window.dashboardController) {
                    window.dashboardController.updateDashboard();
                } else if (pageId === 'itemsPage' && window.itemController) {
                    window.itemController.loadItems();
                } else if (pageId === 'customersPage' && window.customerController) {
                    window.customerController.loadCustomers();
                }
            });
        });
    }

    setupLogout() {
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                LoginController.logout();
            });
        }
    }

    //  successful login
    onLoginSuccess() {
        setTimeout(() => {
            window.dashboardController = new DashboardController();
            window.customerController = new CustomerController();
            window.itemController = new ItemController();
            window.orderController = new OrderController();
        }, 100);
    }
}

// Initialize app 
document.addEventListener('DOMContentLoaded', () => {
    window.appController = new AppController();
    window.loginController = new LoginController();
});