// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Enclave, Result, autoswitch} from "@oasisprotocol/sapphire-contracts/contracts/OPL.sol";

// import "hardhat/console.sol";

contract OPLAccountAbstractionEnclave is Enclave {
    struct Lock {
        address payable sender;
        uint256 amount;
    }

    event UnlockSecretGasFee(address account, bytes32 userOpHash, uint256 unusedAmount);

    mapping(address => mapping(bytes32 => Lock)) public locks;

    constructor(address handler) Enclave(handler, autoswitch("ethereum")) {
        registerEndpoint("unlockSecretGasFee", _unlockSecretGasFee);
    }

    // @dev
    // For simplicity, locked balance can only be withdrawn by callback, but it can support conditioned force withdraw for error case.
    function _unlockSecretGasFee(bytes calldata args) internal returns (Result) {
        (address account, bytes32 userOpHash, uint256 actualGasCost) = abi.decode(
            args,
            (address, bytes32, uint256)
        );
        Lock memory lock = locks[account][userOpHash];
        delete locks[account][userOpHash];
        uint256 unusedAmount = lock.amount - actualGasCost;
        lock.sender.transfer(unusedAmount);
        emit UnlockSecretGasFee(account, userOpHash, unusedAmount);
        return Result.Success;
    }

    // @dev
    // For simplicity, we consider 1 ROSE = 1 ETH, but it can integrate swap or oracle to handle the conversion.
    function sendSecretGasFeeToHostPaymaster(address account, bytes32 userOpHash) external payable {
        uint256 amount = msg.value;
        // For simplicity, Skip some validations
        locks[account][userOpHash] = Lock(payable(msg.sender), amount);
        postMessage("sendSecretGasFee", abi.encode(account, userOpHash, amount));
    }
}
