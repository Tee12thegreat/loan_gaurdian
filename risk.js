 // Function to calculate risk score for an application
 function calculateRiskScore(application) {
    let score = 0;
    
    // Income to loan amount ratio (higher ratio = lower risk)
    const income = parseFloat(application.income) || 1;
    const loanAmount = parseFloat(application.loanAmount) || 1;
    const incomeToLoanRatio = income / loanAmount;
    
    if (incomeToLoanRatio < 0.5) score += 40;
    else if (incomeToLoanRatio < 1) score += 25;
    else if (incomeToLoanRatio < 2) score += 10;
    
    // Employment status scoring
    const employment = application.employment;
    if (employment === 'unemployed') score += 30;
    else if (employment === 'student') score += 20;
    else if (employment === 'self-employed') score += 15;
    
    // Document verification scoring
    const documents = application.documents || [];
    const invalidDocs = documents.filter(doc => !doc.isValid).length;
    score += invalidDocs * 15;
    
    // Age scoring (younger applicants get higher risk)
    if (application.dob) {
        const dob = new Date(application.dob);
        const age = new Date().getFullYear() - dob.getFullYear();
        if (age < 25) score += 15;
        else if (age < 30) score += 10;
    }
    
    // Random factor to simulate other risk considerations
    score += Math.random() * 10;
    
    // Cap at 100
    return Math.min(100, Math.max(0, Math.round(score)));
}

// Function to determine risk category
function getRiskCategory(score) {
    if (score >= 70) return 'High';
    if (score >= 40) return 'Medium';
    return 'Low';
}

// Function to get risk category color
function getRiskColor(category) {
    switch(category) {
        case 'High': return '#F44336';
        case 'Medium': return '#FF9800';
        case 'Low': return '#4CAF50';
        default: return '#9E9E9E';
    }
}

// Function to get recommendation
function getRecommendation(score) {
    if (score >= 70) return 'Reject';
    if (score >= 40) return 'Review';
    return 'Approve';
}

// Function to update risk stats
function updateRiskStats(applications) {
    const total = applications.length;
    const lowRisk = applications.filter(app => app.riskCategory === 'Low').length;
    const mediumRisk = applications.filter(app => app.riskCategory === 'Medium').length;
    const highRisk = applications.filter(app => app.riskCategory === 'High').length;
    
    document.getElementById('totalAssessed').textContent = total;
    document.getElementById('lowRiskCount').textContent = lowRisk;
    document.getElementById('mediumRiskCount').textContent = mediumRisk;
    document.getElementById('highRiskCount').textContent = highRisk;
    
    document.getElementById('lowRiskPercent').textContent = total > 0 ? 
        Math.round((lowRisk / total) * 100) + '% of total' : '0% of total';
    document.getElementById('mediumRiskPercent').textContent = total > 0 ? 
        Math.round((mediumRisk / total) * 100) + '% of total' : '0% of total';
    document.getElementById('highRiskPercent').textContent = total > 0 ? 
        Math.round((highRisk / total) * 100) + '% of total' : '0% of total';
}

