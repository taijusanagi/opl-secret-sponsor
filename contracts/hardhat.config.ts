import { HardhatUserConfig, task } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import { ENTRY_POINT_ADDRESS } from "./configs";

task("deploy-enclave")
  .addParam("hostNetwork")
  .setAction(async (args, hre) => {
    await hre.run("compile");
    const ethers = hre.ethers;
    const OPLAccountAbstractionEnclave = await ethers.getContractFactory("OPLAccountAbstractionEnclave");
    const signer = ethers.provider.getSigner();
    const signerAddr = await signer.getAddress();
    const hostConfig = hre.config.networks[args.hostNetwork];
    if (!("url" in hostConfig)) throw new Error(`${args.hostNetwork} not configured`);
    const provider = new ethers.providers.JsonRpcProvider(hostConfig.url);
    let nonce = await provider.getTransactionCount(signerAddr);
    if (args.hostNetwork === "local") nonce++;
    const expectedOPLAccountAbstractionPaymasterAddress = ethers.utils.getContractAddress({ from: signerAddr, nonce });
    const oplLAccountAbstractionEnclave = await OPLAccountAbstractionEnclave.deploy(
      expectedOPLAccountAbstractionPaymasterAddress,
    );
    await oplLAccountAbstractionEnclave.deployed();
    console.log("oplAccountAbstractionEnclave", oplLAccountAbstractionEnclave.address);
    console.log("expectedOPLAccountAbstractionPaymaster", expectedOPLAccountAbstractionPaymasterAddress);
    return oplLAccountAbstractionEnclave.address;
  });

task("deploy-paymaster")
  .addParam("enclaveAddr")
  .setAction(async (args, hre) => {
    await hre.run("compile");
    const OPLAccountAbstractionPaymaster = await hre.ethers.getContractFactory("OPLAccountAbstractionPaymaster");
    const oplAccountAbstractionPaymaster = await OPLAccountAbstractionPaymaster.deploy(
      ENTRY_POINT_ADDRESS,
      args.enclaveAddr,
    );
    await oplAccountAbstractionPaymaster.deployed();
    console.log("oplAccountAbstractionPaymaster", oplAccountAbstractionPaymaster.address);
    const addStakeTx = await oplAccountAbstractionPaymaster.addStake(1, { value: 1 });
    await addStakeTx.wait();
    console.log("oplAccountAbstractionPaymaster - staked", addStakeTx.hash);
    const depositTx = await oplAccountAbstractionPaymaster.deposit({ value: hre.ethers.utils.parseEther("0.1") });
    await depositTx.wait();
    console.log("oplAccountAbstractionPaymaster - depositted", depositTx.hash);
    return oplAccountAbstractionPaymaster.address;
  });

const accounts = process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [];

const config: HardhatUserConfig = {
  solidity: "0.8.18",
  networks: {
    hardhat: {
      chainId: 1337, // @see https://hardhat.org/metamask-issue.html
      forking: {
        url: "https://rpc.ankr.com/eth_goerli",
      },
    },
    local: {
      url: "http://127.0.0.1:8545",
    },
    goerli: {
      url: "https://rpc.ankr.com/eth_goerli",
      chainId: 5,
      accounts,
    },
    "sapphire-testnet": {
      url: "https://testnet.sapphire.oasis.dev",
      chainId: 0x5aff,
      accounts,
    },
  },
};

export default config;
