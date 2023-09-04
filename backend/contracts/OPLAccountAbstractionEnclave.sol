// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Enclave, Result, autoswitch} from "@oasisprotocol/sapphire-contracts/contracts/OPL.sol";

contract OPLAccountAbstractionEnclave is Enclave {

    constructor(address handler) Enclave(handler, autoswitch("sapphire")) {
        registerEndpoint("refund", _refund);
    }

    function _refund(bytes calldata args) internal returns (Result) {}

    function sendUserOp() external {
        postMessage("sendUserOp", abi.encode());
    }

}