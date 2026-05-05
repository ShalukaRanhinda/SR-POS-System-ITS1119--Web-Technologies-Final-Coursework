
class CustomerController {
    constructor() {
        this.initializeElements();
        this.bindEvents();
        this.loadCustomers();
        this.resetForm();
    }

    initializeElements() {
        this.idInput = document.getElementById('customerId');
        if (this.idInput) this.idInput.readOnly = true;
        this.nameInput = document.getElementById('customerName');
        this.emailInput = document.getElementById('customerEmail');
        this.nicInput = document.getElementById('customerNic');
        this.addressInput = document.getElementById('customerAddress');
        this.contactInput = document.getElementById('customerContact');

        this.saveBtn = document.getElementById('saveCustomerBtn');
        this.updateBtn = document.getElementById('updateCustomerBtn');
        this.deleteBtn = document.getElementById('deleteCustomerBtn');
        this.resetBtn = document.getElementById('resetCustomerBtn');

        this.tableBody = document.getElementById('customerTableBody');
    }

    bindEvents() {
        if (this.saveBtn) this.saveBtn.addEventListener('click', () => this.saveCustomer());
        if (this.updateBtn) this.updateBtn.addEventListener('click', () => this.updateCustomer());
        if (this.deleteBtn) this.deleteBtn.addEventListener('click', () => this.deleteCustomer());
        if (this.resetBtn) this.resetBtn.addEventListener('click', () => this.resetForm());

        if (this.tableBody) {
            this.tableBody.addEventListener('click', (e) => {
                const row = e.target.closest('tr');
                if (row) this.loadCustomerToForm(row);
            });
        }
    }

    loadCustomers() {
        if (!this.tableBody) return;

        const customers = CustomerModel.getAllCustomers();
        this.tableBody.innerHTML = '';

        customers.forEach(customer => {
            const row = this.tableBody.insertRow();
            row.insertCell(0).textContent = customer.id;
            row.insertCell(1).textContent = customer.name;
            row.insertCell(2).textContent = customer.email;
            row.insertCell(3).textContent = customer.nic;
            row.insertCell(4).textContent = customer.address;
            row.insertCell(5).textContent = customer.contact;
        });
    }

    saveCustomer() {
        try {
            const customer = {
                id: this.idInput.value || CustomerModel.generateNewId(),
                name: this.nameInput.value,
                email: this.emailInput.value,
                nic: this.nicInput.value,
                address: this.addressInput.value,
                contact: this.contactInput.value
            };

            CustomerModel.validate(customer);
            CustomerModel.addCustomer(customer);

            this.resetForm();
            this.loadCustomers();
            this.showMessage('Customer saved successfully!', 'success');
        } catch (error) {
            this.showMessage(error.message, 'error');
        }
    }

    updateCustomer() {
        try {
            if (!this.idInput.value) {
                throw new Error('Please select a customer to update');
            }

            const customer = {
                id: this.idInput.value,
                name: this.nameInput.value,
                email: this.emailInput.value,
                nic: this.nicInput.value,
                address: this.addressInput.value,
                contact: this.contactInput.value
            };

            CustomerModel.validate(customer);
            CustomerModel.updateCustomer(customer);

            this.resetForm();
            this.loadCustomers();
            this.showMessage('Customer updated successfully!', 'success');
        } catch (error) {
            this.showMessage(error.message, 'error');
        }
    }

    deleteCustomer() {
        try {
            if (!this.idInput.value) {
                throw new Error('Please select a customer to delete');
            }

            if (confirm('Are you sure you want to delete this customer?')) {
                CustomerModel.deleteCustomer(this.idInput.value);
                this.resetForm();
                this.loadCustomers();
                this.showMessage('Customer deleted successfully!', 'success');
            }
        } catch (error) {
            this.showMessage(error.message, 'error');
        }
    }

    resetForm() {
        if (this.idInput) this.idInput.value = CustomerModel.generateNewId();
        if (this.nameInput) this.nameInput.value = '';
        if (this.emailInput) this.emailInput.value = '';
        if (this.nicInput) this.nicInput.value = '';
        if (this.addressInput) this.addressInput.value = '';
        if (this.contactInput) this.contactInput.value = '';
    }

    loadCustomerToForm(row) {
        if (this.idInput) this.idInput.value = row.cells[0].textContent;
        if (this.nameInput) this.nameInput.value = row.cells[1].textContent;
        if (this.emailInput) this.emailInput.value = row.cells[2].textContent;
        if (this.nicInput) this.nicInput.value = row.cells[3].textContent;
        if (this.addressInput) this.addressInput.value = row.cells[4].textContent;
        if (this.contactInput) this.contactInput.value = row.cells[5].textContent;
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