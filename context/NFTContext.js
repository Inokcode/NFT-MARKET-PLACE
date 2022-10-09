import { createContext } from "react";

export const NFTContext = createContext();

export const NFTProvider = ({ children }) => {
  const nftCurrency = "MATIC";
  return (
    <NFTContext.Provider value={{ nftCurrency }}>
      {children}
    </NFTContext.Provider>
  );
};
