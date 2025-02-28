let web3;
let contract;
let currentAccount;
const contractAddress = "0x8a750bf8fb94264364abac1000e09a2ee0d40a65";
const contractABI = [
    {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "owner",
                "type": "address"
            }
        ],
        "name": "OwnableInvalidOwner",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "account",
                "type": "address"
            }
        ],
        "name": "OwnableUnauthorizedAccount",
        "type": "error"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "fundId",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "DividendDistributed",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "fundId",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "mmfName",
                "type": "string"
            },
            {
                "indexed": false,
                "internalType": "address",
                "name": "manager",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "initialMinInvestment",
                "type": "uint256"
            }
        ],
        "name": "FundCreated",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "fundId",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "bool",
                "name": "isActive",
                "type": "bool"
            }
        ],
        "name": "FundStatusChanged",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "fundId",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "address",
                "name": "investor",
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
                "name": "shares",
                "type": "uint256"
            }
        ],
        "name": "InvestmentMade",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "previousOwner",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "newOwner",
                "type": "address"
            }
        ],
        "name": "OwnershipTransferred",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "address",
                "name": "account",
                "type": "address"
            }
        ],
        "name": "Paused",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "fundId",
                "type": "uint256"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "from",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "TopUpReceived",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "address",
                "name": "account",
                "type": "address"
            }
        ],
        "name": "Unpaused",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "fundId",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "address",
                "name": "investor",
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
                "name": "shares",
                "type": "uint256"
            }
        ],
        "name": "WithdrawalMade",
        "type": "event"
    },
    {
        "inputs": [],
        "name": "INITIAL_FUNDING",
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
        "name": "INITIAL_SHARE_PRICE",
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
        "name": "MANAGEMENT_FEE_PERCENTAGE",
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
        "name": "MAX_INVESTORS",
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
        "name": "MIN_INVESTMENT",
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
                "name": "_fundId",
                "type": "uint256"
            }
        ],
        "name": "chargeManagementFee",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_fundId",
                "type": "uint256"
            }
        ],
        "name": "claimDividend",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "_mmfName",
                "type": "string"
            },
            {
                "internalType": "address",
                "name": "_investmentAccount",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "_dividendPeriod",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_initialMinInvestment",
                "type": "uint256"
            }
        ],
        "name": "createFund",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_fundId",
                "type": "uint256"
            }
        ],
        "name": "distributeDividends",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "emergencyPause",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "emergencyUnpause",
        "outputs": [],
        "stateMutability": "nonpayable",
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
        "name": "funds",
        "outputs": [
            {
                "internalType": "address",
                "name": "mmfManager",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "investmentAccount",
                "type": "address"
            },
            {
                "internalType": "string",
                "name": "mmfName",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "totalAssets",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "currentInvestors",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "creationTime",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "dividendPeriod",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "lastDividendTime",
                "type": "uint256"
            },
            {
                "internalType": "bool",
                "name": "isActive",
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
                "name": "_fundId",
                "type": "uint256"
            }
        ],
        "name": "getAllInvestors",
        "outputs": [
            {
                "internalType": "address[]",
                "name": "",
                "type": "address[]"
            },
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
                "name": "_fundId",
                "type": "uint256"
            }
        ],
        "name": "getInvestorFundDetails",
        "outputs": [
            {
                "internalType": "string",
                "name": "mmfName",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "totalAssets",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "currentInvestors",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "investedAmount",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "shares",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "lastDepositTime",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "lastDividendClaimed",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getOpenFunds",
        "outputs": [
            {
                "internalType": "uint256[]",
                "name": "openFunds",
                "type": "uint256[]"
            },
            {
                "internalType": "string[]",
                "name": "mmfNames",
                "type": "string[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_fundId",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_initialInvestment",
                "type": "uint256"
            }
        ],
        "name": "invest",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_fundId",
                "type": "uint256"
            }
        ],
        "name": "managerTopUp",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "owner",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "paused",
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
        "inputs": [],
        "name": "renounceOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_fundId",
                "type": "uint256"
            },
            {
                "internalType": "bool",
                "name": "_status",
                "type": "bool"
            }
        ],
        "name": "setFundStatus",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_fundId",
                "type": "uint256"
            }
        ],
        "name": "topUpInvestment",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "totalFunds",
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
                "internalType": "address",
                "name": "newOwner",
                "type": "address"
            }
        ],
        "name": "transferOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_fundId",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_amount",
                "type": "uint256"
            }
        ],
        "name": "withdraw",
        "outputs": [],
        "stateMutability": "nonpayable",
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
        "name": "funds",
        "outputs": [
            {
                "internalType": "address",
                "name": "mmfManager",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "investmentAccount",
                "type": "address"
            },
            {
                "internalType": "string",
                "name": "mmfName",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "totalAssets",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "currentInvestors",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "creationTime",
                "type": "uint256"
            },
            {
                "internalType": "bool",
                "name": "isActive",
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
            "name": "_fundId",
            "type": "uint256"
        }
    ],
    "name": "getAllInvestors",
    "outputs": [
        {
            "internalType": "address[]",
            "name": "",
            "type": "address[]"
        },
        {
            "internalType": "uint256[]",
            "name": "",
            "type": "uint256[]"
        }
    ],
    "stateMutability": "view",
    "type": "function"
}
];

