
const contractAddress = '0xcdba25dea463101e83fadac9ea5b99e2dfef191e'; 
const abi = [ 
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "chamaId",
                    "type": "uint256"
                },
                {
                    "indexed": false,
                    "internalType": "address",
                    "name": "member",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "enum ChamaManagement.AdminRole",
                    "name": "role",
                    "type": "uint8"
                }
            ],
            "name": "AdminAssigned",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "chamaId",
                    "type": "uint256"
                },
                {
                    "indexed": false,
                    "internalType": "address",
                    "name": "chairperson",
                    "type": "address"
                }
            ],
            "name": "ChamaCreated",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "chamaId",
                    "type": "uint256"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "totalDistributed",
                    "type": "uint256"
                }
            ],
            "name": "ChamaTerminated",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "chamaId",
                    "type": "uint256"
                },
                {
                    "indexed": false,
                    "internalType": "address",
                    "name": "member",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "amount",
                    "type": "uint256"
                }
            ],
            "name": "ContributionMade",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "proposalId",
                    "type": "uint256"
                }
            ],
            "name": "DevelopmentApproved",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "proposalId",
                    "type": "uint256"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "amount",
                    "type": "uint256"
                }
            ],
            "name": "DevelopmentFunded",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "chamaId",
                    "type": "uint256"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "proposalId",
                    "type": "uint256"
                },
                {
                    "indexed": false,
                    "internalType": "string",
                    "name": "title",
                    "type": "string"
                }
            ],
            "name": "DevelopmentProposed",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "proposalId",
                    "type": "uint256"
                },
                {
                    "indexed": false,
                    "internalType": "address",
                    "name": "voter",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "bool",
                    "name": "support",
                    "type": "bool"
                }
            ],
            "name": "DevelopmentVoteCast",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "chamaId",
                    "type": "uint256"
                },
                {
                    "indexed": false,
                    "internalType": "address",
                    "name": "member",
                    "type": "address"
                }
            ],
            "name": "InvitationSent",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "chamaId",
                    "type": "uint256"
                },
                {
                    "indexed": false,
                    "internalType": "address",
                    "name": "member",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "string",
                    "name": "uniqueName",
                    "type": "string"
                }
            ],
            "name": "MemberJoined",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "chamaId",
                    "type": "uint256"
                },
                {
                    "indexed": false,
                    "internalType": "address",
                    "name": "member",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "amount",
                    "type": "uint256"
                }
            ],
            "name": "PenaltyCharged",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "chamaId",
                    "type": "uint256"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "totalAmount",
                    "type": "uint256"
                }
            ],
            "name": "ProfitDistributed",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "chamaId",
                    "type": "uint256"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "requestId",
                    "type": "uint256"
                },
                {
                    "indexed": false,
                    "internalType": "address",
                    "name": "approver",
                    "type": "address"
                }
            ],
            "name": "WithdrawalApproved",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "chamaId",
                    "type": "uint256"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "requestId",
                    "type": "uint256"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "amount",
                    "type": "uint256"
                }
            ],
            "name": "WithdrawalExecuted",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "chamaId",
                    "type": "uint256"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "requestId",
                    "type": "uint256"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "amount",
                    "type": "uint256"
                }
            ],
            "name": "WithdrawalRequested",
            "type": "event"
        },
        {
            "inputs": [],
            "name": "ADMIN_APPROVAL_THRESHOLD",
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
            "name": "MAX_MEMBERS",
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
            "name": "MIN_MEMBERS",
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
            "name": "PENALTY_PERCENTAGE",
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
            "name": "VOTING_PERIOD",
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
                    "name": "_chamaId",
                    "type": "uint256"
                },
                {
                    "internalType": "string",
                    "name": "_uniqueName",
                    "type": "string"
                }
            ],
            "name": "acceptInvitation",
            "outputs": [],
            "stateMutability": "payable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "_chamaId",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "_proposalId",
                    "type": "uint256"
                }
            ],
            "name": "approveFunding",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "_chamaId",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "_requestId",
                    "type": "uint256"
                }
            ],
            "name": "approveWithdrawal",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "_chamaId",
                    "type": "uint256"
                },
                {
                    "internalType": "address",
                    "name": "_member",
                    "type": "address"
                },
                {
                    "internalType": "enum ChamaManagement.AdminRole",
                    "name": "_role",
                    "type": "uint8"
                }
            ],
            "name": "assignAdmin",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "chamaCount",
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
                    "name": "",
                    "type": "uint256"
                }
            ],
            "name": "chamas",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "chairperson",
                    "type": "address"
                },
                {
                    "internalType": "string",
                    "name": "chamaName",
                    "type": "string"
                },
                {
                    "internalType": "uint256",
                    "name": "minimumContribution",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "registrationFee",
                    "type": "uint256"
                },
                {
                    "internalType": "bool",
                    "name": "isActive",
                    "type": "bool"
                },
                {
                    "internalType": "uint256",
                    "name": "memberCount",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "balance",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "penaltyAmount",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "totalProfits",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "terminationDate",
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
                    "name": "_chamaId",
                    "type": "uint256"
                }
            ],
            "name": "contribute",
            "outputs": [],
            "stateMutability": "payable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "string",
                    "name": "_chamaName",
                    "type": "string"
                },
                {
                    "internalType": "uint256",
                    "name": "_minimumContribution",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "_registrationFee",
                    "type": "uint256"
                }
            ],
            "name": "createChama",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "developmentCount",
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
                    "name": "",
                    "type": "uint256"
                }
            ],
            "name": "developments",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "proposalId",
                    "type": "uint256"
                },
                {
                    "internalType": "string",
                    "name": "title",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "description",
                    "type": "string"
                },
                {
                    "internalType": "uint256",
                    "name": "requestedAmount",
                    "type": "uint256"
                },
                {
                    "internalType": "address",
                    "name": "proposer",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "votesFor",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "votesAgainst",
                    "type": "uint256"
                },
                {
                    "internalType": "enum ChamaManagement.ProposalStatus",
                    "name": "status",
                    "type": "uint8"
                },
                {
                    "internalType": "uint256",
                    "name": "proposalEndTime",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "fundingApprovalVotes",
                    "type": "uint256"
                },
                {
                    "internalType": "bool",
                    "name": "isFunded",
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
                    "name": "_chamaId",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "_amount",
                    "type": "uint256"
                }
            ],
            "name": "distributeProfits",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "_chamaId",
                    "type": "uint256"
                }
            ],
            "name": "getAcceptedMembers",
            "outputs": [
                {
                    "internalType": "address[]",
                    "name": "",
                    "type": "address[]"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "_chamaId",
                    "type": "uint256"
                }
            ],
            "name": "getChamaProposals",
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
                    "name": "_chamaId",
                    "type": "uint256"
                },
                {
                    "internalType": "address",
                    "name": "_member",
                    "type": "address"
                }
            ],
            "name": "getMemberContributions",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "totalContribution",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "profitShare",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "nextDeadline",
                    "type": "uint256"
                },
                {
                    "internalType": "bool",
                    "name": "hasPaidForPeriod",
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
                    "name": "_chamaId",
                    "type": "uint256"
                }
            ],
            "name": "getPendingMembers",
            "outputs": [
                {
                    "internalType": "address[]",
                    "name": "",
                    "type": "address[]"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "_proposalId",
                    "type": "uint256"
                }
            ],
            "name": "getProposalDetails",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "title",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "description",
                    "type": "string"
                },
                {
                    "internalType": "uint256",
                    "name": "requestedAmount",
                    "type": "uint256"
                },
                {
                    "internalType": "address",
                    "name": "proposer",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "votesFor",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "votesAgainst",
                    "type": "uint256"
                },
                {
                    "internalType": "enum ChamaManagement.ProposalStatus",
                    "name": "status",
                    "type": "uint8"
                },
                {
                    "internalType": "uint256",
                    "name": "proposalEndTime",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "fundingApprovalVotes",
                    "type": "uint256"
                },
                {
                    "internalType": "bool",
                    "name": "isFunded",
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
                    "name": "_user",
                    "type": "address"
                }
            ],
            "name": "getUserChamas",
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
                    "name": "_chamaId",
                    "type": "uint256"
                },
                {
                    "internalType": "string",
                    "name": "_title",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "_description",
                    "type": "string"
                },
                {
                    "internalType": "uint256",
                    "name": "_requestedAmount",
                    "type": "uint256"
                }
            ],
            "name": "proposeDevelopment",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "_chamaId",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "_amount",
                    "type": "uint256"
                },
                {
                    "internalType": "string",
                    "name": "_reason",
                    "type": "string"
                }
            ],
            "name": "requestEmergencyWithdrawal",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "_chamaId",
                    "type": "uint256"
                },
                {
                    "internalType": "address",
                    "name": "_memberAddress",
                    "type": "address"
                }
            ],
            "name": "sendInvitation",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "_chamaId",
                    "type": "uint256"
                },
                {
                    "internalType": "bool",
                    "name": "_isMonthly",
                    "type": "bool"
                },
                {
                    "internalType": "uint256",
                    "name": "_amount",
                    "type": "uint256"
                }
            ],
            "name": "setContributionSchedule",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "_chamaId",
                    "type": "uint256"
                }
            ],
            "name": "terminateChama",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "_chamaId",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "_proposalId",
                    "type": "uint256"
                },
                {
                    "internalType": "bool",
                    "name": "_support",
                    "type": "bool"
                }
            ],
            "name": "voteOnDevelopment",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        }
    ];

