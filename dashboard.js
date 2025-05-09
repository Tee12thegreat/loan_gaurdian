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

            if (!currentUser) {
                window.location.href = 'index.html';
                return;
            }

            // Redirect loan officers directly to loan screening
            if (currentUser.role === 'loan-officer') {
                window.location.href = 'screening.html';
            }

            document.body.classList.add(currentUser.role);
            document.querySelector('.username').textContent = currentUser.name;
            document.querySelector('.user-role').textContent = currentUser.role.replace('-', ' ');
            document.querySelector('.avatar').textContent = currentUser.name.charAt(0);
        });
   
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
    
    // Navigation handling - MODIFIED FOR ROOT FOLDER
    const navLinks = document.querySelectorAll('.nav-menu li a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const page = this.getAttribute('href').substring(1);
            
            if (page) {
                window.location.href = `${page}.html`;
            }
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
function calculatePercentageChange(oldValue, newValue) {
    if (oldValue === 0) return 'N/A';
    const change = ((newValue - oldValue) / oldValue) * 100;
    return change.toFixed(1) + '%';
}

// Function to update dashboard stats
function updateDashboardStats() {
    // Get applications from localStorage
    const applications = JSON.parse(localStorage.getItem('loanApplications')) || [];
    const totalApplications = applications.length;
    
    // Calculate verified applications (status === 'Verified')
    const verifiedApplications = applications.filter(app => 
        app.status === 'Verified' || app.status === 'verified'
    ).length;
    
    // Calculate fraud alerts (status === 'Flagged' or contains fraud indicators)
    const fraudAlerts = applications.filter(app => 
        app.status === 'Flagged' || 
        app.status === 'Rejected' || 
        (app.documents && app.documents.some(doc => !doc.isValid))
    ).length;
    
    // Calculate fraud prevention effectiveness (simplified for demo)
    const fraudPrevention = totalApplications > 0 ? 
        Math.min(100, Math.round(100 - (fraudAlerts / totalApplications * 100))) : 0;
    
    // Calculate verification rate
    const verificationRate = totalApplications > 0 ? 
        Math.round((verifiedApplications / totalApplications) * 100) : 0;
    
    // Calculate alert rate
    const alertRate = totalApplications > 0 ? 
        Math.round((fraudAlerts / totalApplications) * 100) : 0;
    
    // Get previous month's data for comparison
    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthApps = applications.filter(app => {
        const appDate = new Date(app.date);
        return appDate.getFullYear() === lastMonth.getFullYear() && 
               appDate.getMonth() === lastMonth.getMonth();
    }).length;
    
    // Update the DOM elements
    document.getElementById('totalApplications').textContent = totalApplications;
    document.getElementById('verifiedApplications').textContent = verifiedApplications;
    document.getElementById('fraudAlerts').textContent = fraudAlerts;
    document.getElementById('fraudPrevention').textContent = fraudPrevention + '%';
    document.getElementById('verificationRate').textContent = verificationRate + '% verification rate';
    document.getElementById('alertRate').textContent = alertRate + '% alert rate';
    
    // Update trend indicator
    const trendElement = document.getElementById('applicationTrend');
    if (lastMonthApps > 0) {
        const change = calculatePercentageChange(lastMonthApps, totalApplications);
        if (change !== 'N/A') {
            const isPositive = parseFloat(change) > 0;
            trendElement.textContent = `${isPositive ? '+' : ''}${change} from last month`;
            trendElement.style.color = isPositive ? '#4CAF50' : '#F44336';
        } else {
            trendElement.textContent = 'No previous data';
            trendElement.style.color = '#666';
        }
    } else {
        trendElement.textContent = 'No previous data';
        trendElement.style.color = '#666';
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    updateDashboardStats();
    
    // Set up event listener for storage changes
    window.addEventListener('storage', function() {
        updateDashboardStats();
    });
    
    // [Rest of your existing dashboard initialization code]
    
    // Tab switching functionality
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs and content
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding content
            this.classList.add('active');
            const tabId = this.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });
    
    // Chart period switching
    const chartBtns = document.querySelectorAll('.chart-btn');
    chartBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            chartBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            // Here you would update the chart data based on the period
            // For demo purposes, we'll just log the selected period
            console.log('Selected period:', this.getAttribute('data-period'));
        });
    });
});