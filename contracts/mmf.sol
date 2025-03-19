// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

//contract for lending and borrowing
contract MicroLending {
    //defining the loa struct
    struct Loan {
        address payable lender; //owner of the loan
        address borrower;
        uint loanAmount;
        uint interestRate;
        uint loanTerm; //duration for loan payment
        uint dueDate;
        uint amountRepaid;
        uint penaltyRate;
        bool active;
        bool repaid;
         uint startTime;
        uint monthlyCheckpoint;
        uint originalAmount;
        uint applicationId;
    }

    //defining the loan aplication struct
      struct LoanApplication {
        bool openApp;
        uint applicationId;
        address borrower;
        uint duration;
        uint creditAmount;
        uint interestRate;
        string otherData;
    }

    //defining the lender struct
    struct Lender {
        string name;
        address lenderWallet;
        bool active;
    }

    //defining the borrower strucct
    struct Borrower {
        string name;
        address borrowerWallet;
        bool active;
    }

    //the state variables defination
    //mapping the  address to store borower and lenders info
    mapping(address => Borrower) public borrowers;
    mapping(address => Lender) public lenders;
    mapping(address => Loan[]) public borrowerLoans; // loan for each borrower
    mapping(address => Loan[]) public lenderLoans; //Loans for each lender
    mapping(address => uint) public balance;
    mapping(address => bool) public hasOngoingLoan;
    mapping(address => bool) public hasOngoingApplication;
    mapping(address => bool) public hasOngoingInvestment;
    mapping(uint => LoanApplication) public applications;
    
    uint public numOfApplications;
    uint public numLoans;

    //define the events for the contract
    event LoanRequested(
        address borrower,
        uint amount,
        uint interestRate,
        uint term
    );
    event Repayment(address borrower, uint amount, uint loanIndex);
    event LoanApproved(
        address lender,
        address borrower,
        uint amount,
        uint dueDte
    );
    event LoanCLosed(address borrower, uint loanIndex);
    event Penatly(address borrower, uint amount, uint loanIndex);
    event ApplicationCreated(
        uint applicationId, 
        address borrower, 
        uint amount
    ); //for tracking new applications

    //modifers definition for the contract access
    modifier OnlyLender(address lender) {
        require(
            msg.sender == lender,
            "Only the lender can make these modification. "
        );
        _;
    }

    modifier OnlyBorrower(address borrower) {
        require(
            msg.sender == borrower,
            "Only the borrower can perform this action. "
        );
        _;
    }

    //contract functions definations

    //function to enable regiser of lender accounts
    function createLender(string memory _name) external  {
        require(!lenders[msg.sender].active, "Lender already exists");
        Lender memory lender;
        lenders[msg.sender] = lender;//update lender to lenders map
        lender.name = _name;
        lender.lenderWallet = msg.sender;
        lender.active = true;
        balance[msg.sender] = 0; //initial balance to zero during registration
    }

    //function to enable regiser of borrower accounts
    function createBorrower(string memory _name) external  {
        require(!borrowers[msg.sender].active, "Borrower already exists");
        Borrower memory borrower;
        borrowers[msg.sender] = borrower;//update borrower to borrowers map
        borrower.name = _name;
        borrower.borrowerWallet = msg.sender;
        borrower.active = true;
        balance[msg.sender] = 0; //initial balance to zero during registration
    }

    // Function to register Lender and Deposit Funds to there account
    function registerLender() external payable {
        require(msg.value > 0, "Lender must deposit funds to become eligible to lend.");
        require(lenders[msg.sender].active, "You must create a lender account first.");
        balance[msg.sender] += msg.value;  // Add deposit to lender balance
    }

     // New function to create loan application
    function createApplication(
        uint duration,
        uint interestRate,
        uint creditAmount,
        string memory otherData
    ) external {
        require(!hasOngoingLoan[msg.sender], "Already has an ongoing loan");
        require(!hasOngoingApplication[msg.sender], "Already has an ongoing application");
        require(borrowers[msg.sender].active, "Must be a registered borrower");

        applications[numOfApplications] = LoanApplication({
            openApp: true,
            applicationId: numOfApplications,
            borrower: msg.sender,
            duration: duration,
            creditAmount: creditAmount,
            interestRate: interestRate,
            otherData: otherData
        });

        numOfApplications += 1;
        hasOngoingApplication[msg.sender] = true;
        
        emit ApplicationCreated(numOfApplications - 1, msg.sender, creditAmount);
    }

        // Function to get loan applications info as by the borrowers
    function getApplicationData(uint index) external view returns (
        uint[] memory numericalData,
        string memory otherData,
        address borrower
    ) {
        LoanApplication storage app = applications[index];
        uint[] memory data = new uint[](4);
        data[0] = index;
        data[1] = app.duration;
        data[2] = app.creditAmount;
        data[3] = app.interestRate;
        
        return (data, app.otherData, app.borrower);
    }

    // Check if application is open
    function isApplicationOpen(uint index) public view returns (bool) {
        return applications[index].openApp;
    }

    // Check if loan is open
    function isLoanOpen(uint loanIndex) public view returns (bool) {
        require(loanIndex < borrowerLoans[msg.sender].length, "Invalid loan index");
        return borrowerLoans[msg.sender][loanIndex].active;
    }


    //function to register borrower and enable them to ask for loan
    function requestLoan(uint _amount) external {
        uint256 _interestRate = 2;
        uint256 _term = 2;
        uint256 _penaltyRate = 2;

        require(
            _amount > 0, 
            "Loan amount must be great  than zero"
        );
        require(borrowers[msg.sender].active, "You must create a borrower account first.");

        //updating the state of the cotract of the loan
        Loan memory newLoan = Loan({
            loanAmount: _amount,
            interestRate: _interestRate,
            loanTerm: _term,
            dueDate: block.timestamp + (_term * 1 days),// Loan due date set by loan term
            amountRepaid: 0,
            penaltyRate: _penaltyRate,
            borrower: msg.sender,
            lender: payable(address(0)),//initially, no lender assiged to this untill approvall
            active: false,
            repaid: false,
            startTime: block.timestamp,
            monthlyCheckpoint: 0,
            originalAmount: _amount,
            applicationId: numOfApplications
        });

        //add newLoan to the loan array/list
        borrowerLoans[msg.sender].push(newLoan);

        //logging the function event
        emit LoanRequested(msg.sender, _amount, _interestRate, _term);
    }

    //function to check the loan legibility and approve the loan
    function approveLoan(
        address borrower,
        uint loanIndex
    ) external payable OnlyLender(msg.sender) {
        require(
            loanIndex < borrowerLoans[borrower].length,
            "Invalid loan index"
        );

        //get the loan to be approved from the loan map
        Loan storage loan = borrowerLoans[borrower][loanIndex];
        require(
            loan.active == false, 
            "Loan is already active."
        );
        require(
            msg.value == loan.loanAmount,
            "Lender must deposit the exact loan amount."
        );

        //updating the state of the contract
        uint loanAmount = msg.value;
        uint totalLoanOwned = loanAmount + (loanAmount * loan.interestRate) / 100;
        loan.loanAmount += totalLoanOwned;
        loan.lender = payable(msg.sender);
        loan.active = true;
        //transfare from lender to borrower
        balance[msg.sender] -= msg.value;
        balance[borrower] += totalLoanOwned;

        //logging the fuction
        emit LoanApproved(msg.sender, borrower, msg.value, loan.dueDate);
    }

    //function to anable the loaned to make repayment of the loan
    function loanrepayment(
        uint loanIndex
    ) external payable OnlyBorrower(msg.sender) {
        require(
            loanIndex < borrowerLoans[msg.sender].length,
            "Invalid loan index."
        );

        Loan storage loan = borrowerLoans[msg.sender][loanIndex];
        require(loan.active == true, "Loan is not active.");
        require(msg.value > 0, "Repayment amount must be greater than zero.");

        
        //update the repayment
        loan.amountRepaid += msg.value;
        loan.loanAmount -= msg.value;
        balance[msg.sender] -= msg.value;
        balance[loan.lender] += msg.value;

        //check if there is penalty application to the borrower
        if (block.timestamp > loan.dueDate) {
            //calculate the penalty for the borrower
            uint penalty = (msg.value * loan.penaltyRate) / 10000;
            //update the borrower and lender balance
            balance[loan.lender] += penalty;
            balance[msg.sender] -= penalty;
            emit Penatly(msg.sender, penalty, loanIndex);
        }

        //check if the loan if already paid by the borrower
        if (loan.amountRepaid == 0) {
            loan.active = false;
            loan.repaid = true;
            hasOngoingLoan[msg.sender] = false;
            hasOngoingApplication[msg.sender] = false;
            hasOngoingInvestment[loan.lender] = false;
            emit LoanCLosed(msg.sender, loanIndex);
        }

        emit Repayment(msg.sender, msg.value, loanIndex);
    }

    //function to get the loan details
    //  function getLoanDetails(address borrower, uint256 loanIndex) external view returns (Loan memory) {
    //     require(
    //         loanIndex < borrowerLoans[borrower].length,
    //         "Invalid loan index."
    //         );
    //     return borrowerLoans[borrower][loanIndex];
    // }
    
    //function to get the borrower's loan balance
    function getLoanBlanace(uint _loanIndex) external view OnlyBorrower(msg.sender) returns (uint){
        require(_loanIndex < borrowerLoans[msg.sender].length, "Invalid loan Index");

        //get the loan of the borrower by the index

        Loan memory loan = borrowerLoans[msg.sender][_loanIndex];
        uint totalLoan = loan.loanAmount + (loan.loanAmount* loan.interestRate) / 100;
        uint amountOwed = totalLoan - loan.amountRepaid;

        //calculate the loan penalty if overdue by date
        if (block.timestamp > loan.dueDate && !loan.repaid){
            uint penalty = (amountOwed * loan.penaltyRate)/ 10000;
            amountOwed += penalty;
        }

        return amountOwed;
    }

    //function to get the lenders balances
    // function getLenderBalance() external view returns (uint256) {
    //     return lender[msg.sender];
    // }

    // //function to get the borrower's balances
    // function getBorrowerBalance() external view returns (uint256) {
    //     return borrowerBalance[msg.sender];
    // }

    // Function to withdraw balance
    // function withdraw(uint amount) external returns (uint) {
    //     require(amount <= balance[msg.sender], "Insufficient balance");
    //     balance[msg.sender] -= amount;
    //     payable(msg.sender).transfer(amount);
    //     return amount;
    // }


     //function to get the lenders and borrowers balances
    function getLenderBalance() external view returns (uint256) {
        return balance[msg.sender];
    }

    //function to get the loan detais info
    function getLoanInfo(
        uint loanIndex
    )
        external
        view
        returns (
            address lender,
            address borrower,
            uint loanAmount,
            uint interestRate,
            uint loanTerm,
            uint dueDate,
            uint amountRepaid,
            uint penaltyRate,
            bool active
        )
    {
        require(
            loanIndex < borrowerLoans[msg.sender].length,
            "Invalid loan index"
        );
        Loan storage loan = borrowerLoans[msg.sender][loanIndex];
        return (
            loan.lender,
            loan.borrower,
            loan.loanAmount,
            loan.interestRate,
            loan.loanTerm,
            loan.dueDate,
            loan.amountRepaid,
            loan.penaltyRate,
            loan.active
        );
    }

    //end
}
