// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Host, Result} from "@oasisprotocol/sapphire-contracts/contracts/OPL.sol";
import "@account-abstraction/contracts/core/BasePaymaster.sol";

import "hardhat/console.sol";

contract OPLAccountAbstractionPaymaster is BasePaymaster, Host {
  event SendSecretGasFee(address account, bytes32 userOpHash, uint256 amount);

  mapping(address => mapping(bytes32 => uint256)) public lockedAmount;
  mapping(address => mapping(bytes32 => uint256)) public usedAmount;

  constructor(IEntryPoint _entryPoint, address _host) BasePaymaster(_entryPoint) Host(_host) {
    registerEndpoint("sendSecretGasFee", _sendSecretGasFee);
  }

  function _sendSecretGasFee(bytes calldata args) internal returns (Result) {
    (address account, bytes32 userOpHash, uint256 amount) = abi.decode(args, (address, bytes32, uint256));
    lockedAmount[account][userOpHash] += amount;
    emit SendSecretGasFee(account, userOpHash, amount);
    return Result.Success;
  }

  function _validatePaymasterUserOp(
    UserOperation calldata userOp,
    bytes32 userOpHash,
    uint256 maxCost
  ) internal view override returns (bytes memory context, uint256 validationData) {
    address account = userOp.sender;
    require(lockedAmount[account][userOpHash] >= maxCost, "OPLAccountAbstractionPaymaster: deposit too low");
    return (abi.encode(account, userOpHash), 0);
  }

  function _postOp(PostOpMode, bytes calldata context, uint256 actualGasCost) internal override {
    (address account, bytes32 userOpHash) = abi.decode(context, (address, bytes32));
    delete lockedAmount[account][userOpHash];
    usedAmount[account][userOpHash] = actualGasCost;
  }

  // separete refund function for gas issue in Account Abstraction Tx 
  function refund(address account, bytes32 userOpHash) public {
    uint256 actualGasCost = usedAmount[account][userOpHash];
    delete usedAmount[account][userOpHash];
    postMessage("unlockSecretGasFee", abi.encode(account, userOpHash, actualGasCost));
  }

  // this is debug only function for faster test
  function debugAddAmount(address account, bytes32 userOpHash) public payable {
    lockedAmount[account][userOpHash] += msg.value;
  }

}
