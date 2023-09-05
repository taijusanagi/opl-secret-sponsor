import Head from "next/head";
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });

import { Core } from "@walletconnect/core";
import { Web3Wallet } from "@walletconnect/web3wallet";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function Page() {
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
      <div className="flex justify-end items-center p-4">
        <ConnectButton />
      </div>

      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center my-10">
        <h1 className="text-white text-4xl font-bold mb-2">
          Stealth Sponsor
          <span className="ml-2 inline-block animate-rotate">⛽️</span>
        </h1>
        <p className="text-white text-lg">Stealth gas sponsoring with Oasis Privacy Layer and Account Abstraction</p>
      </div>

      {/* Form Section */}
      <div className="flex items-center justify-center flex-grow">
        <div className="bg-white p-8 rounded-lg shadow-md w-96 border border-blue-200">
          <form className="space-y-4">
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="name">
                Name
              </label>
              <input
                className="w-full p-2 border border-gray-300 rounded"
                type="text"
                id="name"
                placeholder="Enter your name"
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="email">
                Email
              </label>
              <input
                className="w-full p-2 border border-gray-300 rounded"
                type="email"
                id="email"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="message">
                Message
              </label>
              <textarea
                className="w-full p-2 border border-gray-300 rounded"
                id="message"
                placeholder="Enter your message"
                rows={4}
              ></textarea>
            </div>

            <div>
              <button
                type="submit"
                className="w-full p-2 rounded bg-gradient-to-br from-blue-500 to-blue-700 text-white hover:from-blue-600 hover:to-blue-800"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
