import Head from "next/head";
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });

import { Core } from "@walletconnect/core";
import { Web3Wallet } from "@walletconnect/web3wallet";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useEffect, useState } from "react";
import { ethers } from "ethers";

export default function Page() {
  const [privateKey, setPrivateKey] = useState("");
  const [wallet, setWallet] = useState<ethers.Wallet>();

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
    setPrivateKey(privateKey);
    setWallet(wallet);
  }, []);

  const handleConnectByWalletConnect = async () => {
    console.log("test");
    const metadata = {
      name: "Demo app",
      description: "Demo Client as Wallet/Peer",
      url: "www.walletconnect.com",
      icons: [],
    };

    const core = new Core({
      projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
    });

    const web3wallet = await Web3Wallet.init({
      core, // <- pass the shared `core` instance
      metadata,
    });
    console.log("web3wallet", web3wallet);
    web3wallet.on("session_proposal", async (proposal) => {
      console.log(proposal);
      const session = await web3wallet.approveSession({
        id: proposal.id,
        namespaces: {
          eip155: {
            accounts: ["eip155:5:0x00000c9b10039702e0587E587623f6a6786e4F7B"],
            chains: ["eip155:5"],
            methods: ["eth_sendTransaction", "personal_sign"],
            events: ["chainChanged", "accountsChanged"],
          },
        },
      });
    });
    console.log("web3wallet", web3wallet);
    await web3wallet.core.pairing.pair({
      uri: "wc:3794e951daad838372e45de76807eb1d7c7cfe117f8f85bd97ab8558fa0e80d8@2?relay-protocol=irn&symKey=f766161645c70301fd5d646fb937357352577ca437ab9efc512a55e72cad17d0",
    });
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-blue-400 to-blue-600 flex flex-col ${inter.className}`}>
      <Head>
        <title>Simple Form</title>
      </Head>

      {/* Header Section */}
      <div className="flex justify-end items-center p-4 mb-24">
        <ConnectButton />
      </div>

      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center mb-12">
        <span className="text-7xl inline-block transform rotate-45 mb-6">⛽️</span>

        <h1 className="text-white text-4xl font-bold mb-2">Stealth Sponsor</h1>
        <p className="text-white text-lg">Stealth AA gas sponsoring with Oasis Privacy Layer</p>
      </div>

      {/* Form Section */}
      <div className="flex items-center justify-center flex-grow mb-24">
        <div className="bg-white py-6 px-4 rounded-lg shadow-md max-w-lg w-full border border-blue-200">
          <form className="space-y-4">
            <div>
              <label className="block text-gray-700 text-md font-medium mb-2">Account Abstraction Owner Address</label>
              <p className="block text-gray-700 text-sm">
                {/* Dynamically display owner address here */}
                0xOwnerAddressHere...
              </p>
            </div>

            <div>
              <label className="block text-gray-700 text-md font-medium mb-2">
                Account Abstraction Account Address
              </label>
              <p className="block text-gray-700 text-sm">
                {/* Dynamically display account address here */}
                0xAccountAddressHere...
              </p>
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
              />
            </div>

            <div>
              <button
                type="button"
                className="w-full p-2 rounded-md bg-gradient-to-br from-blue-500 to-blue-700 text-white hover:from-blue-600 hover:to-blue-800"
              >
                Connect
              </button>
            </div>

            <div className="space-y-2">
              <label className="block text-gray-700 text-md font-medium mb-2">Transaction Preview</label>
              <p className="text-gray-700 text-sm">To: {/* To value here */}</p>
              <p className="text-gray-700 text-sm">Data: {/* Data value here */}</p>
              <p className="text-gray-700 text-sm">Value: {/* Value here */}</p>
            </div>

            <div>
              <button
                type="button"
                className="w-full p-2 rounded-md bg-gradient-to-br from-blue-500 to-blue-700 text-white hover:from-blue-600 hover:to-blue-800"
              >
                Send
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
