

class CustomerModel {
    
    // Get all customers
    static getAllCustomers() {
        return db.customers;
    }

    // Add new customer
    static addCustomer(customer) {
        const customers = this.getAllCustomers();
        
        // Check if ID already exists
        if (customers.some(c => c.id === customer.id)) {
            throw new Error('Customer ID already exists!');
        }
        
        customers.push(customer);
    }

    // Update existing customer
    static updateCustomer(updatedCustomer) {
        const index = db.customers.findIndex(c => c.id === updatedCustomer.id);
        if (index !== -1) {
            db.customers[index] = updatedCustomer;
        }
    }

    // Delete customer
    static deleteCustomer(id) {
        db.customers = db.customers.filter(c => c.id !== id);
    }

    // Search customer by ID
    static searchCustomer(id) {
        const customers = this.getAllCustomers();
        return customers.find(c => c.id === id);
    }

    // Auto-generate new customer ID
    static generateNewId() {
        const customers = this.getAllCustomers();
        if (customers.length === 0) return 'C001';
        
        const lastId = customers[customers.length - 1].id;
        const num = parseInt(lastId.substring(1)) + 1;
        return `C${String(num).padStart(3, '0')}`;
    }

    // Validate customer data
    static validate(customer) {
        if (!customer.id) throw new Error('Customer ID is required');
        if (!customer.name) throw new Error('Customer Name is required');
        if (!customer.email) throw new Error('Email is required');
        if (!customer.nic) throw new Error('NIC is required');
        if (!customer.address) throw new Error('Address is required');
        if (!customer.contact) throw new Error('Contact is required');
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(customer.email)) throw new Error('Invalid email format');
        
        // Contact validation (10 digits)
        const phoneRegex = /^[0-9]{10}$/;
        if (!phoneRegex.test(customer.contact)) throw new Error('Contact must be 10 digits');
        
        return true;
    }
}