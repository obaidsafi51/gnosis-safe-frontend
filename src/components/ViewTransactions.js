import React, { useState, useContext, useEffect } from "react";
import { MetaMaskContext } from "../MetaMaskContext";
import { ethers } from "ethers";

const ViewTransactions = () => {
  const { contract } = useContext(MetaMaskContext);
  const [transactions, setTransactions] = useState([]);
  const [threshold, setThreshold] = useState(0);

  // Fetch threshold
  useEffect(() => {
    if (contract) {
      contract.threshold().then((threshold) => {
        setThreshold(Number(threshold)); // Convert BigInt to number
      });
    }
  }, [contract]);

  // Fetch transactions
  useEffect(() => {
    const fetchTransactions = async () => {
      if (contract) {
        // Convert BigInt to number
        const count = Number(await contract.getTransactionCount());
        const txList = await Promise.all(
          Array.from({ length: count }, (_, i) =>
            contract.getTransaction(i).then((tx) => ({
              id: i,
              destination: tx.destination,
              value: ethers.formatEther(tx.value),
              executed: tx.executed,
              confirmationsCount: Number(tx.confirmationsCount), // Convert BigInt to number
            }))
          )
        );
        setTransactions(txList);
      }
    };

    fetchTransactions();
    const interval = setInterval(fetchTransactions, 5000);
    return () => clearInterval(interval);
  }, [contract]);

  const getTransactionStatus = (transaction) => {
    if (transaction.executed) return "Executed";
    if (transaction.confirmationsCount >= threshold) return "Confirmed";
    return "Pending";
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "Pending":
        return "status-pending";
      case "Confirmed":
        return "status-confirmed";
      case "Executed":
        return "status-executed";
      default:
        return "";
    }
  };

  const getStatusDescription = (status) => {
    switch (status) {
      case "Pending":
        return "Waiting for confirmations";
      case "Confirmed":
        return "Enough confirmations, ready to execute";
      case "Executed":
        return "Transaction has been executed";
      default:
        return "";
    }
  };

  return (
    <div className="component">
      <h2>Transaction History</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Destination</th>
            <th>Value (ETH)</th>
            <th>Status</th>
            <th>Confirmations</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx) => {
            const status = getTransactionStatus(tx);
            const statusClass = getStatusClass(status);
            return (
              <tr key={tx.id}>
                <td>{tx.id}</td>
                <td>{tx.destination}</td>
                <td>{tx.value}</td>
                <td className={statusClass} title={`${status}: ${getStatusDescription(status)}`}>
                  {status}
                </td>
                <td>{tx.confirmationsCount}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ViewTransactions;