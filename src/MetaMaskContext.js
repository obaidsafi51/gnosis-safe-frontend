import { createContext, useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";
import GnosisSafeSimplifiedABI from "./contracts/GnosisSafeSimplified.json"; // Import the ABI

const MetaMaskContext = createContext();

const MetaMaskProvider = ({ children }) => {
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [provider, setProvider] = useState(null);
  const [isConnected, setIsConnected] = useState(false); // Track connection status

  // Check if MetaMask is installed
  const isMetaMaskInstalled = () => {
    return !!window.ethereum;
  };

  // Connect to MetaMask and initialize the contract
  const connectMetaMask = useCallback(async () => {
    if (!isMetaMaskInstalled()) {
      alert("Please install MetaMask!");
      return;
    }

    try {
      // Request account access
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      setAccount(accounts[0]);

      // Initialize provider and signer
      const provider = new ethers.BrowserProvider(window.ethereum);
      setProvider(provider);

      const signer = await provider.getSigner();

      // Replace with your contract address
      const contractAddress = "0x99CEC52E121B4370B4B750f68654B93957776398";

      // Initialize the contract
      const contract = new ethers.Contract(
        contractAddress,
        GnosisSafeSimplifiedABI, // Use the imported ABI
        signer
      );
      setContract(contract);
      setIsConnected(true); // Set connection status to true

      // Listen for account changes
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        } else {
          setAccount(null);
          setContract(null);
          setIsConnected(false);
        }
      });

      // Listen for chain changes
      window.ethereum.on("chainChanged", () => {
        window.location.reload(); // Reload the page on chain change
      });
    } catch (error) {
      console.error("Error connecting to MetaMask:", error);
      alert("Failed to connect to MetaMask. Please try again.");
    }
  }, []); // No dependencies, so the function is memoized and won't change

  // Check if the user is already connected on page load
  useEffect(() => {
    const checkConnection = async () => {
      if (isMetaMaskInstalled() && window.ethereum.selectedAddress) {
        await connectMetaMask();
      }
    };

    checkConnection();
  }, [connectMetaMask]); // Add connectMetaMask to the dependency array

  return (
    <MetaMaskContext.Provider value={{ account, contract, provider, isConnected, connectMetaMask }}>
      {children}
    </MetaMaskContext.Provider>
  );
};

export { MetaMaskContext, MetaMaskProvider };