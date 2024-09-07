import React, { useState, useEffect } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { Connection, PublicKey } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';

const TokenDetails = () => {
  const [tokenAccounts, setTokenAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const wallet = useWallet();
  const { connection } = useConnection();

  useEffect(() => {
    if (wallet.publicKey) {
      fetchTokenAccounts();
    }
  }, [wallet.publicKey, connection]);

  const fetchTokenAccounts = async () => {
    if (!wallet.publicKey) return;

    setLoading(true);
    setError(null);

    try {
      // Fetch token accounts
      const accounts = await connection.getParsedTokenAccountsByOwner(wallet.publicKey, {
        programId: TOKEN_PROGRAM_ID,
      });

      // Fetch Solana Token List
      const tokenListResponse = await fetch('https://cdn.jsdelivr.net/gh/solana-labs/token-list@main/src/tokens/solana.tokenlist.json');
      const tokenList = await tokenListResponse.json();
      console.log(tokenList);  // Log token list to verify structure
      const tokenMap = new Map(tokenList.tokens.map(token => [token.address, token]));

      const accountsWithDetails = await Promise.all(
        accounts.value.map(async (account) => {
          const parsedInfo = account.account.data.parsed.info;
          const mint = new PublicKey(parsedInfo.mint);
          const tokenInfo = tokenMap.get(mint.toString()) || {};
          
          return {
            mint: parsedInfo.mint,
            tokenAmount: parsedInfo.tokenAmount,
            name: tokenInfo.name || 'Unknown Token',
            symbol: tokenInfo.symbol || 'UNKNOWN',
            logo: tokenInfo.logoURI || 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png', // Default to SOL logo
            decimals: tokenInfo.decimals || parsedInfo.tokenAmount.decimals,
          };
        })
      );

      setTokenAccounts(accountsWithDetails);
    } catch (err) {
      console.error('Error fetching token accounts:', err);
      setError('Failed to fetch token accounts. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatBalance = (amount, decimals) => {
    const balance = amount.uiAmount !== null ? amount.uiAmount : amount.amount / Math.pow(10, decimals);
    return balance.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 9 });
  };

  return (
    <div className="p-4 bg-gray-50 rounded-lg shadow-lg max-w-4xl mx-auto">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Token Details</h2>
      {wallet.publicKey ? (
        <>
          <button
            onClick={fetchTokenAccounts}
            className="mb-4 px-3 py-1 text-sm bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
          >
            Refresh Token Details
          </button>
          {loading ? (
            <p className="text-center">Loading token details...</p>
          ) : error ? (
            <p className="text-red-500 text-center">{error}</p>
          ) : (
            <div className="overflow-x-auto w-[25rem] h-[30rem]">
              <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
                <thead className="bg-gray-100 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-600">Token</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-600">Symbol</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-600">Balance</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-600">Mint</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {tokenAccounts.map((account, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-2 text-sm text-gray-800">
                        <div className="flex items-center">
                          <img src={account.logo} alt={account.name} className="w-6 h-6 mr-2 rounded-full" />
                          {account.name}
                        </div>
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-800">{account.symbol}</td>
                      <td className="px-4 py-2 text-sm text-gray-800">
                        {formatBalance(account.tokenAmount, account.decimals)} {account.symbol}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-800">
                        <span title={account.mint}>
                          {account.mint.slice(0, 4)}...{account.mint.slice(-4)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      ) : (
        <p className="text-center">Please connect your wallet to view token details.</p>
      )}
    </div>
  );
};

export default TokenDetails;
