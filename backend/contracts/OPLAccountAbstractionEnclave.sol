// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {UserOperation} from "@account-abstraction/contracts/interfaces/UserOperation.sol";
import {ExtendedOPLEnclave, Result, autoswitch} from "./ExtendedOPL.sol";

contract OPLAccountAbstractionEnclave is ExtendedOPLEnclave {
    // Only test Goerli <> Sapphire Testnet in demo
    constructor(address handler) ExtendedOPLEnclave(handler, autoswitch("ethereum")) {
        registerEndpoint("refund", _refund);
    }

    function _refund(bytes calldata args) internal returns (Result) {}

    function sendUserOp(
        UserOperation[] calldata ops,
        address payable beneficiary,
        address _token,
        uint256 _amount,
        uint64 _nonce,
        uint32 _maxSlippage
    ) external {
        postMessageWithTransfer(
            "sendUserOp",
            abi.encode(ops, beneficiary),
            _token,
            _amount,
            _nonce,
            _maxSlippage
        );
    }
}
