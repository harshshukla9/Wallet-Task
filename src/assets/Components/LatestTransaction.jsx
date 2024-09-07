import React, { useState, useEffect } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { Connection, clusterApiUrl } from '@solana/web3.js';

const LatestTransaction = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const wallet = useWallet();
  const { connection } = useConnection();

  useEffect(() => {
    if (wallet.publicKey) {
      fetchLatestTransactions();
    }
  }, [wallet.publicKey, offset]);

  const fetchLatestTransactions = async () => {
    if (!wallet.publicKey) return;

    setLoading(true);
    setError(null);

    try {
      const devnetConnection = new Connection(clusterApiUrl('devnet'));
      const signatures = await devnetConnection.getSignaturesForAddress(
        wallet.publicKey,
        { limit: 5, before: offset ? transactions[transactions.length - 1]?.signature : undefined }
      );

      if (signatures.length === 0) {
        setHasMore(false);
        setLoading(false);
        return;
      }

      const transactionDetails = await Promise.all(
        signatures.map(async (sig) => {
          const tx = await devnetConnection.getTransaction(sig.signature);
          return {
            signature: sig.signature,
            blockTime: new Date(sig.blockTime * 1000).toLocaleString(),
            fee: tx?.meta?.fee ? (tx.meta.fee / 1e9).toFixed(6) : 'N/A',
            status: tx?.meta?.err ? 'Failed' : 'Success'
          };
        })
      );

      setTransactions((prev) => [...prev, ...transactionDetails]);
    } catch (err) {
      console.error('Error fetching transactions:', err);
      setError('Failed to fetch transactions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    if (hasMore) {
      setOffset(transactions[transactions.length - 1]?.signature);
    }
  };

  return (
    <div className="p-4 bg-gray-50 rounded-lg shadow-lg max-w-4xl mx-auto">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Latest Transactions (Devnet)</h2>
      {wallet.publicKey ? (
        <>
          <button
            onClick={() => { setTransactions([]); setOffset(0); setHasMore(true); fetchLatestTransactions(); }}
            className="mb-4 px-3 py-1 text-sm bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
          >
            Refresh Transactions
          </button>
          {loading && transactions.length === 0 ? (
            <p className="text-center">Loading transactions...</p>
          ) : error ? (
            <p className="text-red-500 text-center">{error}</p>
          ) : (
            <>
              <div className="overflow-x-auto overflow-y-auto max-h-96 border border-gray-200 rounded-lg">
                <table className="w-full bg-white">
                  <thead className="bg-gray-100 sticky top-0">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">Signature</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">Time</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">Fee (SOL)</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {transactions.map((tx, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-3 py-2 text-xs text-gray-800 whitespace-nowrap">
                          <span title={tx.signature}>
                            {tx.signature.slice(0, 4)}...{tx.signature.slice(-4)}
                          </span>
                        </td>
                        <td className="px-3 py-2 text-xs text-gray-800 whitespace-nowrap">{tx.blockTime}</td>
                        <td className="px-3 py-2 text-xs text-gray-800 whitespace-nowrap">{tx.fee}</td>
                        <td className="px-3 py-2 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 rounded text-xs ${
                              tx.status === 'Success'
                                ? 'bg-green-200 text-green-800'
                                : 'bg-red-200 text-red-800'
                            }`}
                          >
                            {tx.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {hasMore && (
                <button
                  onClick={handleLoadMore}
                  className="mt-4 px-3 py-1 text-sm bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                >
                  Load More
                </button>
              )}
              {loading && transactions.length > 0 && (
                <p className="mt-2 text-center text-sm text-gray-600">Loading more transactions...</p>
              )}
            </>
          )}
        </>
      ) : (
        <p className="text-center">Please connect your wallet to view transactions.</p>
      )}
    </div>
  );
};

export default LatestTransaction;