let web3;
let contract;
// Initialize Web3
window.addEventListener('load', async () => {
// Restore all data from previous session
restoreAllData();

const savedChamaId = localStorage.getItem('chamaId');
if (savedChamaId){
    document.getElementById('getChamaId').value = savedChamaId;
    getChamaDetails({preventDefault: () => {}});
}

if (window.ethereum) {
    web3 = new Web3(window.ethereum);
    await ethereum.request({ method: 'eth_requestAccounts' });
    contract = new web3.eth.Contract(abi, contractAddress);
    console.log('Web3 initialized and contract loaded');
} else {
    alert('Please install MetaMask!');
}
});

// Function to restore all data from localStorage
function restoreAllData() {
// Restore chama details
const chamaDetails = JSON.parse(localStorage.getItem('chamaDetails'));
if (chamaDetails) {
    const chamaDetailsTable = document.getElementById('chamaDetailsTable');
    const chamaDetailsBody = document.getElementById('chamaDetails');
    chamaDetailsBody.innerHTML = chamaDetails;
    chamaDetailsTable.style.display = 'table';
}

// Restore accepted members
const acceptedMembers = JSON.parse(localStorage.getItem('acceptedMembers'));
if (acceptedMembers) {
    const acceptedMembersTable = document.getElementById('acceptedMembersTable');
    const acceptedMembersBody = document.getElementById('acceptedMembers');
    acceptedMembersBody.innerHTML = acceptedMembers;
    acceptedMembersTable.style.display = 'table';
}

// Restore user chamas
const userChamas = JSON.parse(localStorage.getItem('userChamas'));
if (userChamas) {
    const userChamasTable = document.getElementById('userChamasTable');
    const userChamasBody = document.getElementById('userChamas');
    userChamasBody.innerHTML = userChamas;
    userChamasTable.style.display = 'table';
}

// Restore pending members
const pendingMembers = JSON.parse(localStorage.getItem('pendingMembers'));
if (pendingMembers) {
    const pendingMembersTable = document.getElementById('pendingMembersTable');
    const pendingMembersBody = document.getElementById('pendingMembers');
    pendingMembersBody.innerHTML = pendingMembers;
    pendingMembersTable.style.display = 'table';
}

// Restore form values from localStorage
const formFields = [
    'chamaName', 'minimumContribution', 'registrationFee',
    'chamaId', 'contributionAmount', 'proposalId', 'voteSupport',
    'withdrawChamaId', 'withdrawAmount', 'withdrawReason',
    'inviteChamaId', 'uniqueName', 'approveFundingChamaId',
    'approveProposalId', 'approveWithdrawalChamaId', 'approveRequestId',
    'assignAdminChamaId', 'adminAddress', 'adminRole',
    'distributeProfitsChamaId', 'profitsAmount', 'proposeChamaId',
    'developmentTitle', 'developmentDescription', 'requestedAmount',
    'sendInvitationChamaId', 'inviteMemberAddress', 
    'getAcceptedMembersChamaId', 'userAddress', 'getPendingMembersChamaId'
];

formFields.forEach(field => {
    const value = localStorage.getItem(field);
    if (value && document.getElementById(field)) {
        document.getElementById(field).value = value;
    }
});
}

