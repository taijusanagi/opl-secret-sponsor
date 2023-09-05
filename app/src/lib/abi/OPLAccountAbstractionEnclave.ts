export const oplAccountAbstractionEnclaveABI = [
  {
    inputs: [
      {
        internalType: "address",
        name: "handler",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "AutoConfigUnavailable",
    type: "error",
  },
  {
    inputs: [],
    name: "MissingRemoteAddr",
    type: "error",
  },
  {
    inputs: [],
    name: "MissingRemoteChainId",
    type: "error",
  },
  {
    inputs: [],
    name: "NotMessageBus",
    type: "error",
  },
  {
    inputs: [],
    name: "NotRemoteEndpoint",
    type: "error",
  },
  {
    inputs: [],
    name: "ReceiverError",
    type: "error",
  },
  {
    inputs: [],
    name: "SelfCallDisallowed",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "expected",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "got",
        type: "uint256",
      },
    ],
    name: "WrongSeqNum",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bytes32",
        name: "userOpHash",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "unusedAmount",
        type: "uint256",
      },
    ],
    name: "UnlockSecretGasFee",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_sender",
        type: "address",
      },
      {
        internalType: "uint64",
        name: "_senderChainId",
        type: "uint64",
      },
      {
        internalType: "bytes",
        name: "_message",
        type: "bytes",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "executeMessage",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "forwarder",
        type: "address",
      },
    ],
    name: "isTrustedForwarder",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    name: "locks",
    outputs: [
      {
        internalType: "address payable",
        name: "sender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        internalType: "bytes32",
        name: "userOpHash",
        type: "bytes32",
      },
    ],
    name: "sendSecretGasFeeToHostPaymaster",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
];
