// Copied from
// https://github.com/oasisprotocol/sapphire-paratime/blob/main/contracts/contracts/opl/Host.sol
// Then extended for our purposes.

// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.0;

import {ExtendedOPLEndpoint, autoswitch} from "./ExtendedOPLEndpoint.sol";

/**
 * @title OPL Host (Extended)
 * @dev The L1-side of an OPL dapp. Use ExtendedOPLEndpoint.sol instead of OPLEndpoint.sol for extended functionality.
 */
contract ExtendedOPLHost is ExtendedOPLEndpoint {
    // solhint-disable-next-line no-empty-blocks
    constructor(address _enclave) ExtendedOPLEndpoint(_enclave, autoswitch("sapphire")) {}
}