// Function to save form field value to localStorage
function saveFormField(fieldId) {
const field = document.getElementById(fieldId);
if (field) {
    localStorage.setItem(fieldId, field.value);
}
}

// Modified getChamaDetails
async function getChamaDetails(event) {
event.preventDefault();

const chamaId = document.getElementById('getChamaId').value;
localStorage.setItem('chamaId', chamaId);

try {
    const details = await contract.methods.chamas(chamaId).call();
    
    const chamaDetailsTable = document.getElementById('chamaDetailsTable');
    const chamaDetailsBody = document.getElementById('chamaDetails');

    // Clear previous data
    chamaDetailsBody.innerHTML = '';

    // Append new data
    const row = `<tr>
        <td>${details[0]}</td>
        <td>${details[1]}</td>
        <td>${web3.utils.fromWei(details[2], 'ether')}</td>
        <td>${web3.utils.fromWei(details[3], 'ether')}</td>
        <td>${details[4]}</td>
        <td>${details[5]}</td>
        <td>${web3.utils.fromWei(details[6], 'ether')}</td>
        <td>${web3.utils.fromWei(details[7], 'ether')}</td>
        <td>${web3.utils.fromWei(details[8], 'ether')}</td>
        <td>${new Date(details[9] * 1000).toLocaleString()}</td>
    </tr>`;
    
    chamaDetailsBody.innerHTML += row;
    chamaDetailsTable.style.display = 'table';
    
    // Save to localStorage
    localStorage.setItem('chamaDetails', JSON.stringify(chamaDetailsBody.innerHTML));
} catch (error) {
    console.error("Error fetching chama details:", error);
    alert("Error fetching chama details: " + error.message);
}
}

