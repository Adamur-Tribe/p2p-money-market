let contract;
let userAddress;
const contractAddress = "0x0b12e1b1ebd496e808bf20b66ca6cc2293212946";
const contractABI = [

    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "poolId",
                "type": "uint256"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "lender",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "interestRate",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "enum MicroLending.LoanType",
                "name": "loanType",
                "type": "uint8"
            }
        ],
        "name": "LendingPoolCreated",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "applicationId",
                "type": "uint256"
            },
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "poolId",
                "type": "uint256"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "borrower",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "requestedAmount",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "enum MicroLending.LoanDuration",
                "name": "duration",
                "type": "uint8"
            }
        ],
        "name": "LoanApplicationCreated",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "applicationId",
                "type": "uint256"
            },
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "poolId",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "address",
                "name": "borrower",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "LoanApproved",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "applicationId",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "principal",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "interest",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "penalty",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "daysLate",
                "type": "uint256"
            }
        ],
        "name": "LoanRepaid",
        "type": "event"
    },
    {
        "inputs": [],
        "name": "FIXED_TERM_DURATION_DAYS",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "FIXED_TERM_MAX_LOAN",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "INSTANT_LOAN_DURATION_DAYS",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "INSTANT_MAX_LOAN",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "INTEREST_RATE",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "INTEREST_RATE_INSTANT",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "PENALTY_RATE",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_poolId",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_requestedAmount",
                "type": "uint256"
            },
            {
                "internalType": "enum MicroLending.LoanDuration",
                "name": "_duration",
                "type": "uint8"
            },
            {
                "internalType": "string",
                "name": "_purpose",
                "type": "string"
            }
        ],
        "name": "applyForLoan",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_applicationId",
                "type": "uint256"
            }
        ],
        "name": "approveLoan",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_applicationId",
                "type": "uint256"
            }
        ],
        "name": "calculateRepaymentAmount",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "totalAmount",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "principal",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "interest",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "penalty",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "daysLate",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_poolId",
                "type": "uint256"
            }
        ],
        "name": "closeLendingPool",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "createFixedTermPool",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "createInstantPool",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_applicationId",
                "type": "uint256"
            }
        ],
        "name": "getApplicationDetails",
        "outputs": [
            {
                "internalType": "address",
                "name": "borrower",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "poolId",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "requestedAmount",
                "type": "uint256"
            },
            {
                "internalType": "enum MicroLending.LoanDuration",
                "name": "duration",
                "type": "uint8"
            },
            {
                "internalType": "bool",
                "name": "approved",
                "type": "bool"
            },
            {
                "internalType": "bool",
                "name": "repaid",
                "type": "bool"
            },
            {
                "internalType": "uint256",
                "name": "amountRepaid",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "dueDate",
                "type": "uint256"
            },
            {
                "internalType": "string",
                "name": "purpose",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_borrower",
                "type": "address"
            }
        ],
        "name": "getBorrowerApplications",
        "outputs": [
            {
                "internalType": "uint256[]",
                "name": "",
                "type": "uint256[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_lender",
                "type": "address"
            }
        ],
        "name": "getLenderPools",
        "outputs": [
            {
                "internalType": "uint256[]",
                "name": "",
                "type": "uint256[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_poolId",
                "type": "uint256"
            }
        ],
        "name": "getPoolDetails",
        "outputs": [
            {
                "internalType": "address",
                "name": "lender",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "availableAmount",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "interestRate",
                "type": "uint256"
            },
            {
                "internalType": "bool",
                "name": "active",
                "type": "bool"
            },
            {
                "internalType": "uint256",
                "name": "startTime",
                "type": "uint256"
            },
            {
                "internalType": "enum MicroLending.LoanType",
                "name": "loanType",
                "type": "uint8"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "hasFixedTermPool",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "hasInstantPool",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "lendingPools",
        "outputs": [
            {
                "internalType": "address payable",
                "name": "lender",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "availableAmount",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "interestRate",
                "type": "uint256"
            },
            {
                "internalType": "bool",
                "name": "active",
                "type": "bool"
            },
            {
                "internalType": "uint256",
                "name": "startTime",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "poolId",
                "type": "uint256"
            },
            {
                "internalType": "enum MicroLending.LoanType",
                "name": "loanType",
                "type": "uint8"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "loanApplications",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "applicationId",
                "type": "uint256"
            },
            {
                "internalType": "address payable",
                "name": "borrower",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "poolId",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "requestedAmount",
                "type": "uint256"
            },
            {
                "internalType": "enum MicroLending.LoanDuration",
                "name": "duration",
                "type": "uint8"
            },
            {
                "internalType": "bool",
                "name": "approved",
                "type": "bool"
            },
            {
                "internalType": "bool",
                "name": "repaid",
                "type": "bool"
            },
            {
                "internalType": "uint256",
                "name": "amountRepaid",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "dueDate",
                "type": "uint256"
            },
            {
                "internalType": "string",
                "name": "purpose",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "nextApplicationId",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "nextPoolId",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_applicationId",
                "type": "uint256"
            }
        ],
        "name": "repayLoan",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    }

];

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

