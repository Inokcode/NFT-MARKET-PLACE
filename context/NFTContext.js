import { createContext, useEffect, useState } from "react";
import { create as ipfsHttpClient } from "ipfs-http-client";
import Web3Modal from "web3modal";
import { ethers } from "ethers";
import axios from "axios";
//
import { MarketAddress, MarketAddressABI } from "./constants";
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
const fetchContract = (signerOrProvider) =>
  new ethers.Contract(MarketAddress, MarketAddressABI, signerOrProvider);

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
      console.log("No accounts found");
    }
    console.log({ accounts });
  };
  useEffect(() => {
    checkIfWalletIsConnected();
    createSale("test", "0.025");
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
  const createNFT = async (formInput, fileUrl, router) => {
    const { name, description, price } = formInput;
    if (!name || !description || !price || !fileUrl) return;
    const data = JSON.stringify({ name, description, image: fileUrl });
    try {
      const added = await client.add({ content: file });
      const url = `${subdomain}/ipfs/${added.path}`;
      await createSale(url, price);
      router.push("/");
    } catch (error) {
      console.log("Error uploading file to IPFS");
    }
  };

  const createSale = async (url, formInputPrice) => {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    const price = ethers.utils.parseUnits(formInputPrice, "ether");
    const contract = fetchContract(signer);
    const listingPrice = await contract.getListingPrice();
    const transaction = await contract.createToken(url, price, {
      value: listingPrice.toString(),
    });
    console.log({ contract });
    await transaction.wait();
  };
  //
  const fetchNFTs = async () => {
    const provider = new ethers.providers.JsonRpcProvider();
    const contract = fetchContract(provider);
    const data = await contract.fetchMarketItems();
    // console.log(data);
  };
  //
  return (
    <NFTContext.Provider
      value={{
        nftCurrency,
        connectWallet,
        currentAccount,
        uploadTOIPFS,
        createNFT,
        fetchNFTs,
      }}
    >
      {children}
    </NFTContext.Provider>
  );
};
