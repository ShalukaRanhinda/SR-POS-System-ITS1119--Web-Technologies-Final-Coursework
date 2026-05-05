
class LoginController {
    constructor() {
        this.initializeElements();
        this.bindEvents();
        this.checkSession();
    }

    initializeElements() {
        this.loginBtn = document.getElementById('loginBtn');
        this.usernameInput = document.getElementById('username');
        this.passwordInput = document.getElementById('password');
        this.loginSection = document.getElementById('loginSection');
        this.appSection = document.getElementById('appSection');
        this.userNameSpan = document.getElementById('userName');
    }

    bindEvents() {
        if (this.loginBtn) {
            this.loginBtn.addEventListener('click', () => this.login());
        }
        
        // Enter key support
        if (this.usernameInput) {
            this.usernameInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.login();
            });
        }
        
        if (this.passwordInput) {
            this.passwordInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.login();
            });
        }
    }

    checkSession() {
        if (sessionStorage.getItem('loggedIn') === 'true') {
            this.showApp();
            if (window.appController) {
                window.appController.onLoginSuccess();
            }
        }
    }

    login() {
        const username = this.usernameInput.value.trim();
        const password = this.passwordInput.value.trim();
        
        if (!username || !password) {
            this.showMessage('Please enter username and password', 'error');
            return;
        }
        
        const user = LoginModel.authenticate(username, password);
        
        if (user) {
            sessionStorage.setItem('loggedIn', 'true');
            sessionStorage.setItem('currentUser', user.name);
            this.showApp();
            
            if (window.appController) {
                window.appController.onLoginSuccess();
            }
        } else {
            this.showMessage('Invalid username or password', 'error');
        }
    }

    showApp() {
        if (this.loginSection) this.loginSection.style.display = 'none';
        if (this.appSection) this.appSection.style.display = 'flex';
        if (this.userNameSpan) {
            this.userNameSpan.textContent = sessionStorage.getItem('currentUser') || 'Admin';
        }
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

    static logout() {
        sessionStorage.removeItem('loggedIn');
        sessionStorage.removeItem('currentUser');
        location.reload();
    }
}