async function connectWallet() {
    try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        userAccount = accounts[0];
        updateAccountDisplay();
        loadPools();
        showNotification('Wallet connected successfully!', 'success');
    } catch (error) {
        showNotification('Failed to connect wallet: ' + error.message, 'error');
    }
}

async function connectWallet() {
    if (typeof window.ethereum !== 'undefined') {
        try {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            userAddress = accounts[0];

            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            contract = new ethers.Contract(contractAddress, contractABI, signer);

            document.getElementById('wallet-status').textContent =
                `Connected: ${userAddress.slice(0, 6)}...${userAddress.slice(-4)}`;
            document.getElementById('wallet-status').className = 'status success';
        } catch (error) {
            console.error('Error connecting wallet:', error);
            showError('Failed to connect wallet');
        }
    } else {
        showError('Please install MetaMask');
    }
}

async function getPoolDetails() {
    if (!contract) {
        showError('Please connect your wallet first');
        return;
    }

    try {
        const poolId = BigInt(document.getElementById('pool-id-search').value);
        if (poolId < 0) {
            throw new Error('Invalid pool ID');
        }

        const pool = await contract.getPoolDetails(poolId);

        const detailsHtml = `
            <div class="detail-card">
                <h3>Pool #${poolId.toString()} Details</h3>
                <div class="detail-grid">
                    <div class="detail-item">
                        <span>Lender:</span>
                        <span>${pool[0]}</span>
                    </div>
                    <div class="detail-item">
                        <span>Available Amount:</span>
                        <span>${formatEth(pool[1])}</span>
                    </div>
                    <div class="detail-item">
                        <span>Interest Rate:</span>
                        <span>${Number(pool[2]) / 100}%</span>
                    </div>
                    <div class="detail-item">
                        <span>Status:</span>
                        <span>${pool[3] ? 'Active' : 'Closed'}</span>
                    </div>
                    <div class="detail-item">
                        <span>Start Time:</span>
                        <span>${formatDate(pool[4])}</span>
                    </div>
                    <div class="detail-item">
                        <span>Type:</span>
                        <span>${pool[5] === 0n ? 'Fixed Term' : 'Instant'}</span>
                    </div>
                </div>
                ${pool[3] && pool[0].toLowerCase() === userAddress.toLowerCase() ? `
                    <div class="action-buttons">
                        <button class="warning" onclick="closeLendingPool(${poolId})">Close Pool</button>
                    </div>
                ` : ''}
            </div>
        `;

        document.getElementById('details-container').innerHTML = detailsHtml;
    } catch (error) {
        console.error('Error getting pool details:', error);
        showError(error.message || 'Failed to get pool details');
    }
}

