// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {ExtendedOPLHost, Result} from "./ExtendedOPL.sol";
import {UserOperation} from "@account-abstraction/contracts/interfaces/UserOperation.sol";
import {IEntryPoint} from "@account-abstraction/contracts/interfaces/IEntryPoint.sol";

contract OPLAccountAbstractionHandler is ExtendedOPLHost {
    IEntryPoint public entryPoint;

    constructor(address _host, IEntryPoint _entryPoint) ExtendedOPLHost(_host) {
        entryPoint = _entryPoint;
        registerEndpoint("sendUserOp", _sendUserOp);
    }

    function _sendUserOp(bytes calldata args) internal returns (Result) {
        // TODO: get token and conver it to native token then send to paymaster
        (UserOperation[] memory userOps, address payable beneficiary) = abi.decode(args, (UserOperation[], address));
        entryPoint.handleOps(userOps, beneficiary);
    }

}
