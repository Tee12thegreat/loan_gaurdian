document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    
    if (!currentUser) {
        window.location.href = 'index.html';
        return;
    }
    
    // Set user info in dashboard
    document.querySelector('.username').textContent = currentUser.name;
    document.querySelector('.user-role').textContent = currentUser.role.replace('-', ' ');
    
    // Add admin class to body if user is admin
    if (currentUser.role === 'admin') {
        document.body.classList.add('admin');
    }
    
    // Sample activity data (from your document)
    const activities = [
        { userId: "U001", userRole: "Loan Officer", action: "User Booted", module: "Loan Screening", timestamp: "2025-04-14 10:45:23 AM", reason: "Approved flagged fraudulent docs" },
        { userId: "U014", userRole: "Credit Analyst", action: "User Suspended", module: "Credit Risk Assessment", timestamp: "2025-04-14 11:02:11 AM", reason: "Tampered with risk score model" },
        { userId: "U023", userRole: "Fraud Analyst", action: "User Booted", module: "Alert & Reporting", timestamp: "2025-04-14 11:27:45 AM", reason: "Ignored multiple red-flag alerts" },
        { userId: "U037", userRole: "Customer", action: "Application Banned", module: "Loan Screening", timestamp: "2025-04-14 12:14:08 PM", reason: "Falsified income documentation" }
    ];
    
    // Populate activity table
    const activityTable = document.getElementById('activityTable').getElementsByTagName('tbody')[0];
    
    activities.forEach(activity => {
        const row = activityTable.insertRow();
        row.insertCell(0).textContent = activity.userId;
        row.insertCell(1).textContent = activity.userRole;
        row.insertCell(2).textContent = activity.action;
        row.insertCell(3).textContent = activity.module;
        row.insertCell(4).textContent = activity.timestamp;
        
        // Add hover effect to show reason
        row.title = `Reason: ${activity.reason}`;
    });
    
    // Boot user form handling
    const bootUserForm = document.getElementById('bootUserForm');
    
    if (bootUserForm) {
        bootUserForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const userId = document.getElementById('bootUserId').value;
            const reason = document.getElementById('bootReason').value;
            const module = document.getElementById('bootModule').value;
            
            if (!userId || !reason || !module) {
                alert('Please fill in all fields');
                return;
            }
            
            // In a real app, this would send to server
            const timestamp = new Date().toLocaleString();
            
            // Add to activity table
            const newRow = activityTable.insertRow(0);
            newRow.insertCell(0).textContent = userId;
            newRow.insertCell(1).textContent = "Unknown"; // Would get from server
            newRow.insertCell(2).textContent = "User Booted";
            newRow.insertCell(3).textContent = module;
            newRow.insertCell(4).textContent = timestamp;
            
            // Show success message
            alert(`User ${userId} has been booted from the system`);
            
            // Reset form
            bootUserForm.reset();
        });
    }
    
    // Logout button
    const logoutBtn = document.querySelector('.btn-logout');
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            sessionStorage.removeItem('currentUser');
            window.location.href = 'index.html';
        });
    }
});