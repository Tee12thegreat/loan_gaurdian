document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const registerLink = document.getElementById('registerLink');
    
    // Sample user data (in a real app, this would come from a server)
    const users = [
        { email: "admin@loanguardian.com", password: "admin123", role: "admin", name: "Admin User" },
        { email: "officer@loanguardian.com", password: "officer123", role: "loan-officer", name: "Loan Officer" },
        { email: "risk@loanguardian.com", password: "risk123", role: "risk-analyst", name: "Risk Analyst" },
        { email: "fraud@loanguardian.com", password: "fraud123", role: "fraud-analyst", name: "Fraud Analyst" },
        { email: "customer@example.com", password: "customer123", role: "customer", name: "Customer" }
    ];
    
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const role = document.getElementById('role').value;
        
        // Validate inputs
        if (!email || !password || !role) {
            alert('Please fill in all fields');
            return;
        }
        
        // Check if user exists
        const user = users.find(u => u.email === email && u.password === password && u.role === role);
        
        if (user) {
            // Store user in session (in a real app, you'd use proper session management)
            sessionStorage.setItem('currentUser', JSON.stringify(user));
            
            // Redirect to dashboard
            window.location.href = 'dashboard.html';
        } else {
            alert('Invalid credentials or role selection');
        }
    });
    
    registerLink.addEventListener('click', function(e) {
        e.preventDefault();
        alert('Please contact your system administrator to create an account');
    });
});