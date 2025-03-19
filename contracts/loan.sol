// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract MicroLending {
    // Define loan types
    enum LoanType {
        FixedTerm,
        Instant
    }

    enum LoanDuration {
        OneMonth,
        SixMonths,
        TwelveMonths
    }

    // Predefined interest and penalty rates
    uint256 public constant INTEREST_RATE = 800; // 8.0% in basis points mostly for the fixed loan
    uint256 public constant INTEREST_RATE_INSTANT = 900; // 9.0% in basis points for the instant loan
    uint256 public constant PENALTY_RATE = 200; // 2.0% in basis points

    // Predefined minimum and maximum loan amounts for each loan type
    uint256 public constant FIXED_TERM_MAX_LOAN = 15 ether; // Maximum for FixedTerm loan
    uint256 public constant INSTANT_MAX_LOAN = 10 ether; // Maximum for Instant loan

    // Fixed Term loan default amount and duration
    uint256 public constant FIXED_TERM_DURATION_DAYS = 30; // Predefined duration (30 days)
    // Instant loan default amount and duration
    uint256 public constant INSTANT_LOAN_DURATION_DAYS = 7; // Predefined duration (7 days)

    // Loan struct for lending pools
    struct Loan {
        address payable lender;
        uint256 availableAmount;     // Amount available in the lending pool
        uint256 interestRate;
        bool active;                 // Whether the pool is active
        uint256 startTime;
        uint256 poolId;             // Unique identifier for the lending pool
        LoanType loanType;
    }

    // Loan application struct for the borrowers
   struct LoanApplication {
        uint256 applicationId;
        address payable borrower;
        uint256 poolId;             // References the lending pool
        uint256 requestedAmount;
        LoanDuration duration;
        bool approved;
        bool repaid;
        uint256 amountRepaid;
        uint256 dueDate;
        string purpose;             // Loan purpose/other data
    }

    // Mapping for loan applications
    mapping(uint256 => Loan) public lendingPools;
     mapping(address => bool) public hasFixedTermPool; // Track lenders with active fixed-term loans
    mapping(address => bool) public hasInstantPool; // Track lenders with active instant loans
    mapping(uint256 => LoanApplication) public loanApplications; // Track borrower applications

     uint256 public nextPoolId;
    uint256 public nextApplicationId;

    // Events for loan creation and status updates
   event LendingPoolCreated(
        uint256 indexed poolId,
        address indexed lender,
        uint256 amount,
        uint256 interestRate,
        LoanType loanType
    );

    event LoanApplicationCreated(
         uint256 indexed applicationId,
        uint256 indexed poolId,
        address indexed borrower,
        uint256 requestedAmount,
        LoanDuration duration
    );

       event LoanApproved(
        uint256 indexed applicationId,
        uint256 indexed poolId,
        address borrower,
        uint256 amount
    );

event LoanRepaid(
    uint256 indexed applicationId,
    uint256 principal,
    uint256 interest,
    uint256 penalty,
    uint256 daysLate  // Added daysLate
);
   
    // Function to create a fixed-term loan
     function createFixedTermPool() external payable {
        require(!hasFixedTermPool[msg.sender], "Already has active fixed-term pool");
        require(msg.value <= FIXED_TERM_MAX_LOAN, "Amount exceeds maximum fixed-term limit");
        require(msg.value > 0, "Must provide funds for pool");

        Loan memory newPool = Loan({
            lender: payable(msg.sender),
            availableAmount: msg.value,
            interestRate: INTEREST_RATE,
            active: true,
            startTime: block.timestamp,
            poolId: nextPoolId,
            loanType: LoanType.FixedTerm
        });

        lendingPools[nextPoolId] = newPool;
        hasFixedTermPool[msg.sender] = true;

        emit LendingPoolCreated(
            nextPoolId,
            msg.sender,
            msg.value,
            INTEREST_RATE,
            LoanType.FixedTerm
        );

        nextPoolId++;
    }

    // Create Instant lending pool
    function createInstantPool() external payable {
        require(!hasInstantPool[msg.sender], "Already has active instant pool");
        require(msg.value <= INSTANT_MAX_LOAN, "Amount exceeds maximum instant limit");
        require(msg.value > 0, "Must provide funds for pool");

        Loan memory newPool = Loan({
            lender: payable(msg.sender),
            availableAmount: msg.value,
            interestRate: INTEREST_RATE_INSTANT,
            active: true,
            startTime: block.timestamp,
            poolId: nextPoolId,
            loanType: LoanType.Instant
        });

        lendingPools[nextPoolId] = newPool;
        hasInstantPool[msg.sender] = true;

        emit LendingPoolCreated(
            nextPoolId,
            msg.sender,
            msg.value,
            INTEREST_RATE_INSTANT,
            LoanType.Instant
        );

        nextPoolId++;
    }
