// Theme toggle functionality

function toggleTheme() {
    const body = document.body;
    const themeToggle = document.getElementById('themeToggle');

    if (body.getAttribute('data-theme') === 'dark') {
        body.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
        themeToggle.textContent = '🌙';
    } else {
        body.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
        themeToggle.textContent = '☀️';
    }
}

// Placeholder functions for various actions
function createChama() {
    alert('Create Chama functionality coming soon!');
}

function viewChama(id) {
    alert('View Chama details functionality coming soon!');
}

function lockAsset(asset) {
    alert('Lock asset functionality coming soon!');
}

function unlockAsset(asset) {
    alert('Unlock asset functionality coming soon!');
}

function viewHistory() {
    alert('View history functionality coming soon!');
}

function investInFund(fund) {
    alert('Invest in fund functionality coming soon!');
}

function viewInvestments() {
    alert('View investments functionality coming soon!');
}

function sendFunds() {
    alert('Send funds functionality coming soon!');
}

function applyForLoan() {
    alert('Loan application functionality coming soon!');
}

function repayLoan(id) {
    alert('Loan repayment functionality coming soon!');
}

function viewLoanHistory() {
    alert('View loan history functionality coming soon!');
}