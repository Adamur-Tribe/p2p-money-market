// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

//this is a contract to enable user store ther assets both temporary and fixed 
//for a certain duration of specified time frame by the user for flaxibility
contract CryptoLocker is ReentrancyGuard, Ownable {
    constructor() Ownable(msg.sender) {}

//having the fixed and temp lock accounts for flexibility
    enum LockType {
        FixedLock,
        TempLock
    }

    //struct for the lock of the amount 
    struct Lock {
        uint256 amount;
        uint256 unlockTime;
        uint256 dailyLimit;
        uint256 lastWithdrawal;
        uint256 withdrawnAmount;
        LockType lockType;

    }

   
    //mapping fixed and temp users diffrently for easy tracking of the reistered user
     mapping(address => Lock) public fixedLocks;
    mapping(address => Lock) public tempLocks;


    //events to contrall the function of the contract 
    event Locked(
        address indexed user,
        uint256 amount,
        uint256 unlockTime,
        LockType lockType
    );
    event Withdrawn(address indexed user, uint256 amount);
    event Unlocked(address indexed user, uint256 amount);


     //function to allow user to Join a FixedLock account
     //Funds are locked for a specific duration and cannot be withdrawn until the unlock time.
    function joinFixedLock(uint256 _lockDays) external payable nonReentrant{
        require(msg.value > 0, "No ETH sent to lock... Enter amount above 0");
        require(_lockDays > 0, "Lock time must be more than 0 days...");

        Lock storage userLock = fixedLocks[msg.sender];
        require(userLock.amount == 0, "Existing fixed lock active");

        userLock.amount = msg.value;
        userLock.unlockTime = block.timestamp + (_lockDays * 1 days);
        userLock.lockType = LockType.FixedLock;
        userLock.lastWithdrawal = block.timestamp;
        userLock.withdrawnAmount = 0;

        emit Locked(msg.sender, msg.value, userLock.unlockTime, LockType.FixedLock);
    }

        
     // function to Join a TempLock account
     //Funds are locked for a duration but allow daily withdrawals within a specified limit.
    function joinTempLock(uint256 _lockDays, uint256 _dailyLimit) external payable nonReentrant {
        require(msg.value > 0, "No ETH sent to lock... Enter amount above 0");
        require(_lockDays > 0, "Lock time must be more than 0 days...");
        require(_dailyLimit > 0, "Daily limit must be above 0 ...");

        Lock storage userLock = tempLocks[msg.sender];
        require(userLock.amount == 0, "Existing temporary lock active");

        userLock.amount = msg.value;
        userLock.unlockTime = block.timestamp + (_lockDays * 1 days);
        userLock.dailyLimit = _dailyLimit;
        userLock.lockType = LockType.TempLock;
        userLock.lastWithdrawal = block.timestamp;
        userLock.withdrawnAmount = 0;

        emit Locked(msg.sender, msg.value, userLock.unlockTime, LockType.TempLock);
    }
    

    //user function for Withdraw from TempLock within the daily limit
    function withdraw(uint256 _amount) external nonReentrant {
        Lock storage userLock = tempLocks[msg.sender];
        require(userLock.amount > 0, "No active lock");
        require(userLock.lockType == LockType.TempLock, "Withdrawals allowed only for TempLock...");

        // If daily limit is set
        require(block.timestamp >= userLock.lastWithdrawal + 1 days, "Daily limit reached...Sorry");
        require(_amount <= userLock.dailyLimit, "Amount exceeds daily limit...Sorry");
        require(userLock.withdrawnAmount + _amount <= userLock.amount, "Exceeds locked amount...Sorry");

        //only withdraw the day expenditure of the user 
        userLock.lastWithdrawal = block.timestamp;
        userLock.withdrawnAmount += _amount;

        payable(msg.sender).transfer(_amount);

        emit Withdrawn(msg.sender, _amount);
    }
    

    
     //Unlock all funds after the lock period
     // FixedLock: Full withdrawal after lock time
     // TempLock: Full withdrawal after lock time, regardless of daily limit
    function unlockAll() external nonReentrant {
        Lock storage userLock = fixedLocks[msg.sender];
        require(userLock.amount > 0, "No active lock");
        require(block.timestamp >= userLock.unlockTime, "Lock period not over... Try again sometimes.");

        uint256 amountToWithdraw = userLock.amount - userLock.withdrawnAmount;
        require(amountToWithdraw > 0, "No balance to withdraw... Sorry");

        //update the state to 0 when withdrawing all the amount
        userLock.amount = 0;
        userLock.dailyLimit = 0;
        userLock.withdrawnAmount = 0;

        payable(msg.sender).transfer(amountToWithdraw);

        emit Unlocked(msg.sender, amountToWithdraw);
    }


     // Get FixedLock details of the users
     
    function getFixedLockDetails(address _user) external view returns (
        uint256 amount,
        uint256 unlockTime,
        uint256 lastWithdrawal,
        uint256 withdrawnAmount
    ) {
        Lock storage userLock = fixedLocks[_user];
        return (
            userLock.amount,
            userLock.unlockTime,
            userLock.lastWithdrawal,
            userLock.withdrawnAmount
        );
    }

    
     //Get TempLock details of the user
    function getTempLockDetails(address _user) external view returns (
        uint256 amount,
        uint256 unlockTime,
        uint256 dailyLimit,
        uint256 lastWithdrawal,
        uint256 withdrawnAmount
    ) {
        Lock storage userLock = tempLocks[_user];
        return (
            userLock.amount,
            userLock.unlockTime,
            userLock.dailyLimit,
            userLock.lastWithdrawal,
            userLock.withdrawnAmount
        );
    }
}
