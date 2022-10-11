import { createContext, useEffect, useState } from "react";
import { create as ipfsHttpClient } from "ipfs-http-client";
// const client = ipfsHttpClient("https://ipfs.infura.io:5001/api/v0");
const projectId = "2Fz23J00nsXS26rLWSy4GMv1pMQ";
const projectSecretKey = "af7dba1ac63c9bdaeba8216a219b8bee";
const auth = `Basic ${Buffer.from(`${projectId}:${projectSecretKey}`).toString(
  "base64"
)}`;
const subdomain = "https://inok-nft-marketplace.infura-ipfs.io";
const client = ipfsHttpClient({
  host: `infura-ipfs.io`,
  port: 5001,
  protocol: "https",
  headers: {
    authorization: auth,
  },
});
//
export const NFTContext = createContext();

export const NFTProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState("");
  const nftCurrency = "ETH";
  //
  const checkIfWalletIsConnected = async () => {
    if (!window.ethereum) return alert("Please install MetaMask");
    const accounts = await window.ethereum.request({ method: "eth_accounts" });
    if (accounts.length) {
      setCurrentAccount(accounts[0]);
    } else {
      console.log({ accounts });
    }
    console.log({ accounts });
  };
  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);
  //
  const connectWallet = async () => {
    if (!window.ethereum) return alert("Please install MetaMask");
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    setCurrentAccount(accounts[0]);
    window.location.reload();
  };
  //
  const uploadTOIPFS = async (file) => {
    try {
      const added = await client.add({ content: file });

      //   const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      const url = `${subdomain}/ipfs/${added.path}`;
      return url;
    } catch (error) {
      console.log("Error uploading file to IPFS");
    }
  };
  //
  return (
    <NFTContext.Provider
      value={{ nftCurrency, connectWallet, currentAccount, uploadTOIPFS }}
    >
      {children}
    </NFTContext.Provider>
  );
};
