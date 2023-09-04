// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@account-abstraction/contracts/core/BasePaymaster.sol";
import "./OPLAccountAbstractionHandler.sol";

contract OPLAccountAbstractionPaymaster is BasePaymaster {

    OPLAccountAbstractionHandler public handler;

    constructor(IEntryPoint _entryPoint, OPLAccountAbstractionHandler _handler) BasePaymaster(_entryPoint) {
        handler = _handler;
    }

    function _validatePaymasterUserOp(UserOperation calldata userOp, bytes32 /*userOpHash*/, uint256 requiredPreFund) internal view override returns (bytes memory context, uint256 validationData) {
    }

    // @dev
    // 1. send remaining gas fee to the handler
    function _postOp(PostOpMode mode, bytes calldata context, uint256 actualGasCost) internal override {
        // add value
        uint256 remainingGasFee = address(this).balance - actualGasCost;
        if(remainingGasFee > 0){
            handler.refund{value: remainingGasFee}();
        }

    }
}