async function init() {
    if (typeof window.ethereum !== 'undefined') {
        try {
            // Request account access
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            web3 = new Web3(window.ethereum);
            
            // Get the current account
            const accounts = await web3.eth.getAccounts();
            currentAccount = accounts[0];
            document.getElementById('wallet-status').textContent = 
                `Connected: ${currentAccount.substring(0,6)}...${currentAccount.substring(38)}`;

            // Initialize contract
            contract = new web3.eth.Contract(contractABI, contractAddress);
            
            // Load initial data
            await loadFunds();
            await loadInvestorData();
        } catch (error) {
            console.error("Error initializing Web3:", error);
            showAlert("Error connecting to wallet", "error");
        }
    } else {
        showAlert("Please install MetaMask!", "error");
    }
}

async function loadFunds() {
    try {
        const result = await contract.methods.getOpenFunds().call();
        console.log("Raw result from getOpenFunds:", result);

        const fundIds = Array.isArray(result.openFunds) ? result.openFunds : [];
        const fundNames = Array.isArray(result.mmfNames) ? result.mmfNames : [];

        if (fundIds.length === 0) {
            showAlert("No funds available", "info");
            return;
        }

        // Populate manager fund select
        const managerSelect = document.getElementById('manager-fund-select');
        managerSelect.innerHTML = fundIds.map((id, index) => 
            `<option value="${id}">${fundNames[index] || `Fund ${id}`}</option>`
        ).join('');

        if (fundIds.length > 0) {
        loadFundInvestors(fundIds[0]);
    }
        
        // Populate investor fund select
        const investorSelect = document.getElementById('investor-fund-select');
        investorSelect.innerHTML = managerSelect.innerHTML;
        
        // Populate available funds table
        const availableFunds = document.getElementById('available-funds');
        availableFunds.innerHTML = fundIds.map((id, index) => `
            <tr>
                <td>${fundNames[index] || `Fund ${id}`}</td>
                <td id="fund-${id}-assets">Loading...</td>
                <td><button onclick="invest(${id})">Invest</button></td>
            </tr>
        `).join('');
        
        // Load fund details using the public funds mapping
        for (const id of fundIds) {
            try {
                const fundDetails = await contract.methods.funds(id).call();
                const assetsElement = document.getElementById(`fund-${id}-assets`);
                if (assetsElement) {
                    assetsElement.textContent = 
                        web3.utils.fromWei(fundDetails.totalAssets.toString(), 'ether') + ' ETH';
                }
            } catch (error) {
                console.error(`Error loading details for fund ${id}:`, error);
                const assetsElement = document.getElementById(`fund-${id}-assets`);
                if (assetsElement) {
                    assetsElement.textContent = 'Error loading details';
                }
            }
        }
    } catch (error) {
        console.error("Error loading funds:", error);
        showAlert("Error loading funds: " + error.message, "error");
    }
}

async function createFund(event) {
    event.preventDefault();
    const name = document.getElementById('fund-name').value;
    const account = document.getElementById('investment-account').value;
    const period = document.getElementById('dividend-period').value;
    const minInvestment = web3.utils.toWei(
        document.getElementById('initial-min-investment').value, 
        'ether'
    );

    try {
        await contract.methods.createFund(name, account, period, minInvestment)
            .send({ from: currentAccount });
        showAlert("Fund created successfully!", "success");
        loadFunds();
    } catch (error) {
        console.error("Error creating fund:", error);
        showAlert("Error creating fund", "error");
    }
}

async function invest(fundId) {
    const amount = document.getElementById('investment-amount').value;
    const weiAmount = web3.utils.toWei(amount, 'ether');

    try {
        await contract.methods.invest(fundId, weiAmount)
            .send({ from: currentAccount, value: weiAmount });
        showAlert("Investment successful!", "success");
        loadInvestorData();
    } catch (error) {
        console.error("Error investing:", error);
        showAlert("Error making investment: " + error.message, "error");
    }
}

