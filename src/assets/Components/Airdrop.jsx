import React, { useState } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';

const Airdrop = () => {
    const [airdropAmount, setAirdropAmount] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const wallet = useWallet();
    const { connection } = useConnection();

    const handleAirdrop = async () => {
        if (!wallet.publicKey) {
            setError('Please connect your wallet first.');
            return;
        }

        const amount = parseFloat(airdropAmount);
        if (isNaN(amount) || amount <= 0 || amount > 2) {
            setError('Please enter a valid amount between 0 and 2 SOL.');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const signature = await connection.requestAirdrop(
                wallet.publicKey,
                amount * LAMPORTS_PER_SOL
            );
            await connection.confirmTransaction(signature);
            alert(`Successfully airdropped ${amount} SOL to your wallet!`);
        } catch (err) {
            console.error('Airdrop failed:', err);
            setError('Airdrop failed'+err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-lg shadow-lg max-w-lg mx-auto">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Airdrop SOL on Devnet</h2>
            <input
                type="number"
                placeholder="SOL amount (max 2)"
                value={airdropAmount}
                onChange={(e) => setAirdropAmount(e.target.value)}
                className="w-full p-3 mb-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
                max="2"
                step="0.1"
            />
            
            <button
                className="w-full py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 disabled:opacity-50"
                onClick={handleAirdrop}
                disabled={isLoading || !wallet.publicKey}
            >
                {isLoading ? 'Processing...' : 'Airdrop SOL'}
            </button>

            {error && <p className="mt-4 text-red-500">{error}</p>}
        </div>
    );
};

export default Airdrop;