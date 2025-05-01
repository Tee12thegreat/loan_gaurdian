document.addEventListener('DOMContentLoaded', function() {
    // Document Verification Chart
    const docCtx = document.getElementById('docVerificationChart').getContext('2d');
    new Chart(docCtx, {
        type: 'bar',
        data: {
            labels: ['ID Documents', 'Payslips', 'Bank Statements', 'References'],
            datasets: [{
                label: 'Verified',
                data: [85, 72, 68, 55],
                backgroundColor: '#4B0082'
            }, {
                label: 'Flagged',
                data: [10, 18, 22, 30],
                backgroundColor: '#FF9800'
            }, {
                label: 'Missing',
                data: [5, 10, 10, 15],
                backgroundColor: '#F44336'
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    // Sample applications data
    const applications = [
        { id: 'APP-1001', name: 'John Doe', amount: '$15,000', docs: '3/4', status: 'Pending' },
        { id: 'APP-1002', name: 'Jane Smith', amount: '$8,000', docs: '4/4', status: 'Verified' },
        { id: 'APP-1003', name: 'Robert Johnson', amount: '$25,000', docs: '2/4', status: 'Flagged' }
    ];

    // Populate applications table
    const appTable = document.getElementById('applicationsTable').getElementsByTagName('tbody')[0];
    
    applications.forEach(app => {
        const row = appTable.insertRow();
        row.insertCell(0).textContent = app.id;
        row.insertCell(1).textContent = app.name;
        row.insertCell(2).textContent = app.amount;
        row.insertCell(3).textContent = app.docs;
        
        const statusCell = row.insertCell(4);
        statusCell.textContent = app.status;
        statusCell.className = `status-${app.status.toLowerCase()}`;
        
        const actionCell = row.insertCell(5);
        actionCell.innerHTML = `
            <button class="btn-view">View</button>
            ${app.status === 'Flagged' ? '<button class="btn-review">Review</button>' : ''}
        `;
    });
});