async function getApplicationDetails() {
    if (!contract) {
        showError('Please connect your wallet first');
        return;
    }

    try {
        const applicationId = BigInt(document.getElementById('loan-id-search').value);
        if (applicationId < 0) {
            throw new Error('Invalid application ID');
        }

        const application = await contract.getApplicationDetails(applicationId);
        let repaymentDetails;

        try {
            repaymentDetails = await contract.calculateRepaymentAmount(applicationId);
        } catch (error) {
            // Handle the case where loan is not approved yet
            repaymentDetails = [0n, 0n, 0n, 0n, 0n];
        }

        const detailsHtml = `
            <div class="detail-card">
                <h3>Loan Application #${applicationId.toString()} Details</h3>
                <div class="detail-grid">
                    <div class="detail-item">
                        <span>Borrower:</span>
                        <span>${application.borrower}</span>
                    </div>
                    <div class="detail-item">
                        <span>Pool ID:</span>
                        <span>${application.poolId}</span>
                    </div>
                    <div class="detail-item">
                        <span>Amount:</span>
                        <span>${formatEth(application.requestedAmount)}</span>
                    </div>
                    <div class="detail-item">
                        <span>Status:</span>
                        <span>${application.approved ? (application.repaid ? 'Repaid' : 'Approved') : 'Pending'}</span>
                    </div>
                    <div class="detail-item">
                        <span>Due Date:</span>
                        <span>${formatDate(application.dueDate)}</span>
                    </div>
                    <div class="detail-item">
                        <span>Purpose:</span>
                        <span>${application.purpose}</span>
                    </div>
                </div>
                ${application.approved && !application.repaid ? `
                    <div class="detail-card">
                        <h3>Repayment Details</h3>
                        <div class="detail-grid">
                            <div class="detail-item">
                                <span>Principal:</span>
                                <span>${formatEth(repaymentDetails[1])}</span>
                            </div>
                            <div class="detail-item">
                                <span>Interest:</span>
                                <span>${formatEth(repaymentDetails[2])}</span>
                            </div>
                            <div class="detail-item">
                                <span>Penalty:</span>
                                <span>${formatEth(repaymentDetails[3])}</span>
                            </div>
                            <div class="detail-item">
                                <span>Days Late:</span>
                                <span>${repaymentDetails[4].toString()}</span>
                            </div>
                            <div class="detail-item">
                                <span>Total Amount:</span>
                                <span>${formatEth(repaymentDetails[0])}</span>
                            </div>
                        </div>
                    </div>
                ` : ''}
                <div class="action-buttons">
                    ${!application.approved && !application.repaid ? `
                        <button class="success" onclick="approveLoan(${applicationId})">Approve Loan</button>
                    ` : ''}
                    ${application.approved && !application.repaid ? `
                        <button class="warning" onclick="repayLoan(${applicationId})">Repay Loan</button>
                    ` : ''}
                </div>
            </div>
        `;

        document.getElementById('details-container').innerHTML = detailsHtml;
    } catch (error) {
        console.error('Error getting application details:', error);
        showError(error.message || 'Failed to get application details');
    }
}

async function closeLendingPool(poolId) {
    if (!contract) {
        showError('Please connect your wallet first');
        return;
    }

    try {
        const tx = await contract.closeLendingPool(poolId);
        await tx.wait();
        showSuccess('Pool closed successfully');
        await getPoolDetails();
    } catch (error) {
        console.error('Error closing pool:', error);
        showError(error.message || 'Failed to close pool');
    }
}

async function approveLoan(applicationId) {
    if (!contract) {
        showError('Please connect your wallet first');
        return;
    }

    try {
        const tx = await contract.approveLoan(applicationId);
        await tx.wait();
        showSuccess('Loan approved successfully');
        await getApplicationDetails();
    } catch (error) {
        console.error('Error approving loan:', error);
        showError(error.message || 'Failed to approve loan');
    }
}

async function repayLoan(applicationId) {
    if (!contract) {
        showError('Please connect your wallet first');
        return;
    }

    try {
        const [totalAmount] = await contract.calculateRepaymentAmount(applicationId);
        const tx = await contract.repayLoan(applicationId, { value: totalAmount });
        await tx.wait();
        showSuccess('Loan repaid successfully');
        await getApplicationDetails();
    } catch (error) {
        console.error('Error repaying loan:', error);
        showError(error.message || 'Failed to repay loan');
    }
}

function formatDate(timestamp) {
    if (!timestamp) return 'Not set';
    return new Date(Number(timestamp) * 1000).toLocaleDateString();
}

function formatEth(wei) {
    if (!wei) return '0 ETH';
    try {
        return parseFloat(ethers.formatEther(wei)).toFixed(4) + ' ETH';
    } catch (error) {
        console.error('Error formatting ETH:', error);
        return '0 ETH';
    }
}

function showSuccess(message) {
    const status = document.getElementById('wallet-status');
    status.textContent = message;
    status.className = 'status success';
    setTimeout(() => {
        if (userAddress) {
            status.textContent = `Connected: ${userAddress.slice(0, 6)}...${userAddress.slice(-4)}`;
            status.className = 'status success';
        } else {
            status.textContent = 'Please connect your wallet';
            status.className = 'status';
        }
    }, 3000);
}

function showError(message) {
    const status = document.getElementById('wallet-status');
    status.textContent = message;
    status.className = 'status error';
}