// Modified getAcceptedMembers
async function getAcceptedMembers() {
const chamaId = document.getElementById('getAcceptedMembersChamaId').value;
localStorage.setItem('getAcceptedMembersChamaId', chamaId);

try {
    const members = await contract.methods.getAcceptedMembers(chamaId).call();

    const acceptedMembersTable = document.getElementById('acceptedMembersTable');
    const acceptedMembersBody = document.getElementById('acceptedMembers');

    // Clear previous data
    acceptedMembersBody.innerHTML = '';

    // Append new data
    members.forEach(member => {
        const row = `<tr><td>${member}</td></tr>`;
        acceptedMembersBody.innerHTML += row;
    });

    acceptedMembersTable.style.display = 'table';
    
    // Save to localStorage
    localStorage.setItem('acceptedMembers', JSON.stringify(acceptedMembersBody.innerHTML));
} catch (error) {
    console.error("Error fetching accepted members:", error);
    alert("Error fetching accepted members: " + error.message);
}
}

// Modified getUserChamas
async function getUserChamas() {
let userAddress = document.getElementById('userAddress').value;

// Check if userAddress is empty or invalid, use current account instead
if (!userAddress || userAddress === '0' || !web3.utils.isAddress(userAddress)) {
    const accounts = await web3.eth.getAccounts();
    userAddress = accounts[0];
    document.getElementById('userAddress').value = userAddress;
}

localStorage.setItem('userAddress', userAddress);

try {
    const chamas = await contract.methods.getUserChamas(userAddress).call();

    const userChamasTable = document.getElementById('userChamasTable');
    const userChamasBody = document.getElementById('userChamas');

    // Clear previous data
    userChamasBody.innerHTML = '';

    // Append new data
    chamas.forEach(chamaId => {
        const row = `<tr><td>${chamaId}</td></tr>`;
        userChamasBody.innerHTML += row;
    });

    userChamasTable.style.display = 'table';
    
    // Save to localStorage
    localStorage.setItem('userChamas', JSON.stringify(userChamasBody.innerHTML));
} catch (error) {
    console.error("Error fetching user chamas:", error);
    alert("Error fetching user chamas: " + error.message);
}
}

