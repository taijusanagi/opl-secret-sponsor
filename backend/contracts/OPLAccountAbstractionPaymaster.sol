// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Host, Result} from "@oasisprotocol/sapphire-contracts/contracts/OPL.sol";
import "@account-abstraction/contracts/core/BasePaymaster.sol";

contract OPLAccountAbstractionPaymaster is BasePaymaster, Host {
    using UserOperationLib for UserOperation;

    mapping (address => mapping(bytes32=>uint256)) public lockedAmount;

    constructor(
        IEntryPoint _entryPoint,
        address _host
    ) BasePaymaster(_entryPoint) Host(_host) {
        registerEndpoint("sendSecretGasFee", _sendSecretGasFee);
    }

    function _sendSecretGasFee(bytes calldata args) internal returns (Result) {
        (address account, bytes32 userOpHash, uint256 amount) = abi.decode(args, (address, bytes32, uint256));
        lockedAmount[account][userOpHash] += amount;
    }

    function _validatePaymasterUserOp(
        UserOperation calldata userOp,
        bytes32 /*userOpHash*/,
        uint256 maxCost
    ) internal view override returns (bytes memory context, uint256 validationData) {
        address account = userOp.sender;
        bytes32 userOpHash = userOp.hash();
        require(lockedAmount[account][userOpHash] >= maxCost, "DepositPaymaster: deposit too low");
        return (abi.encode(userOp.sender, userOpHash), 0);
    }

    function _postOp(
        PostOpMode mode,
        bytes calldata context,
        uint256 actualGasCost
    ) internal override {
        (address account, bytes32 userOpHash) = abi.decode(context, (address, bytes32));
        delete lockedAmount[account][userOpHash];
        postMessage("refundSecretGasFee", abi.encode(account, userOpHash, actualGasCost));
    }
}
