// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ChamaInvestmentGroup{
    enum AdminRole {
        NONE,
        SECRETARY,
        TREASURER,
        DEV_MANAGER
    }
    enum ProposalStatus {
        PENDING,
        APPROVED,
        REJECTED,
        EXECUTED
    }

    struct Member {
        address memberAddress;
        string uniqueName;
        bool hasAccepted;
        bool hasPaid;
        uint256 registrationDate;
        AdminRole role;
    }

    struct Chama {
        address chairperson;
        string chamaName;
        uint256 minimumContribution;
        uint256 registrationFee;
        bool isActive;
        uint256 memberCount;
        uint256 balance;
        mapping(address => Member) members;
        address[] memberAddresses;
        address[] pendingInvites;
        uint256[] developmentProposals;
        uint256 penaltyAmount;
        uint256 totalProfits;
        uint256 terminationDate; // 0 if not terminated
        mapping(address => ContributionSchedule) contributionSchedules;
        mapping(address => uint256) totalContributions;
        mapping(address => uint256) profitShares;
        WithdrawalRequest[] withdrawalRequests;
    }
    struct ContributionSchedule {
    bool isMonthly; // true for monthly, false for weekly
    uint256 amount;
    uint256 deadline; // timestamp for next deadline
    uint256 totalContributed;
    uint256 lastContributionDate;
    bool hasPaidForPeriod;
}