// Function to create risk distribution chart
function createRiskDistributionChart(applications) {
    const ctx = document.getElementById('riskDistributionChart').getContext('2d');
    
    // Count risk categories
    const riskCounts = {
        Low: applications.filter(app => app.riskCategory === 'Low').length,
        Medium: applications.filter(app => app.riskCategory === 'Medium').length,
        High: applications.filter(app => app.riskCategory === 'High').length
    };
    
    // Destroy previous chart if it exists
    if (window.riskDistributionChart) {
        window.riskDistributionChart.destroy();
    }
    
    window.riskDistributionChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Low Risk', 'Medium Risk', 'High Risk'],
            datasets: [{
                data: [riskCounts.Low, riskCounts.Medium, riskCounts.High],
                backgroundColor: [
                    '#4CAF50',
                    '#FF9800',
                    '#F44336'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right',
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.raw || 0;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = Math.round((value / total) * 100);
                            return `${label}: ${value} (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
}

// Function to create default probability chart
function createDefaultProbabilityChart(applications) {
    const ctx = document.getElementById('defaultProbabilityChart').getContext('2d');
    
    // Group by income level
    const incomeGroups = {
        'Low (<$1k)': applications.filter(app => {
            const income = parseFloat(app.income) || 0;
            return income < 1000;
        }),
        'Medium ($1k-$3k)': applications.filter(app => {
            const income = parseFloat(app.income) || 0;
            return income >= 1000 && income < 3000;
        }),
        'High ($3k-$5k)': applications.filter(app => {
            const income = parseFloat(app.income) || 0;
            return income >= 3000 && income < 5000;
        }),
        'Very High (>$5k)': applications.filter(app => {
            const income = parseFloat(app.income) || 0;
            return income >= 5000;
        })
    };
    
    // Calculate average risk score per group
    const labels = Object.keys(incomeGroups);
    const data = labels.map(group => {
        const groupApps = incomeGroups[group];
        if (groupApps.length === 0) return 0;
        const totalRisk = groupApps.reduce((sum, app) => sum + app.riskScore, 0);
        return Math.round(totalRisk / groupApps.length);
    });
    
    // Destroy previous chart if it exists
    if (window.defaultProbabilityChart) {
        window.defaultProbabilityChart.destroy();
    }
    
    window.defaultProbabilityChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Average Risk Score',
                data: data,
                backgroundColor: [
                    'rgba(75, 192, 192, 0.7)',
                    'rgba(54, 162, 235, 0.7)',
                    'rgba(255, 206, 86, 0.7)',
                    'rgba(255, 99, 132, 0.7)'
                ],
                borderColor: [
                    'rgba(75, 192, 192, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(255, 99, 132, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    title: {
                        display: true,
                        text: 'Risk Score (0-100)'
                    }
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `Risk Score: ${context.raw}`;
                        }
                    }
                }
            }
        }
    });
}

// Function to create risk factors chart
function createRiskFactorsChart(applications) {
    const ctx = document.getElementById('riskFactorsChart').getContext('2d');
    
    // Count risk factors
    const factors = {
        'Income Ratio': 0,
        'Employment Status': 0,
        'Document Issues': 0,
        'Age Factor': 0
    };
    
    applications.forEach(app => {
        const income = parseFloat(app.income) || 1;
        const loanAmount = parseFloat(app.loanAmount) || 1;
        const incomeToLoanRatio = income / loanAmount;
        
        if (incomeToLoanRatio < 1) factors['Income Ratio']++;
        
        if (app.employment === 'unemployed' || app.employment === 'student') {
            factors['Employment Status']++;
        }
        
        const invalidDocs = (app.documents || []).filter(doc => !doc.isValid).length;
        if (invalidDocs > 0) factors['Document Issues']++;
        
        if (app.dob) {
            const dob = new Date(app.dob);
            const age = new Date().getFullYear() - dob.getFullYear();
            if (age < 30) factors['Age Factor']++;
        }
    });
    
    // Convert to percentages
    const total = applications.length;
    Object.keys(factors).forEach(key => {
        factors[key] = total > 0 ? Math.round((factors[key] / total) * 100) : 0;
    });
    
    // Destroy previous chart if it exists
    if (window.riskFactorsChart) {
        window.riskFactorsChart.destroy();
    }
    
    window.riskFactorsChart = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: Object.keys(factors),
            datasets: [{
                label: 'Risk Factors Prevalence (%)',
                data: Object.values(factors),
                backgroundColor: 'rgba(75, 0, 130, 0.2)',
                borderColor: 'rgba(75, 0, 130, 1)',
                pointBackgroundColor: 'rgba(75, 0, 130, 1)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgba(75, 0, 130, 1)',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                r: {
                    angleLines: {
                        display: true
                    },
                    suggestedMin: 0,
                    suggestedMax: 100
                }
            }
        }
    });
}

// Function to populate high risk applications table
function populateHighRiskTable(applications) {
    const tableBody = document.querySelector('#highRiskTable tbody');
    tableBody.innerHTML = '';
    
    // Filter high risk applications and sort by risk score
    const highRiskApps = applications
        .filter(app => app.riskCategory === 'High')
        .sort((a, b) => b.riskScore - a.riskScore)
        .slice(0, 10); // Show top 10
    
    if (highRiskApps.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = '<td colspan="7" class="text-center">No high risk applications found</td>';
        tableBody.appendChild(row);
        return;
    }
    
    highRiskApps.forEach(app => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${app.id || 'N/A'}</td>
            <td>${app.firstName || ''} ${app.lastName || ''}</td>
            <td>
                <span style="color: ${getRiskColor(app.riskCategory)}; font-weight: bold;">
                    ${app.riskScore} (${app.riskCategory})
                </span>
            </td>
            <td>$${parseFloat(app.loanAmount || 0).toLocaleString()}</td>
            <td class="status-${app.status === 'Verified' ? 'verified' : 'pending'}">
                ${app.status || 'Pending'}
            </td>
            <td>${getRecommendation(app.riskScore)}</td>
            <td>
                <button class="btn btn-view btn-sm" data-id="${app.id}">
                    <i class="fas fa-eye"></i> View
                </button>
                <button class="btn btn-review btn-sm" data-id="${app.id}">
                    <i class="fas fa-search"></i> Review
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });
    
    // Add event listeners to buttons
    document.querySelectorAll('.btn-view').forEach(btn => {
        btn.addEventListener('click', function() {
            const appId = this.getAttribute('data-id');
            // In a real app, this would open a detailed view
            alert(`Viewing application ${appId}`);
        });
    });
    
    document.querySelectorAll('.btn-review').forEach(btn => {
        btn.addEventListener('click', function() {
            const appId = this.getAttribute('data-id');
            // In a real app, this would open a review modal
            alert(`Reviewing application ${appId}`);
        });
    });
}

// Function to load and process applications
function loadApplications() {
    const applications = JSON.parse(localStorage.getItem('loanApplications')) || [];
    
    // Calculate risk scores and categories for each application
    const processedApps = applications.map(app => {
        const riskScore = calculateRiskScore(app);
        const riskCategory = getRiskCategory(riskScore);
        return {
            ...app,
            riskScore,
            riskCategory
        };
    });
    
    // Update all dashboard elements
    updateRiskStats(processedApps);
    createRiskDistributionChart(processedApps);
    createDefaultProbabilityChart(processedApps);
    createRiskFactorsChart(processedApps);
    populateHighRiskTable(processedApps);
    
    return processedApps;
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Load applications and display data
    loadApplications();
    
    // Refresh button
    document.getElementById('refreshTable').addEventListener('click', loadApplications);
    
    // Search functionality
    document.querySelector('.search-bar button').addEventListener('click', function() {
        const searchTerm = document.getElementById('searchInput').value.toLowerCase();
        const applications = JSON.parse(localStorage.getItem('loanApplications')) || [];
        const filteredApps = applications.filter(app => 
            (app.firstName + ' ' + app.lastName).toLowerCase().includes(searchTerm) ||
            (app.id && app.id.toLowerCase().includes(searchTerm))
        );
        
        // Re-process and display filtered applications
        const processedApps = filteredApps.map(app => {
            const riskScore = calculateRiskScore(app);
            const riskCategory = getRiskCategory(riskScore);
            return {
                ...app,
                riskScore,
                riskCategory
            };
        });
        
        populateHighRiskTable(processedApps);
    });
    
    // Chart period switching
    document.querySelectorAll('.chart-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.chart-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // In a real app, you would filter data by period
            // For this demo, we'll just reload all data
            loadApplications();
        });
    });
    
    // Listen for storage changes (from other tabs)
    window.addEventListener('storage', function() {
        loadApplications();
    });
});