import { SimpleAccountAPI } from "@account-abstraction/sdk";
import { EntryPoint__factory } from "@account-abstraction/contracts";

import { ethers } from "hardhat";
import { expect } from "chai";
import { ENTRY_POINT_ADDRESS, SIMPLE_ACCOUNT_FACTORY_ADDRESS } from "../configs";

describe("OPLAccountAbstraction", function () {
  describe("Integration", function () {
    it("Should work with OPL secret deposit", async function () {
      const [signer, beneficiary] = await ethers.getSigners();
      const provider = ethers.provider;
      const OPLAccountAbstractionEnclave = await ethers.getContractFactory("OPLAccountAbstractionEnclave");
      let nonce = await provider.getTransactionCount(signer.address);
      const expectedPaymasterAddress = ethers.utils.getContractAddress({
        from: signer.address,
        nonce: nonce + 1,
      });
      const oplAccountAbstractionEnclave = await OPLAccountAbstractionEnclave.deploy(expectedPaymasterAddress);
      await oplAccountAbstractionEnclave.deployed();
      const OPLAccountAbstractionPaymaster = await ethers.getContractFactory("OPLAccountAbstractionPaymaster");
      const oplAccountAbstractionPaymaster = await OPLAccountAbstractionPaymaster.deploy(
        ENTRY_POINT_ADDRESS,
        oplAccountAbstractionEnclave.address,
      );
      await oplAccountAbstractionPaymaster.deployed();
      await oplAccountAbstractionPaymaster.addStake(1, { value: 1 });
      await oplAccountAbstractionPaymaster.deposit({ value: ethers.utils.parseEther("0.1") });
      const walletAPI = new SimpleAccountAPI({
        provider,
        entryPointAddress: ENTRY_POINT_ADDRESS,
        owner: signer,
        factoryAddress: SIMPLE_ACCOUNT_FACTORY_ADDRESS,
      });
      const accountAddress = await walletAPI.getAccountAddress();
      const unsignedUserOp = await walletAPI.createUnsignedUserOp({
        target: ethers.constants.AddressZero,
        data: "0x",
      });
      unsignedUserOp.paymasterAndData = oplAccountAbstractionPaymaster.address;
      const op = await walletAPI.signUserOp(unsignedUserOp);
      const entryPoint = EntryPoint__factory.connect(ENTRY_POINT_ADDRESS, signer);
      const userOpHash = await entryPoint.getUserOpHash(op);
      const sendSecretGasFeeToHostPaymasterTx = await oplAccountAbstractionEnclave.sendSecretGasFeeToHostPaymaster(
        accountAddress,
        userOpHash,
        { value: ethers.utils.parseEther("0.1") },
      );
      await expect(sendSecretGasFeeToHostPaymasterTx).to.emit(oplAccountAbstractionPaymaster, "SendSecretGasFee");
      const handleOpsTx = await entryPoint.handleOps([op], beneficiary.address);
      await expect(handleOpsTx).to.emit(oplAccountAbstractionEnclave, "UnlockSecretGasFee");
    });
  });
});
