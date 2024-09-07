import React, { useState } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { ed25519 } from '@noble/curves/ed25519';
import bs58 from 'bs58';

const MessageAuthentication = () => {
    const [message, setMessage] = useState('');
    const [signature, setSignature] = useState('');
    const [verificationResult, setVerificationResult] = useState('');
    const wallet = useWallet();
    const { connection } = useConnection();

    const signMessage = async () => {
        if (!wallet.signMessage) {
            setVerificationResult('Wallet does not support message signing');
            return;
        }

        try {
            const encodedMessage = new TextEncoder().encode(message);
            const signedMessage = await wallet.signMessage(encodedMessage);
            const signature = bs58.encode(signedMessage);
            setSignature(signature);
            setVerificationResult('Message signed successfully. Verify the signature below.');
        } catch (error) {
            console.error('Error signing message:', error);
            setVerificationResult('Failed to sign message');
        }
    };

    const verifySignature = async () => {
        if (!wallet.publicKey) {
            setVerificationResult('Please connect your wallet first');
            return;
        }

        try {
            const publicKey = new PublicKey(wallet.publicKey.toBase58());
            const encodedMessage = new TextEncoder().encode(message);
            const signatureUint8 = bs58.decode(signature);

            const isValid = ed25519.verify(signatureUint8, encodedMessage, publicKey.toBytes());

            setVerificationResult(isValid ? 'Signature is valid!' : 'Signature is invalid!');
        } catch (error) {
            console.error('Error verifying signature:', error);
            setVerificationResult('Failed to verify signature');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-lg shadow-lg max-w-lg mx-auto">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Solana Message Authentication</h2>
            <input
                type="text"
                placeholder="Enter the message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full p-3 mb-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
                onClick={signMessage}
                disabled={!wallet.connected || !message}
                className="w-full py-3 mb-4 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 disabled:opacity-50"
            >
                Sign Message
            </button>
            {signature && (
                <>
                    <input
                        type="text"
                        value={signature}
                        readOnly
                        className="w-full p-3 mb-4 border border-gray-300 rounded-lg shadow-sm bg-gray-100"
                    />
                    <button
                        onClick={verifySignature}
                        className="w-full py-3 mb-4 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200"
                    >
                        Verify Signature
                    </button>
                </>
            )}
            {verificationResult && (
                <p className={`mt-4 ${verificationResult.includes('valid') ? 'text-green-600' : 'text-red-600'}`}>
                    {verificationResult}
                </p>
            )}
        </div>
    );
};

export default MessageAuthentication;