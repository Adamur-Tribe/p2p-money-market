// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Importing the ERC-20 and ERC-721 interfaces from OpenZeppelin
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract SecureWallet is ReentrancyGuard {
    address public owner;

    // Mapping to track token balances for ERC20 tokens
    mapping(address => mapping(address => uint256)) public erc20Balances; // user => token address => balance
    mapping(address => mapping(address => bool)) public erc721Ownership; // user => token address => owned NFT token id

    // Events to track deposits and withdrawals
    event DepositETH(address indexed user, uint256 amount);
    event WithdrawETH(address indexed user, uint256 amount);
    event DepositERC20(address indexed user, address indexed token, uint256 amount);
    event WithdrawERC20(address indexed user, address indexed token, uint256 amount);
    event DepositERC721(address indexed user, address indexed token, uint256 tokenId);
    event WithdrawERC721(address indexed user, address indexed token, uint256 tokenId);

    // Modifier to ensure only the wallet owner can interact
    modifier onlyOwner() {
        require(msg.sender == owner, "Not the wallet owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    // Deposit Ether into the wallet
    function depositETH() external payable {
        require(msg.value > 0, "You must send ETH");
        emit DepositETH(msg.sender, msg.value);
    }

    // Withdraw Ether from the wallet
    function withdrawETH(uint256 amount) external onlyOwner nonReentrant {
        require(address(this).balance >= amount, "Insufficient balance");
        payable(owner).transfer(amount);
        emit WithdrawETH(owner, amount);
    }

    // Deposit ERC-20 tokens into the wallet
    function depositERC20(address token, uint256 amount) external {
        require(amount > 0, "Amount must be greater than 0");
        IERC20(token).transferFrom(msg.sender, address(this), amount);
        erc20Balances[msg.sender][token] += amount;
        emit DepositERC20(msg.sender, token, amount);
    }

    // Withdraw ERC-20 tokens from the wallet
    function withdrawERC20(address token, uint256 amount) external nonReentrant {
        require(erc20Balances[msg.sender][token] >= amount, "Insufficient balance");
        erc20Balances[msg.sender][token] -= amount;
        IERC20(token).transfer(msg.sender, amount);
        emit WithdrawERC20(msg.sender, token, amount);
    }

    // Deposit ERC-721 token (NFT) into the wallet
    function depositERC721(address token, uint256 tokenId) external {
        IERC721(token).transferFrom(msg.sender, address(this), tokenId);
        erc721Ownership[msg.sender][token] = true;
        emit DepositERC721(msg.sender, token, tokenId);
    }

    // Withdraw ERC-721 token (NFT) from the wallet
    function withdrawERC721(address token, uint256 tokenId) external onlyOwner nonReentrant {
        require(erc721Ownership[msg.sender][token], "No NFT owned");
        IERC721(token).transferFrom(address(this), msg.sender, tokenId);
        delete erc721Ownership[msg.sender][token];
        emit WithdrawERC721(msg.sender, token, tokenId);
    }

    // Get the balance of an ERC-20 token for a specific user
    function getERC20Balance(address user, address token) external view returns (uint256) {
        return erc20Balances[user][token];
    }

    // Check if the user owns an ERC-721 token (NFT)
    function checkERC721Ownership(address user, address token) external view returns (bool) {
        return erc721Ownership[user][token];
    }

    // Get the balance of native Ether in the wallet
    function getETHBalance() external view returns (uint256) {
        return address(this).balance;
    }

    // Transfer Ether from the wallet to a recipient
    function transferETH(address to, uint256 amount) external onlyOwner nonReentrant {
        require(address(this).balance >= amount, "Insufficient balance");
        payable(to).transfer(amount);
    }

    // Transfer ERC-20 token from the wallet to a recipient
    function transferERC20(address token, address to, uint256 amount) external onlyOwner nonReentrant {
        require(erc20Balances[msg.sender][token] >= amount, "Insufficient balance");
        erc20Balances[msg.sender][token] -= amount;
        IERC20(token).transfer(to, amount);
    }

    // Transfer ERC-721 token (NFT) from the wallet to a recipient
    function transferERC721(address token, address to, uint256 tokenId) external onlyOwner nonReentrant {
        IERC721(token).transferFrom(address(this), to, tokenId);
    }
}
