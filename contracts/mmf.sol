// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

// npm install
// import "@openzeppelin/contracts-upgradeable";
//this is a contract for the mmf funding pool of the z banking
contract MoneyMarketFund is ReentrancyGuard, Ownable, Pausable {
    //mmf funding pool to tract all the created mmf funds by their managers
    struct Fund {
        address mmfManager;
        address investmentAccount;
        string mmfName;
        uint256 totalAssets;
        uint256 currentInvestors;
        uint256 creationTime;
        uint256 dividendPeriod;
        uint256 lastDividendTime;
        bool isActive;
        mapping(address => Investor) investors;
        address[] investorList;
    }
    //the investors struct to truck all the investors acts within the mmf
    struct Investor {
        uint256 investedAmount;
        uint256 shares;
        uint256 lastDepositTime;
        uint256 lastDividendClaimed;
        bool exists;
        bool hasMetInitialInvestment; // Track if investor has met initial minimum
    }

    // Constants that are predifined for the contract
    uint256 public constant MIN_INVESTMENT = 0.0001 ether; //for the investors joining the mmf
    uint256 public constant INITIAL_FUNDING = 0.01 ether; //for the fund managers
    uint256 public constant MAX_INVESTORS = 1000;
    uint256 public constant INITIAL_SHARE_PRICE = 1e18; // 1 ETH = 1 share initially
    uint256 public constant MANAGEMENT_FEE_PERCENTAGE = 1; // Example 1% state to change

    // State variables of the mmf contract
    mapping(uint256 => Fund) public funds;
    uint256 public totalFunds;

    // Events to manage the functions of the contract
    event FundCreated(
        uint256 indexed fundId,
        string mmfName,
        address manager,
        uint256 initialMinInvestment
    );
    event InvestmentMade(
        uint256 indexed fundId,
        address investor,
        uint256 amount,
        uint256 shares
    );
    event WithdrawalMade(
        uint256 indexed fundId,
        address investor,
        uint256 amount,
        uint256 shares
    );
    event DividendDistributed(uint256 indexed fundId, uint256 amount);
    event FundStatusChanged(uint256 indexed fundId, bool isActive);
    event TopUpReceived(
        uint256 indexed fundId,
        address indexed from,
        uint256 amount
    );

    constructor() Ownable(msg.sender) Pausable() {}

    // Modifiers of the contract to define the access of the functionalities of the contract
    modifier onlyFundManager(uint256 _fundId) {
        require(funds[_fundId].mmfManager == msg.sender, "Not fund manager");
        _;
    }

    modifier fundExists(uint256 _fundId) {
        require(_fundId < totalFunds, "Fund does not exist");
        _;
    }

    modifier fundActive(uint256 _fundId) {
        require(funds[_fundId].isActive, "Fund is not active");
        _;
    }

    // Updated createFund function with initialMinInvestment parameter and the mmf pools by the managers
    function createFund(
        string memory _mmfName,
        address _investmentAccount,
        uint256 _dividendPeriod,
        uint256 _initialMinInvestment
    ) external returns (uint256) {
        require(_investmentAccount != address(0), "Invalid investment account");
        require(_dividendPeriod > 0, "Invalid dividend period");
        require(
            _initialMinInvestment > 0,
            "Initial minimum investment must be greater than 0"
        );
        require(
            _initialMinInvestment > INITIAL_FUNDING,
            "Initial minimum investment must be greater than MIN_INVESTMENT"
        );

        uint256 fundId = totalFunds++;
        Fund storage newFund = funds[fundId];

        newFund.mmfManager = msg.sender;
        newFund.investmentAccount = _investmentAccount;
        newFund.mmfName = _mmfName;
        newFund.investorList = new address[](0);
        newFund.creationTime = block.timestamp;
        newFund.dividendPeriod = _dividendPeriod;
        newFund.lastDividendTime = block.timestamp;
        newFund.isActive = true;
        // newFund.initialMinInvestment = _initialMinInvestment;

        newFund.totalAssets += _initialMinInvestment;

        //logging of the events of the function
        emit FundCreated(fundId, _mmfName, msg.sender, _initialMinInvestment);
        return fundId;
    }

    // Updated invest function with initial investment check
    function invest(uint256 _fundId, uint256 _initialInvestment)
        external
        payable
        nonReentrant
        fundExists(_fundId)
        fundActive(_fundId)
    {
        Fund storage fund = funds[_fundId];
        require(fund.currentInvestors < MAX_INVESTORS, "Fund is full");

        Investor storage investor = fund.investors[msg.sender];

        // Check if the investor already exists
        require(!investor.exists, "You already have an account in this fund");

        // Check initial investment minimum only for new investors and not depositing nil
        _initialInvestment = msg.value;

        if (!investor.exists) {
            require(
                _initialInvestment > MIN_INVESTMENT,
                "Initial minimum investment must be greater than MIN_INVESTMENT"
            );
            investor.hasMetInitialInvestment = true;
        }

        uint256 shares = calculateShares(fund, _initialInvestment);

        // If new investor, add to investor list
        if (!investor.exists) {
            fund.investorList.push(msg.sender);
            fund.currentInvestors++;
            investor.exists = true;
        }

        investor.investedAmount += _initialInvestment; //for tracking the total amount invested to the mmf
        investor.shares += shares;
        investor.lastDepositTime = block.timestamp;
        fund.totalAssets += _initialInvestment;

        // Transfer investment from the investor account to investment account the mmf
        (bool success, ) = fund.investmentAccount.call{
            value: _initialInvestment
        }("");
        require(success, "Investment transfer failed");

        emit InvestmentMade(_fundId, msg.sender, _initialInvestment, shares);
    }

    // Updated topUpInvestment function with no minimum
    function topUpInvestment(uint256 _fundId)
        external
        payable
        nonReentrant
        fundExists(_fundId)
        fundActive(_fundId)
    {
        require(msg.value > 0, "Top-up amount must be greater than 0");

        Fund storage fund = funds[_fundId];
        Investor storage investor = fund.investors[msg.sender];

        // Require that the investor already exists
        require(investor.exists, "No account for this address");

        // Require that investor has already met initials investment
        require(
            investor.hasMetInitialInvestment,
            "Must make initial investment first"
        );

        uint256 shares = calculateShares(fund, msg.value);

        investor.investedAmount += msg.value;
        investor.shares += shares;
        investor.lastDepositTime = block.timestamp;
        fund.totalAssets += msg.value;

        // Transfer to investment account
        (bool success, ) = fund.investmentAccount.call{value: msg.value}("");
        require(success, "Top-up transfer failed");

        emit TopUpReceived(_fundId, msg.sender, msg.value);
    }

    // Updated managerTopUp function with no minimum
    function managerTopUp(uint256 _fundId)
        external
        payable
        nonReentrant
        fundExists(_fundId)
        onlyFundManager(_fundId)
    {
        require(msg.value > 0, "Top-up amount must be greater than 0");

        Fund storage fund = funds[_fundId];

        fund.totalAssets += msg.value;

        // Transfer to investment account
        (bool success, ) = fund.investmentAccount.call{value: msg.value}("");
        require(success, "Manager top-up transfer failed");

        emit TopUpReceived(_fundId, msg.sender, msg.value);
    }

    // Helper function to calculate shares
    function calculateShares(Fund storage fund, uint256 amount)
        internal
        view
        returns (uint256)
    {
        if (fund.totalAssets == 0) {
            return (amount * INITIAL_SHARE_PRICE) / 1 ether;
        } else {
            return (amount * fund.totalAssets) / fund.totalAssets;
        }
    }

    //Allow investors to withdraw their investments or a portion of their investments, along with any accumulated dividends or shares.
    function withdraw(uint256 _fundId, uint256 _amount)
        external
        nonReentrant
        fundExists(_fundId)
        fundActive(_fundId)
    {
        Fund storage fund = funds[_fundId];
        Investor storage investor = fund.investors[msg.sender];

        require(investor.exists, "Investor does not exist");
        require(
            investor.investedAmount >= _amount,
            "Insufficient funds to withdraw"
        );

        uint256 sharesToWithdraw = calculateShares(fund, _amount);

        // Deduct the amount and shares from the investor
        investor.investedAmount -= _amount;
        investor.shares -= sharesToWithdraw;
        fund.totalAssets -= _amount;

        // Transfer the amount back to the investor
        (bool success, ) = msg.sender.call{value: _amount}("");
        require(success, "Withdrawal transfer failed");

        emit WithdrawalMade(_fundId, msg.sender, _amount, sharesToWithdraw);
    }

    // To distribute dividends to investors (based on their shares)
    //using of the chainlink keeper
    function distributeDividends(uint256 _fundId)
        external
        onlyFundManager(_fundId)
        nonReentrant
        fundExists(_fundId)
    {
        Fund storage fund = funds[_fundId];
        require(fund.totalAssets > 0, "No assets to distribute");
         require(block.timestamp >= fund.lastDividendTime + fund.dividendPeriod, "Dividend distribution period not reached");
    

        uint256 totalDividend = fund.totalAssets;

        // Loop through each investor and distribute dividends based on their shares
        for (uint256 i = 0; i < fund.investorList.length; i++) {
            address investorAddr = fund.investorList[i];
            Investor storage investor = fund.investors[investorAddr];

            uint256 investorDividend = (investor.shares * totalDividend) /
                fund.totalAssets;

            // Transfer the dividends to the investor
            (bool success, ) = investorAddr.call{value: investorDividend}("");
            require(success, "Dividend transfer failed");

            emit DividendDistributed(_fundId, investorDividend);
        }

        fund.lastDividendTime = block.timestamp;
    }

    //this function allows the investors to claim their share of the dividends separately
    // (rather than automatically distributing to all investors at once).
    function claimDividend(uint256 _fundId)
        external
        nonReentrant
        fundExists(_fundId)
        fundActive(_fundId)
    {
        Fund storage fund = funds[_fundId];
        Investor storage investor = fund.investors[msg.sender];

        require(investor.exists, "Investor does not exist");

        // Calculate dividends based on investor's shares and total assets
        uint256 dividendAmount = (investor.shares * fund.totalAssets) /
            fund.totalAssets;

        // Ensure the investor is eligible for a dividend
        require(dividendAmount > 0, "No dividends to claim");

        // Transfer the dividend to the investor
        (bool success, ) = msg.sender.call{value: dividendAmount}("");
        require(success, "Dividend transfer failed");

        emit DividendDistributed(_fundId, dividendAmount);
    }

    //Fund Status Management
    //function to pause or unpause a fund,
    //giving the owner or manager the ability to freeze or resume the investment activities.
    function setFundStatus(uint256 _fundId, bool _status)
        external
        onlyFundManager(_fundId)
    {
        Fund storage fund = funds[_fundId];
        fund.isActive = _status;

        emit FundStatusChanged(_fundId, _status);
    }

    //Function Emergency Pause
    //  emergency pause functionality that can stop critical functions in case of a security issue.
    function emergencyPause() external onlyOwner {
        _pause(); // Pauses the contract
    }

    function emergencyUnpause() external onlyOwner {
        _unpause(); // Resumes the contract
    }

    //function for the Management Fees
    //the MMF Fund managers could earn a percentage of the fund for their services.

    function chargeManagementFee(uint256 _fundId)
        external
        onlyFundManager(_fundId)
        nonReentrant
    {
        Fund storage fund = funds[_fundId];
        uint256 managementFee = (fund.totalAssets * MANAGEMENT_FEE_PERCENTAGE) /
            100;

        fund.totalAssets -= managementFee;

        // Transfer the management fee to the fund manager
        (bool success, ) = fund.mmfManager.call{value: managementFee}("");
        require(success, "Fee transfer to the manager account failed");

        emit TopUpReceived(_fundId, fund.mmfManager, managementFee); // Log the fee transfer
    }

    //function to  Allow Fund Manager to View All Investors
    // Function for Fund Manager to view all investors in a fund
    function getAllInvestors(uint256 _fundId)
        external
        view
        onlyFundManager(_fundId)
        returns (address[] memory, uint256[] memory)
    {
        Fund storage fund = funds[_fundId];
        uint256 investorCount = fund.investorList.length;

        // Create arrays to hold investor addresses and their invested amounts
        address[] memory investors = new address[](investorCount);
        uint256[] memory investedAmounts = new uint256[](investorCount);

        for (uint256 i = 0; i < investorCount; i++) {
            address investorAddress = fund.investorList[i];
            Investor storage investor = fund.investors[investorAddress];
            investors[i] = investorAddress;
            investedAmounts[i] = investor.investedAmount;
        }

        return (investors, investedAmounts);
    }

    //function to  show all the open MMFs to an investor
    //This will help the investor see which MMFs are available for investment.
    function getOpenFunds()
        external
        view
        returns (uint256[] memory openFunds, string[] memory mmfNames)
    {
        uint256 openFundsCount = 0;

        // First, count how many open funds there are within the network
        for (uint256 i = 0; i < totalFunds; i++) {
            if (funds[i].isActive) {
                openFundsCount++;
            }
        }

        // Create an arrays to hold the fund IDs and names of all the open funds
        openFunds = new uint256[](openFundsCount);
        mmfNames = new string[](openFundsCount);

        uint256 j = 0;
        for (uint256 i = 0; i < totalFunds; i++) {
            if (funds[i].isActive) {
                openFunds[j] = i;
                mmfNames[j] = funds[i].mmfName;
                j++;
            }
        }

        return (openFunds, mmfNames);
    }

    // Function for an investor to view their MMF details and activities
    //only the ones the investor is in 
    function getInvestorFundDetails(uint256 _fundId)
        external
        view
        fundExists(_fundId)
        returns (
            string memory mmfName,
            uint256 totalAssets,
            uint256 currentInvestors,
            uint256 investedAmount,
            uint256 shares,
            uint256 lastDepositTime,
            uint256 lastDividendClaimed
        )
    {
        Fund storage fund = funds[_fundId];
        Investor storage investor = fund.investors[msg.sender];

        // this ensure that the investor exists in the fund
        require(investor.exists, "Investor does not exist in this MMF fund");

        mmfName = fund.mmfName;
        totalAssets = fund.totalAssets;
        currentInvestors = fund.currentInvestors;
        investedAmount = investor.investedAmount;
        shares = investor.shares;
        lastDepositTime = investor.lastDepositTime;
        lastDividendClaimed = investor.lastDividendClaimed;

        return (
            mmfName,
            totalAssets,
            currentInvestors,
            investedAmount,
            shares,
            lastDepositTime,
            lastDividendClaimed
        );
    }
}
