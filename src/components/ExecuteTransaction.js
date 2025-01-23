import React, { useState, useContext } from "react";
import { MetaMaskContext } from "../MetaMaskContext";

const ExecuteTransaction = () => {
  const { contract } = useContext(MetaMaskContext);
  const [transactionId, setTransactionId] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleExecute = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!transactionId) {
        setError("Please enter a transaction ID");
        return;
      }

      // Check transaction status
      const transaction = await contract.getTransaction(transactionId);
      if (transaction.executed) {
        setError("Transaction already executed");
        return;
      }
      if (transaction.confirmationsCount < contract.threshold) {
        setError("Not enough confirmations");
        return;
      }

      // Execute the transaction
      const tx = await contract.executeTransaction(transactionId);
      await tx.wait();
      alert("Transaction executed successfully!");
      setTransactionId("");
    } catch (error) {
      console.error("Error executing transaction:", error);
      setError(`Transaction failed: ${error.reason || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="component">
      <h2>Execute Transaction</h2>
      <form onSubmit={handleExecute}>
        <input
          type="text"
          placeholder="Transaction ID"
          value={transactionId}
          onChange={(e) => setTransactionId(e.target.value)}
          disabled={loading}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Executing..." : "Execute"}
        </button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default ExecuteTransaction;
