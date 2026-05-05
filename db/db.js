

const db = {
    customers: [
        { id: 'C001', name: 'John Doe', email: 'john@email.com', nic: '123456789V', address: 'Colombo', contact: '0712345678' },
        { id: 'C002', name: 'Jane Smith', email: 'jane@email.com', nic: '987654321V', address: 'Kandy', contact: '0723456789' }
    ],
    items: [
        { code: 'I001', name: 'Laptop', price: 75000, qty: 10 },
        { code: 'I002', name: 'Mouse', price: 1500, qty: 50 },
        { code: 'I003', name: 'Keyboard', price: 3500, qty: 30 }
    ],
    orders: [],
    users: [
        { username: 'admin', password: 'admin123', name: 'Admin' }
    ]
};