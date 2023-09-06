import { useEffect, useState } from "react";
import { useEthersSigner } from "./useEthers";
import * as sapphire from "@oasisprotocol/sapphire-paratime";
import { ethers } from "ethers";

export const useSapphire = () => {
  const signer = useEthersSigner();

  const [sapphireWrappedSigner, setSapphireWrappedSigner] = useState<ethers.Signer>();

  useEffect(() => {
    if (!signer) {
      setSapphireWrappedSigner(undefined);
      return;
    }
    const sapphireProvider = sapphire.wrap(signer);
    setSapphireWrappedSigner(sapphireProvider);
  }, [signer]);

  return { sapphireWrappedSigner };
};