// Initial setup
if (window.ethereum) {
    connectWallet();

    window.ethereum.on('accountsChanged', accounts => {
        if (accounts.length > 0) {
            connectWallet();
        } else {
            userAddress = null;
            contract = null;
            document.getElementById('wallet-status').textContent = 'Please connect your wallet';
            document.getElementById('wallet-status').className = 'status';
        }
    });

    window.ethereum.on('chainChanged', () => {
        window.location.reload();
    });
}
// Load saved data on page load
window.addEventListener('load', () => {
    loadSavedData();
    if (window.ethereum) {
        connectWallet().then(() => {
            if (userAddress) {
                loadUserLoans();
            }
        });
    }
});

function loadSavedData() {
    const activeTab = localStorage.getItem('activeTab') || 'lender';
    switchTab(activeTab);

    document.getElementById('pool-id-search').value = localStorage.getItem('poolIdSearch') || '';
    document.getElementById('loan-id-search').value = localStorage.getItem('loanIdSearch') || '';
    document.getElementById('borrow-pool-id').value = localStorage.getItem('borrowPoolId') || '';
    document.getElementById('borrow-amount').value = localStorage.getItem('borrowAmount') || '';
    document.getElementById('loan-purpose').value = localStorage.getItem('loanPurpose') || '';
    document.getElementById('loan-duration').value = localStorage.getItem('loanDuration') || '0';
}

function saveFormData() {
    localStorage.setItem('poolIdSearch', document.getElementById('pool-id-search').value);
    localStorage.setItem('loanIdSearch', document.getElementById('loan-id-search').value);
    localStorage.setItem('borrowPoolId', document.getElementById('borrow-pool-id').value);
    localStorage.setItem('borrowAmount', document.getElementById('borrow-amount').value);
    localStorage.setItem('loanPurpose', document.getElementById('loan-purpose').value);
    localStorage.setItem('loanDuration', document.getElementById('loan-duration').value);
}

function switchTab(tabName) {
    localStorage.setItem('activeTab', tabName);
    
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelectorAll('.panel').forEach(panel => {
        panel.classList.remove('active');
    });

    document.querySelector(`.tab:nth-child(${tabName === 'lender' ? '1' : '2'})`).classList.add('active');
    document.getElementById(`${tabName}-panel`).classList.add('active');

    if (tabName === 'borrower' && userAddress) {
        loadUserLoans();
    }
}

async function loadUserLoans() {
    if (!contract || !userAddress) return;

    try {
        const applications = await contract.getBorrowerApplications(userAddress);
        let loansHtml = '';

        for (const appId of applications) {
            const details = await contract.getApplicationDetails(appId);
            loansHtml += `
                <div class="detail-card">
                    <h3>Loan #${appId.toString()}</h3>
                    <div class="detail-grid">
                        <div class="detail-item">
                            <span>Pool ID:</span>
                            <span>${details.poolId.toString()}</span>
                        </div>
                        <div class="detail-item">
                            <span>Amount:</span>
                            <span>${formatEth(details.requestedAmount)}</span>
                        </div>
                        <div class="detail-item">
                            <span>Status:</span>
                            <span>${details.approved ? (details.repaid ? 'Repaid' : 'Approved') : 'Pending'}</span>
                        </div>
                        <div class="detail-item">
                            <span>Due Date:</span>
                            <span>${formatDate(details.dueDate)}</span>
                        </div>
                        <div class="detail-item">
                            <span>Purpose:</span>
                            <span>${details.purpose}</span>
                        </div>
                    </div>
                    ${!details.repaid ? `
                        <div class="action-buttons">
                            ${details.approved ? `
                                <button class="warning" onclick="repayLoan(${appId})">Repay Loan</button>
                            ` : ''}
                        </div>
                    ` : ''}
                </div>
            `;
        }

        document.getElementById('loans-container').innerHTML = loansHtml || 
            '<p>No loans found. Apply for a loan to get started.</p>';
    } catch (error) {
        console.error('Error loading user loans:', error);
        showError('Failed to load loans');
    }
}

async function applyForLoan() {
    if (!contract) {
        showError('Please connect your wallet first');
        return;
    }

    try {
        const poolId = document.getElementById('borrow-pool-id').value;
        const amount = ethers.parseEther(document.getElementById('borrow-amount').value);
        const duration = document.getElementById('loan-duration').value;
        const purpose = document.getElementById('loan-purpose').value;

        const tx = await contract.applyForLoan(poolId, amount, duration, purpose);
        await tx.wait();
        
        showSuccess('Loan application submitted successfully');
        saveFormData();
        loadUserLoans();
    } catch (error) {
        console.error('Error applying for loan:', error);
        showError(error.message || 'Failed to apply for loan');
    }
}

document.querySelectorAll('input, select').forEach(element => {
    element.addEventListener('change', saveFormData);
});