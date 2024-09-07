import React, { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Connection, PublicKey, Transaction, SystemProgram } from '@solana/web3.js';

const TransferSol = () => {
    const { publicKey, sendTransaction } = useWallet();
    const [recipient, setRecipient] = useState('');
    const [amount, setAmount] = useState('');
    const [showPopup, setShowPopup] = useState(false);
    const [transactionStatus, setTransactionStatus] = useState('');

    const handleTransfer = async () => {
        if (!publicKey) {
            alert('Please connect your wallet.');
            return;
        }

        if (!recipient || !amount) {
            alert('Please provide both recipient address and amount.');
            return;
        }

        try {
            const connection = new Connection('https://api.devnet.solana.com');
            const recipientPublicKey = new PublicKey(recipient);
            const lamports = parseFloat(amount) * 1e9; // Convert SOL to lamports

            const transaction = new Transaction().add(
                SystemProgram.transfer({
                    fromPubkey: publicKey,
                    toPubkey: recipientPublicKey,
                    lamports,
                })
            );

            const signature = await sendTransaction(transaction, connection);

            // Wait for confirmation of the transaction
            const confirmation = await connection.confirmTransaction(signature, 'confirmed');

            if (confirmation.value.err) {
                throw new Error('Transaction confirmation failed');
            }

            setTransactionStatus(`Transaction confirmed!\nSignature: ${signature}`);
            setShowPopup(true);
        } catch (error) {
            console.error('Error sending transaction:', error);
            setTransactionStatus('Transaction failed! ' + error.message);
            setShowPopup(true);
        } finally {
            setTimeout(() => {
                setShowPopup(false);
            }, 10000); // Show popup for 10 seconds
        }
    };

    useEffect(() => {
        console.log('Transaction Status:', transactionStatus);
    }, [transactionStatus]);

    return (
        <div className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-lg shadow-lg max-w-lg mx-auto">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Transfer SOL on Devnet</h2>
            <input
                type="text"
                placeholder="Recipient Address"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className="w-full p-3 mb-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
                type="number"
                placeholder="Amount in SOL"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full p-3 mb-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
                className="w-full py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                onClick={handleTransfer}
            >
                Transfer SOL
            </button>
            {showPopup && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50 text-wrap">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm mx-4 transition transform scale-95 opacity-100">
                        <p className="text-center text-lg font-medium text-black whitespace-pre-wrap break-words">{transactionStatus}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TransferSol;
