import Head from "next/head";
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useEffect, useState } from "react";
import { ethers } from "ethers";

import { SimpleAccountAPI, HttpRpcClient } from "@account-abstraction/sdk";
// import { useEthersSigner } from "@/hooks/useEthers";
import { ENTRY_POINT_ADDRESS, GOERLI_RPC_URL, SIMPLE_ACCOUNT_FACTORY_ADDRESS } from "@/configs";
import { oplAccountAbstractionEnclaveABI } from "@/lib/abi/OPLAccountAbstractionEnclave";
import { oplAccountAbstractionPaymasterABI } from "@/lib/abi/OPLAccountAbstractionPaymaster";
import { useSapphire } from "@/hooks/useSapphire";

export default function Page() {
  const [wallet, setWallet] = useState<ethers.Wallet>();
  const [accountAPI, setAccountAPI] = useState<SimpleAccountAPI>();
  const [walletConnectURL, setWalletConnectURL] = useState("");
  const [balance, setBalance] = useState("0");
  const [to] = useState(ethers.constants.AddressZero);
  const [data] = useState("0x");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [unsignedUserOp, setUnsignedUserOp] = useState<any>();
  const [userOpHash, setUserOpHash] = useState("");
  const [secretSponsorAmount, setSecretSponsorAmount] = useState("0");
  const [sendSecretSponsorTxHash, setSendSecretSponsorTxHash] = useState("");
  const [requestId, setRequestId] = useState("");

  // const signer = useEthersSigner();
  const { sapphireWrappedSigner } = useSapphire();

  useEffect(() => {
    let privateKey = localStorage.getItem("privateKey");
    let wallet: ethers.Wallet;
    if (!privateKey) {
      wallet = ethers.Wallet.createRandom();
      privateKey = wallet.privateKey;
      localStorage.setItem("privateKey", privateKey);
    } else {
      wallet = new ethers.Wallet(privateKey);
    }
    const provider = new ethers.providers.JsonRpcProvider(GOERLI_RPC_URL);
    wallet.connect(provider);
    const walletAPI = new SimpleAccountAPI({
      provider,
      entryPointAddress: ENTRY_POINT_ADDRESS,
      owner: wallet,
      factoryAddress: SIMPLE_ACCOUNT_FACTORY_ADDRESS,
    });
    setWallet(wallet);
    walletAPI.getAccountAddress().then((accountAddress) => {
      walletAPI.accountAddress = accountAddress;
      provider.getBalance(accountAddress).then((balance) => {
        setBalance(ethers.utils.formatEther(balance));
      });
      setAccountAPI(walletAPI);
      walletAPI
        .createUnsignedUserOp({
          target: ethers.constants.AddressZero,
          data: "0x",
        })
        .then((unSignedUserOp) => {
          unSignedUserOp.preVerificationGas = 500000;
          unSignedUserOp.paymasterAndData = process.env.NEXT_PUBLIC_OPL_ACCOUNT_ABSTRACTION_PAYMASTER || "";
          ethers.utils.resolveProperties(unSignedUserOp).then((resolvedUnsignedUserOp) => {
            setUnsignedUserOp(resolvedUnsignedUserOp);
            walletAPI.getUserOpHash(resolvedUnsignedUserOp).then((userOpHash) => {
              setUserOpHash(userOpHash);
              const contract = new ethers.Contract(
                process.env.NEXT_PUBLIC_OPL_ACCOUNT_ABSTRACTION_PAYMASTER || "",
                oplAccountAbstractionPaymasterABI,
                provider
              );
              const intervalId = setInterval(() => {
                contract.lockedAmount(accountAddress, userOpHash).then((lockedAmount: ethers.BigNumber) => {
                  console.log("secret sponsor amount:", lockedAmount);
                  if (lockedAmount.gt(0)) {
                    setSecretSponsorAmount(ethers.utils.formatEther(lockedAmount));
                    clearInterval(intervalId);
                  }
                });
              }, 5000);
            });
          });
        });
    });
  }, []);

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto"; // or 'visible' if you want
    }
    return () => {
      document.body.style.overflow = "auto"; // reset on unmount
    };
  }, [isModalOpen]);

  // this is not implemented for now
  const handleConnectByWalletConnect = async () => {};

  const handleSendSecretSponsor = async () => {
    if (!sapphireWrappedSigner || !accountAPI || !accountAPI.accountAddress) {
      return;
    }
    const oplAccountAbstractionEnclave = new ethers.Contract(
      process.env.NEXT_PUBLIC_OPL_ACCOUNT_ABSTRACTION_ENCLAVE || "",
      oplAccountAbstractionEnclaveABI,
      sapphireWrappedSigner
    );
    const tx = await oplAccountAbstractionEnclave.sendSecretGasFeeToHostPaymaster(
      accountAPI.accountAddress,
      userOpHash,
      {
        value: ethers.utils.parseEther("0.1"),
      }
    );
    setSendSecretSponsorTxHash(tx.hash);
  };

  const handleSendUserOp = async () => {
    if (!accountAPI) {
      return;
    }
    const httpRPCClient = new HttpRpcClient(process.env.NEXT_PUBLIC_BUNDLER_URL || "", ENTRY_POINT_ADDRESS, 5);
    const signedUserOp = await accountAPI.signUserOp(unsignedUserOp);
    const requestId = await httpRPCClient.sendUserOpToBundler(signedUserOp);
    setRequestId(requestId);
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-blue-400 to-blue-600 flex flex-col ${inter.className}`}>
      <Head>
        <title>Secret Sponsor</title>
      </Head>

      {/* Header Section */}
      <div className="flex justify-end items-center p-4 mb-24">
        <ConnectButton />
      </div>

      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center mb-12">
        <span className="text-7xl inline-block transform rotate-45 mb-6">⛽️</span>

        <h1 className="text-white text-4xl font-bold mb-2">Secret Sponsor</h1>
        <p className="text-white text-lg">Account Abstraction Secret gas sponsoring with Oasis Privacy Layer</p>
      </div>

      {/* Form Section */}
      <div className="flex items-center justify-center flex-grow mb-24">
        <div className="bg-white py-6 px-4 rounded-lg shadow-md max-w-lg w-full border border-blue-200">
          <form className="space-y-4">
            <div>
              <label className="block text-gray-700 text-md font-medium mb-2">Account Abstraction Owner Address</label>
              <p className="block text-gray-700 text-sm">{wallet && wallet.address}</p>
            </div>

            <div>
              <label className="block text-gray-700 text-md font-medium mb-2">
                Account Abstraction Account Address
              </label>
              <p className="block text-gray-700 text-sm">{accountAPI && accountAPI.accountAddress}</p>
            </div>

            <div>
              <label className="block text-gray-700 text-md font-medium mb-2">
                Account Abstraction Account Balance
              </label>
              <p className="block text-gray-700 text-sm">{balance} ETH</p>
            </div>

            <div>
              <label className="block text-gray-700 text-md font-medium mb-2" htmlFor="walletConnectURL">
                WalletConnect URL
              </label>
              <input
                className="w-full px-2 py-3 border border-gray-300 rounded-md text-sm"
                type="text"
                id="walletConnectURL"
                placeholder="Enter WalletConnect URL"
                disabled={true}
                value={walletConnectURL}
                onChange={(e) => setWalletConnectURL(e.target.value)}
              />
            </div>

            <div>
              <button
                type="button"
                className="w-full p-2 rounded-md bg-gradient-to-br from-blue-500 to-blue-700 text-white hover:enabled:from-blue-600 hover:enabled:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleConnectByWalletConnect}
                disabled={!walletConnectURL || !accountAPI || !accountAPI.accountAddress}
              >
                Connect
              </button>
            </div>

            <div className="space-y-2">
              <label className="block text-gray-700 text-md font-medium mb-2">Transaction Preview</label>
              <p className="text-gray-700 text-xs font-medium">To</p>
              <p className="text-gray-700 text-xs">{to}</p>
              <p className="text-gray-700 text-xs font-medium">Data</p>
              <p className="text-gray-700 text-xs">{data}</p>
            </div>

            <div>
              <button
                type="button"
                className="w-full p-2 rounded-md bg-gradient-to-br from-blue-500 to-blue-700 text-white hover:enabled:from-blue-600 hover:enabled:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!unsignedUserOp}
                onClick={() => setIsModalOpen(true)}
              >
                {!unsignedUserOp ? "Creating User Operation..." : "Send Tx with Secret Sponsor"}
              </button>
            </div>
          </form>
        </div>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black opacity-50" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative z-10 bg-white py-4 px-6 rounded-xl shadow-lg max-w-xl w-full mx-4">
            <header className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-700">Secret Sponsor Tx</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-2xl text-gray-400 hover:text-gray-500">
                &times;
              </button>
            </header>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-gray-700 text-md font-medium mb-2">User Operation Preview</label>
                <pre
                  className="p-2 rounded border border-gray-200 bg-gray-50 overflow-x-auto overflow-y-auto max-h-60"
                  style={{ fontSize: "10px" }}
                >
                  <code className="break-all">{JSON.stringify(unsignedUserOp, null, 2)}</code>
                </pre>
              </div>
              <div>
                <label className="block text-gray-700 text-md font-medium mb-2">User Operation Hash</label>
                <p className="block text-gray-700 text-xs">{userOpHash}</p>
              </div>
              <button
                type="button"
                className="w-full p-2 rounded-md bg-gradient-to-br from-blue-500 to-blue-700 text-white hover:enabled:from-blue-600 hover:enabled:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleSendSecretSponsor}
                disabled={
                  !sapphireWrappedSigner ||
                  !accountAPI ||
                  !accountAPI.accountAddress ||
                  !!sendSecretSponsorTxHash ||
                  secretSponsorAmount !== "0"
                }
              >
                {sapphireWrappedSigner ? "Secret Sponsor through Sapphire" : "Connect Wallet First"}
              </button>
              {sendSecretSponsorTxHash && (
                <div>
                  <label className="block text-gray-700 text-md font-medium mb-2">Set Secret Sponsor Tx</label>
                  <p className="block text-xs">
                    <a
                      className="text-blue-500"
                      href={`https://testnet.explorer.sapphire.oasis.dev/tx/${sendSecretSponsorTxHash}`}
                    >
                      {sendSecretSponsorTxHash}
                    </a>
                  </p>
                </div>
              )}
              {(sendSecretSponsorTxHash || secretSponsorAmount !== "0") && (
                <div>
                  <label className="block text-gray-700 text-md font-medium mb-2">Secret Sponsor Amount</label>
                  <p className="block text-gray-700 text-xs">
                    {secretSponsorAmount !== "0" ? secretSponsorAmount : "Waiting for synced with Goerli..."}
                  </p>
                </div>
              )}

              <button
                type="button"
                className="w-full p-2 rounded-md bg-gradient-to-br from-blue-500 to-blue-700 text-white hover:enabled:from-blue-600 hover:enabled:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={secretSponsorAmount === "0" || !!requestId}
                onClick={handleSendUserOp}
              >
                Send User Operation to Goerli Bundler
              </button>
              {requestId && (
                <div>
                  <label className="block text-gray-700 text-md font-medium mb-2">Set Secret Sponsor Tx</label>
                  <p className="block text-xs">
                    <a
                      className="text-blue-500"
                      href={`https://www.jiffyscan.xyz/userOpHash/${requestId}?network=goerli`}
                    >
                      {requestId}
                    </a>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
