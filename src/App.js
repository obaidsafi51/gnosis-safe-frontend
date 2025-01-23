import React, { useContext } from "react";
import { MetaMaskContext } from "./MetaMaskContext";
import SubmitTransaction from "./components/SubmitTransaction";
import ConfirmTransaction from "./components/ConfirmTransaction";
import ExecuteTransaction from "./components/ExecuteTransaction";
import ViewTransactions from "./components/ViewTransactions";
import "./App.css";

// Utility function to shorten the address
const shortenAddress = (address) => {
  if (!address) return "";
  return `${address.slice(0, 6)}.......${address.slice(-6)}`;
};

const App = () => {
  const { account, connectMetaMask } = useContext(MetaMaskContext);

  return (
    <div className="container">
      {/* Navigation Bar */}
      <div className="navbar">
        <h1>Gnosis Safe Simplified</h1>
        {account ? (
          <div className="address" style={{ color: "white" }}>
            {shortenAddress(account)}
          </div>
        ) : (
          <button onClick={connectMetaMask}>Connect Wallet</button>
        )}
      </div>

      {/* Cards for Components */}
      <div className="card">
        <SubmitTransaction />
      </div>
      <div className="card">
        <ConfirmTransaction />
      </div>
      <div className="card">
        <ExecuteTransaction />
      </div>
      <div className="card">
        <ViewTransactions />
      </div>
    </div>
  );
};

export default App;