async function loadInvestorData() {
    try {
        const result = await contract.methods.getOpenFunds().call();
        const fundIds = Array.isArray(result.openFunds) ? result.openFunds : [];
        
        const yourInvestments = document.getElementById('your-investments');
        yourInvestments.innerHTML = ''; // Clear existing content
        
        for (const fundId of fundIds) {
            try {
                const fundDetails = await contract.methods.getInvestorFundDetails(fundId).call({
                    from: currentAccount
                });
                
                // Only display if investor has invested (investedAmount > 0)
                if (fundDetails.investedAmount > 0) {
                    yourInvestments.innerHTML += `
                        <tr>
                            <td>${fundDetails.mmfName}</td>
                            <td>${web3.utils.fromWei(fundDetails.investedAmount.toString(), 'ether')} ETH</td>
                            <td>${fundDetails.shares}</td>
                            <td>
                                <button onclick="withdraw(${fundId})">Withdraw</button>
                                <button onclick="claimDividend(${fundId})">Claim Dividend</button>
                            </td>
                        </tr>
                    `;
                }
            } catch (error) {
                // Silently skip funds where user is not an investor
                if (!error.message.includes("Investor does not exist")) {
                    console.error(`Error loading investor details for fund ${fundId}:`, error);
                }
            }
        }
        
        if (yourInvestments.innerHTML === '') {
            yourInvestments.innerHTML = '<tr><td colspan="4">No active investments found</td></tr>';
        }
    } catch (error) {
        console.error("Error loading investor data:", error);
        showAlert("Error loading your investments: " + error.message, "error");
    }
}

async function withdraw(fundId) {
    const amount = prompt("Enter amount to withdraw (ETH):");
    if (!amount) return;

    const weiAmount = web3.utils.toWei(amount, 'ether');

    try {
        await contract.methods.withdraw(fundId, weiAmount)
            .send({ from: currentAccount });
        showAlert("Withdrawal successful!", "success");
        loadInvestorData();
    } catch (error) {
        console.error("Error withdrawing:", error);
        showAlert("Error making withdrawal", "error");
    }
}

async function distributeDividends() {
    const fundId = document.getElementById('manager-fund-select').value;
    try {
        await contract.methods.distributeDividends(fundId)
            .send({ from: currentAccount });
        showAlert("Dividends distributed successfully!", "success");
    } catch (error) {
        console.error("Error distributing dividends:", error);
        showAlert("Error distributing dividends", "error");
    }
}

async function loadFundInvestors(fundId) {
const investorsList = document.getElementById('investors-list');
investorsList.innerHTML = '<tr><td colspan="3">Loading investors...</td></tr>';

try {
    // Get fund details to check if caller is manager
    const fundDetails = await contract.methods.funds(fundId).call();
    
    if (fundDetails.mmfManager.toLowerCase() !== currentAccount.toLowerCase()) {
        investorsList.innerHTML = '<tr><td colspan="3">Only fund manager can view investors</td></tr>';
        return;
    }

    const [investors, amounts] = await contract.methods.getAllInvestors(fundId).call({
        from: currentAccount
    });

    if (!investors || investors.length === 0) {
        investorsList.innerHTML = '<tr><td colspan="3">No investors found</td></tr>';
        return;
    }

    investorsList.innerHTML = investors.map((address, index) => `
        <tr>
            <td>${address}</td>
            <td>${web3.utils.fromWei(amounts[index].toString(), 'ether')} ETH</td>
            <td id="shares-${address}">Loading...</td>
        </tr>
    `).join('');

} catch (error) {
    console.error("Error loading investors:", error);
    investorsList.innerHTML = '<tr><td colspan="3">Error loading investors: ' + error.message + '</td></tr>';
}
}

// Update the manager fund select change handler
document.getElementById('manager-fund-select').addEventListener('change', function() {
const selectedFundId = this.value;
if (selectedFundId) {
    loadFundInvestors(selectedFundId);
}
});

async function claimDividend(fundId) {
    try {
        await contract.methods.claimDividend(fundId)
            .send({ from: currentAccount });
        showAlert("Dividend claimed successfully!", "success");
        loadInvestorData();
    } catch (error) {
        console.error("Error claiming dividend:", error);
        showAlert("Error claiming dividend: " + error.message, "error");
    }
}

function showSection(section) {
    document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
    event.target.classList.add('active');
    
    if (section === 'manager') {
        document.getElementById('manager-section').classList.remove('hidden');
        document.getElementById('investor-section').classList.add('hidden');
    } else {
        document.getElementById('manager-section').classList.add('hidden');
        document.getElementById('investor-section').classList.remove('hidden');
    }
}

function showAlert(message, type) {
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.textContent = message;
    document.querySelector('.main-content').prepend(alert);
    setTimeout(() => alert.remove(), 5000);
}

// Initialize app
init();

// Event listeners
document.getElementById('create-fund-form').addEventListener('submit', createFund);
document.getElementById('invest-form').addEventListener('submit', (e) => {
    e.preventDefault();
    invest(document.getElementById('investor-fund-select').value);
});