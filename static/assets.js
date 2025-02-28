let web3;
let account;
const contractAddress = "0xc84a6d795210c7a1ff830a8155c9b4d0b474a5f9"; // Replace with your deployed contract address
const abi = [
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
                    "internalType": "address",
                    "name": "user",
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
                    "name": "unlockTime",
                    "type": "uint256"
                },
                {
                    "indexed": false,
                    "internalType": "enum CryptoLocker.LockType",
                    "name": "lockType",
                    "type": "uint8"
                }
            ],
            "name": "Locked",
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
                    "indexed": true,
                    "internalType": "address",
                    "name": "user",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "amount",
                    "type": "uint256"
                }
            ],
            "name": "Unlocked",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "user",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "amount",
                    "type": "uint256"
                }
            ],
            "name": "Withdrawn",
            "type": "event"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "name": "fixedLocks",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "amount",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "unlockTime",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "dailyLimit",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "lastWithdrawal",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "withdrawnAmount",
                    "type": "uint256"
                },
                {
                    "internalType": "enum CryptoLocker.LockType",
                    "name": "lockType",
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
                    "name": "_user",
                    "type": "address"
                }
            ],
            "name": "getFixedLockDetails",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "amount",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "unlockTime",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "lastWithdrawal",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "withdrawnAmount",
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
                    "name": "_user",
                    "type": "address"
                }
            ],
            "name": "getTempLockDetails",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "amount",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "unlockTime",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "dailyLimit",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "lastWithdrawal",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "withdrawnAmount",
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
                    "name": "_lockDays",
                    "type": "uint256"
                }
            ],
            "name": "joinFixedLock",
            "outputs": [],
            "stateMutability": "payable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "_lockDays",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "_dailyLimit",
                    "type": "uint256"
                }
            ],
            "name": "joinTempLock",
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
            "name": "renounceOwnership",
            "outputs": [],
            "stateMutability": "nonpayable",
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
            "name": "tempLocks",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "amount",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "unlockTime",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "dailyLimit",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "lastWithdrawal",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "withdrawnAmount",
                    "type": "uint256"
                },
                {
                    "internalType": "enum CryptoLocker.LockType",
                    "name": "lockType",
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
            "inputs": [],
            "name": "unlockAll",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
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
        }
];

async function initWeb3() {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        await window.ethereum.request({ method: "eth_requestAccounts" });
        account = (await web3.eth.getAccounts())[0];
        document.getElementById("connectButton").style.display = "none";
    } else {
        alert("Please install MetaMask!");
    }
}

async function getContractInstance() {
    return new web3.eth.Contract(abi, contractAddress);
}

document.getElementById("connectButton").addEventListener("click", async () => {
    await initWeb3();
    document.getElementById("statusMessage").textContent = `Connected to ${account}`;
});

document.getElementById("joinFixedLockButton").addEventListener("click", async () => {
    const days = parseInt(document.getElementById("fixedLockDays").value);
    const amount = parseFloat(document.getElementById("fixedLockAmount").value);

    if (!days || days <= 0 || !amount || amount <= 0) {
        alert("Please enter valid lock duration and amount.");
        return;
    }

    const contract = await getContractInstance();
    try {
        await contract.methods.joinFixedLock(days).send({
            from: account,
            value: web3.utils.toWei(amount.toString(), "ether")
        });
        alert("Successfully joined Fixed Lock!");
    } catch (error) {
        console.error(error);
        alert("Error joining Fixed Lock.");
    }
});

document.getElementById("joinTempLockButton").addEventListener("click", async () => {
    const days = parseInt(document.getElementById("tempLockDays").value);
    const dailyLimit = parseFloat(document.getElementById("dailyLimit").value);
    const amount = parseFloat(document.getElementById("tempLockAmount").value);

    if (!days || days <= 0 || !dailyLimit || dailyLimit <= 0 || !amount || amount <= 0) {
        alert("Please enter valid lock duration, daily limit, and amount.");
        return;
    }

    const contract = await getContractInstance();
    try {
        await contract.methods.joinTempLock(days, web3.utils.toWei(dailyLimit.toString(), "ether")).send({
            from: account,
            value: web3.utils.toWei(amount.toString(), "ether")
        });
        alert("Successfully joined Temp Lock!");
    } catch (error) {
        console.error(error);
        alert("Error joining Temp Lock.");
    }
});

document.getElementById("withdrawButton").addEventListener("click", async () => {
    const amount = parseFloat(document.getElementById("withdrawAmount").value);

    if (!amount || amount <= 0) {
        alert("Please enter a valid withdrawal amount.");
        return;
    }

    const contract = await getContractInstance();
    try {
        await contract.methods.withdraw(web3.utils.toWei(amount.toString(), "ether")).send({ from: account });
        alert("Withdrawal successful!");
    } catch (error) {
        console.error(error);
        alert("Error during withdrawal.");
    }
});

document.getElementById("unlockAllButton").addEventListener("click", async () => {
    const contract = await getContractInstance();
    try {
        await contract.methods.unlockAll().send({ from: account });
        alert("All funds unlocked successfully!");
    } catch (error) {
        console.error(error);
        alert("Error unlocking funds.");
    }
});
document.getElementById("viewFixedLockDetailsButton").addEventListener("click", async () => {
    const contract = await getContractInstance();
    try {
        const result = await contract.methods.getFixedLockDetails(account).call();
        
        // Check if amount is 0 using the object property
        if (result.amount === "0") {
            alert("No Fixed Lock details found.");
            return;
        }

        // Access properties directly from the result object
        const details = `
            Amount: ${web3.utils.fromWei(result.amount)} ETH
            Unlock Time: ${new Date(result.unlockTime * 1000)}
            Last Withdrawal: ${new Date(result.lastWithdrawal * 1000)}
            Withdrawn Amount: ${web3.utils.fromWei(result.withdrawnAmount)} ETH
        `;
        document.getElementById("detailsOutput").textContent = details;
    } catch (error) {
        console.error(error);
        alert("Error fetching Fixed Lock details.");
    }
});

document.getElementById("viewTempLockDetailsButton").addEventListener("click", async () => {
    const contract = await getContractInstance();
    try {
        const result = await contract.methods.getTempLockDetails(account).call();
        
        // Check if amount is 0 using the object property
        if (result.amount === "0") {
            alert("No Temp Lock details found.");
            return;
        }

        // Access properties directly from the result object
        const details = `
            Amount: ${web3.utils.fromWei(result.amount)} ETH
            Unlock Time: ${new Date(result.unlockTime * 1000)}
            Daily Limit: ${web3.utils.fromWei(result.dailyLimit)} ETH
            Last Withdrawal: ${new Date(result.lastWithdrawal * 1000)}
            Withdrawn Amount: ${web3.utils.fromWei(result.withdrawnAmount)} ETH
        `;
        document.getElementById("detailsOutput").textContent = details;
    } catch (error) {
        console.error(error);
        alert("Error fetching Temp Lock details.");
    }
});

