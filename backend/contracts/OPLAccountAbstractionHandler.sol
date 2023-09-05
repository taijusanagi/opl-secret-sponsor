// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Host, Result} from "@oasisprotocol/sapphire-contracts/contracts/OPL.sol";
import "@account-abstraction/contracts/interfaces/IEntryPoint.sol";

contract OPLAccountAbstractionHandler is Host {
    constructor(address _host, IEntryPoint entryPoint) Host(_host) {
        registerEndpoint("sendUserOp", _sendUserOp);
    }

    // @dev
    // 1. send token to paymaster
    // 2. send userOp to entry point
    function _sendUserOp(bytes calldata args) internal returns (Result) {}

    function refund() external payable {
        postMessage("refund", abi.encode());
    }
}
