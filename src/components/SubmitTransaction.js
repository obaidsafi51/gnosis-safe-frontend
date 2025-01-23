import React, { useState, useContext, useEffect } from "react";
import { MetaMaskContext } from "../MetaMaskContext";
import { ethers } from "ethers";

const SubmitTransaction = () => {
  const { contract } = useContext(MetaMaskContext);
  const [destination, setDestination] = useState("");
  const [value, setValue] = useState("");
  const [data, setData] = useState("");
  const [transactionId, setTransactionId] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!contract) return;

    // Define the event listener
    const handleTransactionId = (transactionId) => {
      setTransactionId(transactionId.toString());
      alert(`Transaction submitted with ID: ${transactionId}`);
    };

    // Attach the event listener
    contract.on("TransactionId", handleTransactionId);

    // Clean up the event listener
    return () => {
      contract.off("TransactionId", handleTransactionId);
    };
  }, [contract]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (!ethers.isAddress(destination)) {
        setError("Invalid destination address");
        return;
      }
      if (isNaN(value) || Number(value) <= 0) {
        setError("Invalid value");
        return;
      }

      const tx = await contract.submitTransaction(destination, ethers.parseEther(value), data);
      await tx.wait();

      // Clear input fields after successful submission
      setDestination("");
      setValue("");
      setData("");
    } catch (error) {
      console.error("Error submitting transaction:", error);
      setError(`Submission failed: ${error.reason || error.message}`);
    }
  };

  return (
    <div className="component">
      <h2>Submit Transaction</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Destination Address"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
        />
        <input
          type="text"
          placeholder="Value (ETH)"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <input
          type="text"
          placeholder="Data (0x for ETH transfers)"
          value={data}
          onChange={(e) => setData(e.target.value)}
        />
        <button type="submit">Submit</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {transactionId && <p>Transaction ID: {transactionId}</p>}
    </div>
  );
};

export default SubmitTransaction;