// Apply for loan from a specific pool
    function applyForLoan(
        uint256 _poolId,
        uint256 _requestedAmount,
        LoanDuration _duration,
        string calldata _purpose
    ) external {
        Loan storage pool = lendingPools[_poolId];
        require(pool.active, "Lending pool is not active");
        require(pool.availableAmount >= _requestedAmount, "Insufficient funds in pool");
        require(_requestedAmount > 0, "Must request positive amount");

        // Validate loan type specific requirements
        if (pool.loanType == LoanType.FixedTerm) {
            require(
                _duration == LoanDuration.SixMonths || _duration == LoanDuration.TwelveMonths,
                "Invalid duration for fixed-term loan"
            );
            require(_requestedAmount <= FIXED_TERM_MAX_LOAN, "Amount exceeds fixed-term limit");
        } else {
            require(_duration == LoanDuration.OneMonth, "Instant loans must be one month");
            require(_requestedAmount <= INSTANT_MAX_LOAN, "Amount exceeds instant limit");
        }

        LoanApplication memory application = LoanApplication({
            applicationId: nextApplicationId,
            borrower: payable(msg.sender),
            poolId: _poolId,
            requestedAmount: _requestedAmount,
            duration: _duration,
            approved: false,
            repaid: false,
            amountRepaid: 0,
            dueDate: 0, // Set during approval
            purpose: _purpose
        });

        loanApplications[nextApplicationId] = application;

        emit LoanApplicationCreated(
            nextApplicationId,
            _poolId,
            msg.sender,
            _requestedAmount,
            _duration
        );

        nextApplicationId++;
    }

