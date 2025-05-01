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
    
    // Sample activity data
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
    
    // Tab functionality
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs and contents
            tabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding content
            tab.classList.add('active');
            const tabId = tab.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });
    
    // Chart.js Initialization
    // Effectiveness Chart
    const effectivenessCtx = document.getElementById('effectivenessChart').getContext('2d');
    const effectivenessChart = new Chart(effectivenessCtx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [{
                label: 'Fraud Detection Rate',
                data: [65, 59, 70, 71, 76, 75, 80, 82, 85, 87, 90, 92],
                borderColor: '#4B0082',
                backgroundColor: 'rgba(75, 0, 130, 0.1)',
                borderWidth: 2,
                tension: 0.3,
                fill: true
            }, {
                label: 'False Positives',
                data: [25, 22, 20, 18, 15, 14, 12, 10, 9, 8, 7, 6],
                borderColor: '#FF9800',
                backgroundColor: 'rgba(255, 152, 0, 0.1)',
                borderWidth: 2,
                tension: 0.3,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Percentage (%)'
                    }
                }
            }
        }
    });
    
    // Fraud Types Chart
    const fraudTypesCtx = document.getElementById('fraudTypesChart').getContext('2d');
    const fraudTypesChart = new Chart(fraudTypesCtx, {
        type: 'doughnut',
        data: {
            labels: ['Identity Theft', 'Loan App Fraud', 'Insider Fraud', 'Digital Fraud'],
            datasets: [{
                data: [29.4, 27.5, 19.6, 23.5],
                backgroundColor: [
                    '#4B0082',
                    '#6A5ACD',
                    '#9370DB',
                    '#C9A0DC'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right'
                }
            }
        }
    });
    
    // Risk Assessment Chart
    const riskAssessmentCtx = document.getElementById('riskAssessmentChart').getContext('2d');
    const riskAssessmentChart = new Chart(riskAssessmentCtx, {
        type: 'bar',
        data: {
            labels: ['High Accuracy', 'Moderate Accuracy', 'Low Accuracy'],
            datasets: [{
                label: 'Before Verification',
                data: [30, 50, 20],
                backgroundColor: '#FF6B6B'
            }, {
                label: 'After Verification',
                data: [55, 35, 10],
                backgroundColor: '#4B0082'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Percentage (%)'
                    }
                }
            }
        }
    });
    
    // NPL Trend Chart
    const nplTrendCtx = document.getElementById('nplTrendChart').getContext('2d');
    const nplTrendChart = new Chart(nplTrendCtx, {
        type: 'line',
        data: {
            labels: ['2021', '2022', '2023', '2024'],
            datasets: [{
                label: 'NPL Rate (%)',
                data: [6.5, 5.2, 3.8, 2.17],
                borderColor: '#4B0082',
                backgroundColor: 'rgba(75, 0, 130, 0.1)',
                borderWidth: 2,
                tension: 0.3,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'NPL Rate (%)'
                    }
                }
            }
        }
    });
    
    // Period buttons for effectiveness chart
    document.querySelectorAll('.chart-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.chart-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // In a real app, this would fetch new data based on period
            const period = this.getAttribute('data-period');
            // For demo, we'll just update the chart title
            document.querySelector('#effectivenessChart').previousElementSibling.querySelector('h3').textContent = 
                `Loan Verification System Effectiveness (${period.charAt(0).toUpperCase() + period.slice(1)})`;
        });
    });
});