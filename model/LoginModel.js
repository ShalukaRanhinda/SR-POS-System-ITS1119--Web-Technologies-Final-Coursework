class LoginModel {
    static authenticate(username, password) {
        return db.users.find(u => u.username === username && u.password === password);
    }
}