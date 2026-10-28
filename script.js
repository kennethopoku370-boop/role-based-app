const registerForm = document.getElementById('registerForm');
if (registerForm) {
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const name = document.getElementById('regName').value;
        const email = document.getElementById('regEmail').value;
        const password = document.getElementById('regPassword').value;
        const role = document.getElementById('regRole').value;
        
        const userData = { name, email, password, role };
        localStorage.setItem('currentUser', JSON.stringify(userData));
        
        window.location.href = 'dashboard.html';
    });
}