struct WithdrawalRequest {
    uint256 requestId;
    uint256 amount;
    string reason;
    address requester;
    uint256 approvalCount;
    mapping(address => bool) hasApproved;
    bool executed;
    uint256 requestDate;
}

    struct Development {
        uint256 proposalId;
        string title;
        string description;
        uint256 requestedAmount;
        address proposer;
        uint256 votesFor;
        uint256 votesAgainst;
        mapping(address => bool) hasVoted;
        ProposalStatus status;
        uint256 proposalEndTime;
        uint256 fundingApprovalVotes;
        mapping(address => bool) fundingVoted;
        bool isFunded;
    }

    mapping(uint256 => Chama) public chamas;
    mapping(uint256 => Development) public developments;
    uint256 public chamaCount;
    uint256 public developmentCount;

    // Events
    event ChamaCreated(uint256 chamaId, address chairperson);
    event InvitationSent(uint256 chamaId, address member);
    event MemberJoined(uint256 chamaId, address member, string uniqueName);
    event AdminAssigned(uint256 chamaId, address member, AdminRole role);
    event DevelopmentProposed(
        uint256 chamaId,
        uint256 proposalId,
        string title
    );
    event DevelopmentVoteCast(uint256 proposalId, address voter, bool support);
    event DevelopmentApproved(uint256 proposalId);
    event DevelopmentFunded(uint256 proposalId, uint256 amount);
     event ContributionMade(uint256 chamaId, address member, uint256 amount);
    event PenaltyCharged(uint256 chamaId, address member, uint256 amount);
    event ProfitDistributed(uint256 chamaId, uint256 totalAmount);
    event WithdrawalRequested(uint256 chamaId, uint256 requestId, uint256 amount);
    event WithdrawalApproved(uint256 chamaId, uint256 requestId, address approver);
    event WithdrawalExecuted(uint256 chamaId, uint256 requestId, uint256 amount);
    event ChamaTerminated(uint256 chamaId, uint256 totalDistributed);


    // Constants
     uint256 public constant PENALTY_PERCENTAGE = 5; // 5% penalty
    uint256 public constant ADMIN_APPROVAL_THRESHOLD = 75; // 75% admin approval needed

    uint256 public constant MAX_MEMBERS = 100;
    uint256 public constant MIN_MEMBERS = 12;
    uint256 public constant VOTING_PERIOD = 7 days;

    modifier onlyChairperson(uint256 _chamaId) {
        require(
            msg.sender == chamas[_chamaId].chairperson,
            "Only chairperson can perform this action"
        );
        _;
    }

    modifier onlyDevManager(uint256 _chamaId) {
        require(
            chamas[_chamaId].members[msg.sender].role == AdminRole.DEV_MANAGER,
            "Only development manager can perform this action"
        );
        _;
    }

    modifier onlyTreasurer(uint256 _chamaId) {
        require(
            chamas[_chamaId].members[msg.sender].role == AdminRole.TREASURER,
            "Only treasurer can perform this action"
        );
        _;
    }

    function createChama(
        string memory _chamaName,
        uint256 _minimumContribution,
        uint256 _registrationFee
    ) public {
        uint256 chamaId = chamaCount++;
        Chama storage newChama = chamas[chamaId];

        newChama.chairperson = msg.sender;
        newChama.chamaName = _chamaName;
        newChama.minimumContribution = _minimumContribution;
        newChama.registrationFee = _registrationFee;
        newChama.isActive = false; // Will be activated when MIN_MEMBERS is reached
        newChama.memberCount = 0;
        newChama.balance = 0; // Initialize balance

        // Add chairperson as first member
        Member memory chairMember = Member({
            memberAddress: msg.sender,
            uniqueName: "Chairperson",
            hasAccepted: true,
            hasPaid: true,
            registrationDate: block.timestamp,
            role: AdminRole.NONE // Chairperson has special permissions via chairperson field
        });

        newChama.members[msg.sender] = chairMember;
        newChama.memberAddresses.push(msg.sender);
        newChama.memberCount++;

        emit ChamaCreated(chamaId, msg.sender);
    }

    function sendInvitation(uint256 _chamaId, address _memberAddress)
        public
        onlyChairperson(_chamaId)
    {
        Chama storage chama = chamas[_chamaId];

        require(chama.memberCount < MAX_MEMBERS, "Maximum members reached");
        require(!isMember(_chamaId, _memberAddress), "Already a member");
        require(
            !isPendingInvite(_chamaId, _memberAddress),
            "Invitation already sent"
        );
        require(_memberAddress != address(0), "Invalid member address");

        chama.pendingInvites.push(_memberAddress);
        emit InvitationSent(_chamaId, _memberAddress);
    }

    function acceptInvitation(uint256 _chamaId, string memory _uniqueName)
        public
        payable
    {
        Chama storage chama = chamas[_chamaId];

        require(isPendingInvite(_chamaId, msg.sender), "No invitation found");
        require(
            msg.value >= chama.registrationFee,
            "Insufficient registration fee"
        );
        require(bytes(_uniqueName).length > 0, "Name cannot be empty");

        Member memory newMember = Member({
            memberAddress: msg.sender,
            uniqueName: _uniqueName,
            hasAccepted: true,
            hasPaid: true,
            registrationDate: block.timestamp,
            role: AdminRole.NONE // New members start with no admin role
        });

        chama.members[msg.sender] = newMember;
        chama.memberAddresses.push(msg.sender);
        chama.memberCount++;
        chama.balance += msg.value; // Add registration fee to chama balance
        removePendingInvite(_chamaId, msg.sender);

        // Check if minimum members reached to activate chama
        if (chama.memberCount >= MIN_MEMBERS && !chama.isActive) {
            chama.isActive = true;
        }

        emit MemberJoined(_chamaId, msg.sender, _uniqueName);
    }

    function getUserChamas(address _user)
        public
        view
        returns (uint256[] memory)
    {
        uint256[] memory userChamas = new uint256[](chamaCount);
        uint256 count = 0;

        for (uint256 i = 0; i < chamaCount; i++) {
            if (isMember(i, _user)) {
                userChamas[count] = i;
                count++;
            }
        }

        // Resize array to actual count
        uint256[] memory result = new uint256[](count);
        for (uint256 i = 0; i < count; i++) {
            result[i] = userChamas[i];
        }

        return result;
    }

    function getPendingMembers(uint256 _chamaId)
        public
        view
        onlyChairperson(_chamaId)
        returns (address[] memory)
    {
        return chamas[_chamaId].pendingInvites;
    }

    function getAcceptedMembers(uint256 _chamaId)
        public
        view
        returns (address[] memory)
    {
        return chamas[_chamaId].memberAddresses;
    }

    function assignAdmin(
        uint256 _chamaId,
        address _member,
        AdminRole _role
    ) public onlyChairperson(_chamaId) {
        require(_role != AdminRole.NONE, "Invalid admin role");
        require(isMember(_chamaId, _member), "Address is not a member");

        Chama storage chama = chamas[_chamaId];
        chama.members[_member].role = _role;

        emit AdminAssigned(_chamaId, _member, _role);
    }

    function proposeDevelopment(
        uint256 _chamaId,
        string memory _title,
        string memory _description,
        uint256 _requestedAmount
    ) public onlyDevManager(_chamaId) {
        require(_requestedAmount > 0, "Amount must be greater than 0");
        require(
            _requestedAmount <= chamas[_chamaId].balance,
            "Insufficient chama balance"
        );

        uint256 proposalId = developmentCount++;
        Development storage newDev = developments[proposalId];

        newDev.proposalId = proposalId;
        newDev.title = _title;
        newDev.description = _description;
        newDev.requestedAmount = _requestedAmount;
        newDev.proposer = msg.sender;
        newDev.status = ProposalStatus.PENDING;
        newDev.proposalEndTime = block.timestamp + VOTING_PERIOD;

        chamas[_chamaId].developmentProposals.push(proposalId);

        emit DevelopmentProposed(_chamaId, proposalId, _title);
    }

    function voteOnDevelopment(
        uint256 _chamaId,
        uint256 _proposalId,
        bool _support
    ) public {
        require(isMember(_chamaId, msg.sender), "Not a member");

        Development storage dev = developments[_proposalId];
        require(dev.status == ProposalStatus.PENDING, "Proposal not pending");
        require(!dev.hasVoted[msg.sender], "Already voted");
        require(block.timestamp <= dev.proposalEndTime, "Voting period ended");

        dev.hasVoted[msg.sender] = true;

        if (_support) {
            dev.votesFor++;
        } else {
            dev.votesAgainst++;
        }

        emit DevelopmentVoteCast(_proposalId, msg.sender, _support);

        // Check if proposal has reached conclusion
        if (isProposalApproved(_proposalId)) {
            dev.status = ProposalStatus.APPROVED;
            emit DevelopmentApproved(_proposalId);
        } else if (isProposalRejected(_proposalId)) {
            dev.status = ProposalStatus.REJECTED;
        }
    }

    function approveFunding(uint256 _chamaId, uint256 _proposalId) public {
        require(isMember(_chamaId, msg.sender), "Not a member");

        Development storage dev = developments[_proposalId];
        require(dev.status == ProposalStatus.APPROVED, "Proposal not approved");
        require(!dev.fundingVoted[msg.sender], "Already voted on funding");
        require(!dev.isFunded, "Already funded");

        dev.fundingVoted[msg.sender] = true;
        dev.fundingApprovalVotes++;

        // Check if funding threshold reached
        if (isFundingApproved(_chamaId, _proposalId)) {
            executeFunding(_chamaId, _proposalId);
        }
    }

    function executeFunding(uint256 _chamaId, uint256 _proposalId)
        internal
        onlyTreasurer(_chamaId)
    {
        Development storage dev = developments[_proposalId];
        Chama storage chama = chamas[_chamaId];

        require(dev.status == ProposalStatus.APPROVED, "Proposal not approved");
        require(!dev.isFunded, "Already funded");
        require(
            chama.balance >= dev.requestedAmount,
            "Insufficient chama balance"
        );

        chama.balance -= dev.requestedAmount;
        dev.isFunded = true;
        dev.status = ProposalStatus.EXECUTED;

        emit DevelopmentFunded(_proposalId, dev.requestedAmount);
    }


    function requestEmergencyWithdrawal(
        uint256 _chamaId,
        uint256 _amount,
        string memory _reason
    ) public onlyTreasurer(_chamaId) {
        Chama storage chama = chamas[_chamaId];
        require(chama.isActive, "Chama not active");
        require(_amount <= chama.balance, "Insufficient balance");

        uint256 requestId = chama.withdrawalRequests.length;
        WithdrawalRequest storage newRequest = chama.withdrawalRequests.push();
        newRequest.requestId = requestId;
        newRequest.amount = _amount;
        newRequest.reason = _reason;
        newRequest.requester = msg.sender;
        newRequest.requestDate = block.timestamp;

        emit WithdrawalRequested(_chamaId, requestId, _amount);
    }

    function approveWithdrawal(
        uint256 _chamaId,
        uint256 _requestId
    ) public {
        Chama storage chama = chamas[_chamaId];
        require(isAdmin(_chamaId, msg.sender), "Not an admin");
        
        WithdrawalRequest storage request = chama.withdrawalRequests[_requestId];
        require(!request.executed, "Already executed");
        require(!request.hasApproved[msg.sender], "Already approved");

        request.hasApproved[msg.sender] = true;
        request.approvalCount++;

        emit WithdrawalApproved(_chamaId, _requestId, msg.sender);

        // Check if enough admins have approved
        if (hasEnoughAdminApprovals(_chamaId, request.approvalCount)) {
            executeWithdrawal(_chamaId, _requestId);
        }
    }

    function executeWithdrawal(
        uint256 _chamaId,
        uint256 _requestId
    ) internal {
        Chama storage chama = chamas[_chamaId];
        WithdrawalRequest storage request = chama.withdrawalRequests[_requestId];
        
        require(!request.executed, "Already executed");
        require(chama.balance >= request.amount, "Insufficient balance");

        request.executed = true;
        chama.balance -= request.amount;
        payable(request.requester).transfer(request.amount);

        emit WithdrawalExecuted(_chamaId, _requestId, request.amount);
    }

    function terminateChama(uint256 _chamaId) public onlyChairperson(_chamaId) {
        Chama storage chama = chamas[_chamaId];
        require(chama.isActive, "Chama not active");
        require(chama.terminationDate == 0, "Already terminated");

        uint256 totalBalance = chama.balance;
        uint256 totalContributions = 0;

        // Calculate total contributions
        for (uint256 i = 0; i < chama.memberAddresses.length; i++) {
            address member = chama.memberAddresses[i];
            totalContributions += chama.totalContributions[member];
        }

        // Distribute balance to members based on their contribution percentage
        for (uint256 i = 0; i < chama.memberAddresses.length; i++) {
            address member = chama.memberAddresses[i];
            uint256 contributionShare = (totalBalance * chama.totalContributions[member]) / totalContributions;
            uint256 profitShare = chama.profitShares[member];
            uint256 totalShare = contributionShare + profitShare;
            
            if (totalShare > 0) {
                payable(member).transfer(totalShare);
            }
        }

        chama.isActive = false;
        chama.terminationDate = block.timestamp;
        chama.balance = 0;

        emit ChamaTerminated(_chamaId, totalBalance);
    }


    // Helper functions
    function isMember(uint256 _chamaId, address _address)
        internal
        view
        returns (bool)
    {
        return chamas[_chamaId].members[_address].hasAccepted;
    }

    function isPendingInvite(uint256 _chamaId, address _address)
        internal
        view
        returns (bool)
    {
        address[] storage pendingInvites = chamas[_chamaId].pendingInvites;
        for (uint256 i = 0; i < pendingInvites.length; i++) {
            if (pendingInvites[i] == _address) {
                return true;
            }
        }
        return false;
    }

    function removePendingInvite(uint256 _chamaId, address _address) internal {
        address[] storage pendingInvites = chamas[_chamaId].pendingInvites;
        for (uint256 i = 0; i < pendingInvites.length; i++) {
            if (pendingInvites[i] == _address) {
                // Move the last element to the position being deleted
                pendingInvites[i] = pendingInvites[pendingInvites.length - 1];
                pendingInvites.pop();
                break;
            }
        }
    }

    function isProposalApproved(uint256 _proposalId)
        internal
        view
        returns (bool)
    {
        Development storage dev = developments[_proposalId];
        uint256 totalVotes = dev.votesFor + dev.votesAgainst;
        return dev.votesFor > totalVotes / 2;
    }

    function isProposalRejected(uint256 _proposalId)
        internal
        view
        returns (bool)
    {
        Development storage dev = developments[_proposalId];
        uint256 totalVotes = dev.votesFor + dev.votesAgainst;
        return dev.votesAgainst >= totalVotes / 2;
    }

    function isFundingApproved(uint256 _chamaId, uint256 _proposalId)
        internal
        view
        returns (bool)
    {
        Development storage dev = developments[_proposalId];
        Chama storage chama = chamas[_chamaId];
        return dev.fundingApprovalVotes > chama.memberCount / 2;
    }

    function getProposalDetails(uint256 _proposalId)
        public
        view
        returns (
            string memory title,
            string memory description,
            uint256 requestedAmount,
            address proposer,
            uint256 votesFor,
            uint256 votesAgainst,
            ProposalStatus status,
            uint256 proposalEndTime,
            uint256 fundingApprovalVotes,
            bool isFunded
        )
    {
        Development storage dev = developments[_proposalId];
        return (
            dev.title,
            dev.description,
            dev.requestedAmount,
            dev.proposer,
            dev.votesFor,
            dev.votesAgainst,
            dev.status,
            dev.proposalEndTime,
            dev.fundingApprovalVotes,
            dev.isFunded
        );
    }

    function getChamaProposals(uint256 _chamaId)
        public
        view
        returns (uint256[] memory)
    {
        return chamas[_chamaId].developmentProposals;
    }

     function isAdmin(uint256 _chamaId, address _member) internal view returns (bool) {
        AdminRole role = chamas[_chamaId].members[_member].role;
        return role != AdminRole.NONE || _member == chamas[_chamaId].chairperson;
    }

    function hasEnoughAdminApprovals(uint256 _chamaId, uint256 _approvalCount) internal view returns (bool) {
        uint256 totalAdmins = countAdmins(_chamaId);
        return (_approvalCount * 100) / totalAdmins >= ADMIN_APPROVAL_THRESHOLD;
    }

    function countAdmins(uint256 _chamaId) internal view returns (uint256) {
        Chama storage chama = chamas[_chamaId];
        uint256 count = 1; // Start with 1 for chairperson

        for (uint256 i = 0; i < chama.memberAddresses.length; i++) {
            if (chama.members[chama.memberAddresses[i]].role != AdminRole.NONE) {
                count++;
            }
        }

        return count;
    }

    function getMemberContributions(uint256 _chamaId, address _member) public view returns (
        uint256 totalContribution,
        uint256 profitShare,
        uint256 nextDeadline,
        bool hasPaidForPeriod
    ) {
        Chama storage chama = chamas[_chamaId];
        ContributionSchedule storage schedule = chama.contributionSchedules[_member];
        
        return (
            chama.totalContributions[_member],
            chama.profitShares[_member],
            schedule.deadline,
            schedule.hasPaidForPeriod
        );
    }
}