// Modified getPendingMembers function
// Corrected getPendingMembers function
async function getPendingMembers() {
const chamaId = document.getElementById('getPendingMembersChamaId').value;
localStorage.setItem('getPendingMembersChamaId', chamaId);

try {
    // First check if the current user is the chairperson
    const accounts = await web3.eth.getAccounts();
    const currentUser = accounts[0];
    const chamaDetails = await contract.methods.chamas(chamaId).call();
    
    // Convert both addresses to string and lowercase for comparison
    const chairpersonAddress = String(chamaDetails[4]).toLowerCase();
    const currentUserAddress = String(currentUser).toLowerCase();
    
    if (chairpersonAddress !== currentUserAddress) {
        throw new Error("Only chairperson can perform this action");
    }
    
    const pendingMembers = await contract.methods.getPendingMembers(chamaId).call();

    const pendingMembersTable = document.getElementById('pendingMembersTable');
    const pendingMembersBody = document.getElementById('pendingMembers');

    // Clear previous data
    pendingMembersBody.innerHTML = '';

    // Append new data
    pendingMembers.forEach(member => {
        const row = `<tr><td>${member}</td></tr>`;
        pendingMembersBody.innerHTML += row;
    });

    pendingMembersTable.style.display = 'table';
    
    // Save to localStorage
    localStorage.setItem('pendingMembers', JSON.stringify(pendingMembersBody.innerHTML));
} catch (error) {
    console.error("Error fetching pending members:", error);
    alert("Error fetching pending members: " + error.message);
}
}async function getPendingMembers() {
const chamaId = document.getElementById('getPendingMembersChamaId').value;
localStorage.setItem('getPendingMembersChamaId', chamaId);

try {
    // First check if the current user is the chairperson
    const accounts = await web3.eth.getAccounts();
    const currentUser = accounts[0];
    const chamaDetails = await contract.methods.chamas(chamaId).call();
    
    if (chamaDetails[4].toLowerCase() !== currentUser.toLowerCase()) {
        throw new Error("Only chairperson can perform this action");
    }
    
    const pendingMembers = await contract.methods.getPendingMembers(chamaId).call();

    const pendingMembersTable = document.getElementById('pendingMembersTable');
    const pendingMembersBody = document.getElementById('pendingMembers');

    // Clear previous data
    pendingMembersBody.innerHTML = '';

    // Append new data
    pendingMembers.forEach(member => {
        const row = `<tr><td>${member}</td></tr>`;
        pendingMembersBody.innerHTML += row;
    });

    pendingMembersTable.style.display = 'table';
    
    // Save to localStorage
    localStorage.setItem('pendingMembers', JSON.stringify(pendingMembersBody.innerHTML));
} catch (error) {
    console.error("Error fetching pending members:", error);
    alert("Error fetching pending members: " + error.message);
}
}

// Add form field saving to all input handlers
async function createChama() {
saveFormField('chamaName');
saveFormField('minimumContribution');
saveFormField('registrationFee');

const name = document.getElementById('chamaName').value;
const minContribution = document.getElementById('minimumContribution').value;
const regFee = document.getElementById('registrationFee').value;

const accounts = await web3.eth.getAccounts();
await contract.methods.createChama(name, minContribution, regFee)
    .send({ from: accounts[0] })
    .on('receipt', (receipt) => {
        console.log('Chama created!', receipt);
        alert('Chama created successfully!');
    })
    .on('error', (error) => {
        console.error(error);
        alert('Error creating Chama: ' + error.message);
    });
}

async function contribute() {
saveFormField('chamaId');
saveFormField('contributionAmount');

const chamaId = document.getElementById('chamaId').value;
const amount = document.getElementById('contributionAmount').value;

const accounts = await web3.eth.getAccounts();
await contract.methods.contribute(chamaId)
    .send({ from: accounts[0], value: web3.utils.toWei(amount, 'ether') })
    .on('receipt', (receipt) => {
        console.log('Contribution made!', receipt);
        alert('Contribution successful!');
    })
    .on('error', (error) => {
        console.error(error);
        alert('Error making contribution: ' + error.message);
    });
}

async function voteOnDevelopment() {
saveFormField('proposalId');
saveFormField('voteSupport');

const proposalId = document.getElementById('proposalId').value;
const support = document.getElementById('voteSupport').value.toLowerCase() === 'true';

const accounts = await web3.eth.getAccounts();
await contract.methods.voteOnDevelopment(proposalId, support)
    .send({ from: accounts[0] })
    .on('receipt', (receipt) => {
        console.log('Vote cast!', receipt);
        alert('Vote successfully cast!');
    })
    .on('error', (error) => {
        console.error(error);
        alert('Error casting vote: ' + error.message);
    });
}

async function requestEmergencyWithdrawal() {
saveFormField('withdrawChamaId');
saveFormField('withdrawAmount');
saveFormField('withdrawReason');

const chamaId = document.getElementById('withdrawChamaId').value;
const amount = document.getElementById('withdrawAmount').value;
const reason = document.getElementById('withdrawReason').value;

const accounts = await web3.eth.getAccounts();
await contract.methods.requestEmergencyWithdrawal(chamaId, amount, reason)
    .send({ from: accounts[0] })
    .on('receipt', (receipt) => {
        console.log('Withdrawal requested!', receipt);
        alert('Withdrawal request submitted!');
    })
    .on('error', (error) => {
        console.error(error);
        alert('Error requesting withdrawal: ' + error.message);
    });
}