// Previous code remains the same until the comment "Additional functions..."
// Adding new functions below:

    // Calculate days between timestamps
    function calculateDaysBetween(uint256 fromTimestamp, uint256 toTimestamp) internal pure returns (uint256) {
        require(toTimestamp >= fromTimestamp, "Invalid timestamp order");
        return (toTimestamp - fromTimestamp) / 1 days;
    }

    // Calculate late payment penalty
    function calculatePenalty(
        uint256 loanAmount,
        uint256 dueDate
    ) internal view returns (uint256) {
        if (block.timestamp <= dueDate) {
            return 0;
        }
        
        uint256 daysLate = calculateDaysBetween(dueDate, block.timestamp);
        uint256 penaltyAmount = (loanAmount * PENALTY_RATE * daysLate) / 10000;
        return penaltyAmount > loanAmount ? loanAmount : penaltyAmount;
    }

    // Calculate total repayment amount including interest and penalties
    function calculateRepaymentAmount(uint256 _applicationId) public view returns (
        uint256 totalAmount,
        uint256 principal,
        uint256 interest,
        uint256 penalty,
        uint256 daysLate
    ) {
        LoanApplication storage application = loanApplications[_applicationId];
        require(application.approved, "Loan not approved");
        require(!application.repaid, "Loan already repaid");

        Loan storage pool = lendingPools[application.poolId];
        
        principal = application.requestedAmount;
        interest = (principal * pool.interestRate) / 10000;
        
        if (block.timestamp > application.dueDate) {
            daysLate = calculateDaysBetween(application.dueDate, block.timestamp);
            penalty = calculatePenalty(principal, application.dueDate);
        }

        totalAmount = principal + interest + penalty;
        return (totalAmount, principal, interest, penalty, daysLate);
    }

    // Approve loan application
    function approveLoan(uint256 _applicationId) external {
        LoanApplication storage application = loanApplications[_applicationId];
        Loan storage pool = lendingPools[application.poolId];
        
        require(msg.sender == pool.lender, "Only pool lender can approve");
        require(pool.active, "Lending pool is not active");
        require(!application.approved, "Application already approved");
        require(pool.availableAmount >= application.requestedAmount, "Insufficient pool funds");

        // Calculate due date based on duration
        uint256 durationDays;
        if (application.duration == LoanDuration.OneMonth) {
            durationDays = 30;
        } else if (application.duration == LoanDuration.SixMonths) {
            durationDays = 180;
        } else {
            durationDays = 365;
        }

        application.approved = true;
        application.dueDate = block.timestamp + (durationDays * 1 days);
        
        // Update pool available amount
        pool.availableAmount -= application.requestedAmount;
        
        // Transfer funds to borrower
        payable(application.borrower).transfer(application.requestedAmount);

        emit LoanApproved(
            _applicationId,
            application.poolId,
            application.borrower,
            application.requestedAmount
        );
    }

    // Repay loan
    function repayLoan(uint256 _applicationId) external payable {
        LoanApplication storage application = loanApplications[_applicationId];
        Loan storage pool = lendingPools[application.poolId];
        
        require(application.approved, "Loan not approved");
        require(!application.repaid, "Loan already repaid");

        // Get repayment breakdown
        (uint256 totalAmount,
         uint256 principal,
         uint256 interest,
         uint256 penalty,
         uint256 daysLate) = calculateRepaymentAmount(_applicationId);

        require(msg.value >= totalAmount, "Insufficient repayment amount");

        // Update application status
        application.repaid = true;
        application.amountRepaid = msg.value;

        // Return funds to pool
        pool.availableAmount += principal;

        // Transfer payment to lender
        pool.lender.transfer(totalAmount);

        emit LoanRepaid(
            _applicationId,
            principal,
            interest,
            penalty,
            daysLate
        );

        // Return excess payment if any
        uint256 excess = msg.value - totalAmount;
        if (excess > 0) {
            payable(msg.sender).transfer(excess);
        }
    }

    // Close lending pool
    function closeLendingPool(uint256 _poolId) external {
        Loan storage pool = lendingPools[_poolId];
        require(msg.sender == pool.lender, "Only pool lender can close");
        require(pool.active, "Pool already closed");

        pool.active = false;
        
        // Reset lender's pool status
        if (pool.loanType == LoanType.FixedTerm) {
            hasFixedTermPool[msg.sender] = false;
        } else {
            hasInstantPool[msg.sender] = false;
        }

        // Return remaining funds to lender
        if (pool.availableAmount > 0) {
            pool.lender.transfer(pool.availableAmount);
        }
    }

    // View functions for pool and application details
    function getPoolDetails(uint256 _poolId) external view returns (
        address lender,
        uint256 availableAmount,
        uint256 interestRate,
        bool active,
        uint256 startTime,
        LoanType loanType
    ) {
        Loan storage pool = lendingPools[_poolId];
        return (
            pool.lender,
            pool.availableAmount,
            pool.interestRate,
            pool.active,
            pool.startTime,
            pool.loanType
        );
    }

    function getApplicationDetails(uint256 _applicationId) external view returns (
        address borrower,
        uint256 poolId,
        uint256 requestedAmount,
        LoanDuration duration,
        bool approved,
        bool repaid,
        uint256 amountRepaid,
        uint256 dueDate,
        string memory purpose
    ) {
        LoanApplication storage application = loanApplications[_applicationId];
        return (
            application.borrower,
            application.poolId,
            application.requestedAmount,
            application.duration,
            application.approved,
            application.repaid,
            application.amountRepaid,
            application.dueDate,
            application.purpose
        );
    }

    // Additional helper functions
    function getLenderPools(address _lender) external view returns (uint256[] memory) {
        uint256[] memory pools = new uint256[](nextPoolId);
        uint256 count = 0;
        
        for (uint256 i = 0; i < nextPoolId; i++) {
            if (lendingPools[i].lender == _lender) {
                pools[count] = i;
                count++;
            }
        }
        
        // Resize array to actual count
        assembly {
            mstore(pools, count)
        }
        
        return pools;
    }

    function getBorrowerApplications(address _borrower) external view returns (uint256[] memory) {
        uint256[] memory applications = new uint256[](nextApplicationId);
        uint256 count = 0;
        
        for (uint256 i = 0; i < nextApplicationId; i++) {
            if (loanApplications[i].borrower == _borrower) {
                applications[count] = i;
                count++;
            }
        }
        
        // Resize array to actual count
        assembly {
            mstore(applications, count)
        }
        
        return applications;
    }
}