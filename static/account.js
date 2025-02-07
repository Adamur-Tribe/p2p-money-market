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

document.addEventListener("DOMContentLoaded", async () => {
    const connectButton = document.getElementById("connect-wallet");
    const walletAddressDisplay = document.getElementById("wallet-address");
    const balanceDisplay = document.getElementById("wallet-balance");
    const currencySelect = document.getElementById("currency-select");
    const networkSelect = document.getElementById("network-select");
    const customNetworkForm = document.getElementById("custom-network-form");
    const sendButton = document.getElementById("send-crypto");
    const recipientInput = document.getElementById("recipient-address");
    const amountInput = document.getElementById("send-amount");

    let provider, signer, ethToUsd, ethToKsh;

    async function checkWalletConnection() {
        if (window.ethereum) {
            provider = new ethers.providers.Web3Provider(window.ethereum);
            signer = provider.getSigner();
            const accounts = await provider.listAccounts();

            if (accounts.length > 0) {
                const userAddress = await signer.getAddress();
                walletAddressDisplay.textContent = userAddress;
                await updateBalance(userAddress);
                startAutoUpdate();
                await loadNetworks();
            }
        } else {
            alert("MetaMask is not installed. Please install it.");
        }
    }

    async function updateBalance(address) {
        if (!provider) return;
        const balance = await provider.getBalance(address);
        const ethBalance = ethers.utils.formatEther(balance);
        
        await fetchConversionRates();

        let convertedBalance;
        switch (currencySelect.value) {
            case "USD":
                convertedBalance = (ethBalance * ethToUsd).toFixed(2) + " USD";
                break;
            case "KSH":
                convertedBalance = (ethBalance * ethToKsh).toFixed(2) + " KSH";
                break;
            default:
                convertedBalance = ethBalance + " ETH";
        }

        balanceDisplay.textContent = convertedBalance;
    }

    async function fetchConversionRates() {
        try {
            const response = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd,kes");
            const data = await response.json();
            ethToUsd = data.ethereum.usd;
            ethToKsh = data.ethereum.kes;
        } catch (error) {
            console.error("Error fetching conversion rates:", error);
        }
    }

    async function sendCrypto() {
        if (!signer) {
            alert("Please connect your wallet first.");
            return;
        }

        const recipient = recipientInput.value.trim();
        const amount = amountInput.value.trim();

        if (!recipient || !amount || isNaN(amount)) {
            alert("Please enter a valid recipient address and amount.");
            return;
        }

        try {
            const tx = await signer.sendTransaction({
                to: recipient,
                value: ethers.utils.parseEther(amount),
            });

            alert("Transaction sent! Hash: " + tx.hash);
            await tx.wait();
            alert("Transaction confirmed!");

            updateBalance(await signer.getAddress());
        } catch (error) {
            console.error("Transaction error:", error);
            alert("Transaction failed: " + error.message);
        }
    }

    function startAutoUpdate() {
        setInterval(async () => {
            if (signer) {
                const userAddress = await signer.getAddress();
                await updateBalance(userAddress);
            }
        }, 30000);
    }

    async function loadNetworks() {
        if (!window.ethereum) return;

        const chainId = await window.ethereum.request({ method: "eth_chainId" });
        networkSelect.innerHTML = "";

        const predefinedNetworks = {
            "0x1": "Ethereum Mainnet",
            "0x89": "Polygon",
            "0x38": "Binance Smart Chain",
            "0x3": "Ropsten",
            "0x4": "Rinkeby",
            "0x5": "Goerli"
        };

        try {
            const enabledNetworks = await window.ethereum.request({ method: "wallet_getPermissions", params: [{ eth_accounts: {} }] });
            
            enabledNetworks.forEach(network => {
                const id = network.chainId;
                const name = network.name || `Network ${id}`;
                predefinedNetworks[id] = name;
            });

        } catch (error) {
            console.warn("Could not fetch enabled networks:", error);
        }

        Object.entries(predefinedNetworks).forEach(([id, name]) => {
            const option = document.createElement("option");
            option.value = id;
            option.textContent = name;
            if (id === chainId) option.selected = true;
            networkSelect.appendChild(option);
        });
    }

    async function switchNetwork() {
        const selectedNetwork = networkSelect.value;
        try {
            await window.ethereum.request({
                method: "wallet_switchEthereumChain",
                params: [{ chainId: selectedNetwork }]
            });
            alert("Switched network successfully.");
            checkWalletConnection();
        } catch (error) {
            if (error.code === 4902) {
                alert("This network is not available. Please add it manually.");
            } else {
                console.error("Network switch error:", error);
            }
        }
    }

    async function addCustomNetwork(event) {
        event.preventDefault();
        const chainId = document.getElementById("custom-chain-id").value;
        const chainName = document.getElementById("custom-chain-name").value;
        const rpcUrl = document.getElementById("custom-rpc-url").value;
        const currencySymbol = document.getElementById("custom-currency-symbol").value;
        const blockExplorerUrl = document.getElementById("custom-block-explorer").value;

        try {
            await window.ethereum.request({
                method: "wallet_addEthereumChain",
                params: [{
                    chainId: ethers.utils.hexValue(parseInt(chainId)),
                    chainName: chainName,
                    rpcUrls: [rpcUrl],
                    nativeCurrency: { name: currencySymbol, symbol: currencySymbol, decimals: 18 },
                    blockExplorerUrls: [blockExplorerUrl]
                }]
            });
            alert("Custom network added successfully.");
            checkWalletConnection();
        } catch (error) {
            console.error("Error adding custom network:", error);
        }
    }

    connectButton.addEventListener("click", checkWalletConnection);
    sendButton.addEventListener("click", sendCrypto);
    currencySelect.addEventListener("change", () => {
        if (signer) {
            signer.getAddress().then(updateBalance);
        }
    });
    networkSelect.addEventListener("change", switchNetwork);
    customNetworkForm.addEventListener("submit", addCustomNetwork);

    checkWalletConnection();
});


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