async function acceptInvitation() {
saveFormField('inviteChamaId');
saveFormField('uniqueName');

const chamaId = document.getElementById('inviteChamaId').value;
const uniqueName = document.getElementById('uniqueName').value;

const accounts = await web3.eth.getAccounts();
await contract.methods.acceptInvitation(chamaId, uniqueName)
    .send({ from: accounts[0] })
    .on('receipt', (receipt) => {
        console.log('Invitation accepted!', receipt);
        alert('Invitation accepted successfully!');
    })
    .on('error', (error) => {
        console.error(error);
        alert('Error accepting invitation: ' + error.message);
    });
}

async function approveFunding() {
saveFormField('approveFundingChamaId');
saveFormField('approveProposalId');

const chamaId = document.getElementById('approveFundingChamaId').value;
const proposalId = document.getElementById('approveProposalId').value;

const accounts = await web3.eth.getAccounts();
await contract.methods.approveFunding(chamaId, proposalId)
    .send({ from: accounts[0] })
    .on('receipt', (receipt) => {
        console.log('Funding approved!', receipt);
        alert('Funding approved successfully!');
    })
    .on('error', (error) => {
        console.error(error);
        alert('Error approving funding: ' + error.message);
    });
}

async function approveWithdrawal() {
saveFormField('approveWithdrawalChamaId');
saveFormField('approveRequestId');

const chamaId = document.getElementById('approveWithdrawalChamaId').value;
const requestId = document.getElementById('approveRequestId').value;

const accounts = await web3.eth.getAccounts();
await contract.methods.approveWithdrawal(chamaId, requestId)
    .send({ from: accounts[0] })
    .on('receipt', (receipt) => {
        console.log('Withdrawal approved!', receipt);
        alert('Withdrawal approved successfully!');
    })
    .on('error', (error) => {
        console.error(error);
        alert('Error approving withdrawal: ' + error.message);
    });
}

async function assignAdmin() {
saveFormField('assignAdminChamaId');
saveFormField('adminAddress');
saveFormField('adminRole');

const chamaId = document.getElementById('assignAdminChamaId').value;
const adminAddress = document.getElementById('adminAddress').value;
const adminRole = document.getElementById('adminRole').value;

const accounts = await web3.eth.getAccounts();
await contract.methods.assignAdmin(chamaId, adminAddress, adminRole)
    .send({ from: accounts[0] })
    .on('receipt', (receipt) => {
        console.log('Admin assigned!', receipt);
        alert('Admin assigned successfully!');
    })
    .on('error', (error) => {
        console.error(error);
        alert('Error assigning admin: ' + error.message);
    });
}

async function distributeProfits() {
saveFormField('distributeProfitsChamaId');
saveFormField('profitsAmount');

const chamaId = document.getElementById('distributeProfitsChamaId').value;
const amount = document.getElementById('profitsAmount').value;

const accounts = await web3.eth.getAccounts();
await contract.methods.distributeProfits(chamaId, amount)
    .send({ from: accounts[0] })
    .on('receipt', (receipt) => {
        console.log('Profits distributed!', receipt);
        alert('Profits distributed successfully!');
    })
    .on('error', (error) => {
        console.error(error);
        alert('Error distributing profits: ' + error.message);
    });
}

async function proposeDevelopment() {
saveFormField('proposeChamaId');
saveFormField('developmentTitle');
saveFormField('developmentDescription');
saveFormField('requestedAmount');

const chamaId = document.getElementById('proposeChamaId').value;
const title = document.getElementById('developmentTitle').value;
const description = document.getElementById('developmentDescription').value;
const requestedAmount = document.getElementById('requestedAmount').value;

const accounts = await web3.eth.getAccounts();
await contract.methods.proposeDevelopment(chamaId, title, description, requestedAmount)
    .send({ from: accounts[0] })
    .on('receipt', (receipt) => {
        console.log('Development proposed!', receipt);
        alert('Development proposed successfully!');
    })
    .on('error', (error) => {
        console.error(error);
        alert('Error proposing development: ' + error.message);
    });
}

async function sendInvitation() {
saveFormField('sendInvitationChamaId');
saveFormField('inviteMemberAddress');

const chamaId = document.getElementById('sendInvitationChamaId').value;
const memberAddress = document.getElementById('inviteMemberAddress').value;

const accounts = await web3.eth.getAccounts();
await contract.methods.sendInvitation(chamaId, memberAddress)
    .send({ from: accounts[0] })
    .on('receipt', (receipt) => {
        console.log('Invitation sent!', receipt);
        alert('Invitation sent successfully!');
    })
    .on('error', (error) => {
        console.error(error);
        alert('Error sending invitation: ' + error.message);
    });
}