import React, { useState, useContext } from "react";
import { MetaMaskContext } from "../MetaMaskContext";

const ConfirmTransaction = () => {
  const { contract } = useContext(MetaMaskContext);
  const [transactionId, setTransactionId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleConfirm = async (e) => {
    e.preventDefault();
    setError("");

    if (!transactionId) {
      setError("Please enter a transaction ID");
      return;
    }

    setLoading(true);

    try {
      const tx = await contract.confirmTransaction(transactionId);
      await tx.wait();
      alert("Transaction confirmed successfully!");
      setTransactionId("");
    } catch (error) {
      console.error("Error confirming transaction:", error);
      setError(`Confirmation failed: ${error.reason || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="component">
      <h2>Confirm Transaction</h2>
      <form onSubmit={handleConfirm}>
        <input
          type="text"
          placeholder="Transaction ID"
          value={transactionId}
          onChange={(e) => setTransactionId(e.target.value)}
          disabled={loading}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Confirming..." : "Confirm"}
        </button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default ConfirmTransaction;