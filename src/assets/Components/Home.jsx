import React, { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Connection, clusterApiUrl, PublicKey } from '@solana/web3.js';
import { FaPaperPlane, FaGift, FaExchangeAlt, FaCoins, FaAddressBook } from 'react-icons/fa';
import Modal from './Modal'; // Import the Modal component
import Transaction from './Transaction';
import Airdrop from './Airdrop';
import MessageAuthentication from './MessageAuthentication';
import LatestTransaction from './LatestTransaction';
import TokenDetails from './TokenDetails';
import { FaKitchenSet } from 'react-icons/fa6';

const Home = () => {
    const { publicKey } = useWallet();
    const [balance, setBalance] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState(null);
    const connection = new Connection(clusterApiUrl('devnet'));

    useEffect(() => {
        if (publicKey) {
            const fetchBalance = async () => {
                const walletBalance = await getWalletBalance(publicKey.toString());
                setBalance(walletBalance);
            };

            fetchBalance();
        }
    }, [publicKey, connection]);

    const getWalletBalance = async (walletAddress) => {
        try {
            const publicKey = new PublicKey(walletAddress);
            const balance = await connection.getBalance(publicKey);
            return balance / 1e9; // Convert lamports to SOL
        } catch (error) {
            console.error('Error fetching balance:', error);
            return null;
        }
    };

    const openModal = (content) => {
        setModalContent(content);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setModalContent(null);
    };

    const renderModalContent = () => {
        switch (modalContent) {
            case 'trans':
                return <Transaction/>;
            case 'airdrop':
                return <Airdrop/>;
            case 'message':
                return <MessageAuthentication/>;
            case 'Tokendetail':
                return <TokenDetails/>;
            case 'Trasaction':
                    return <LatestTransaction/>
            case 'createtoken':
                    return <div>Comming Soon.....</div>
            default:
                return null;
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-800 p-6">
            <div className="flex flex-col items-center justify-center bg-white shadow-lg rounded-lg p-6 mb-6 w-full max-w-md">
                {publicKey ? (
                    <div className="text-center">
                        <h1 className="text-2xl font-semibold mb-2">Wallet Balance</h1>
                        <p className="text-xl font-medium">
                            {balance !== null ? `${balance.toFixed(4)} SOL` : 'Fetching...'}
                        </p>
                        <div className="grid grid-cols-2 gap-4 w-full max-w-md py-12">
                <button
                    className="flex items-center justify-center bg-blue-500 text-white p-4 rounded-lg shadow-md hover:bg-blue-600"
                    onClick={() => openModal('trans')}
                >
                    <FaPaperPlane className="text-xl mr-2" />
                    Send Transaction
                </button>
                <button
                    className="flex items-center justify-center bg-green-500 text-white p-4 rounded-lg shadow-md hover:bg-green-600"
                    onClick={() => openModal('airdrop')}
                >
                    <FaGift className="text-xl mr-2" />
                    Airdrop
                </button>
                <button
                    className="flex items-center justify-center bg-yellow-500 text-white p-4 rounded-lg shadow-md hover:bg-yellow-600"
                    onClick={() => openModal('message')}
                >
                    <FaExchangeAlt className="text-xl mr-2" />
                    Message Athentication
                </button>
                <button
                    className="flex items-center justify-center bg-purple-500 text-white p-4 rounded-lg shadow-md hover:bg-purple-600"
                    onClick={() => openModal('Tokendetail')}
                >
                    <FaCoins className="text-xl mr-2" />
                    Token Details
                </button>
                <button
                    className="flex items-center justify-center bg-purple-500 text-white p-4 rounded-lg shadow-md hover:bg-purple-600"
                    onClick={() => openModal('Trasaction')}
                >
                    <FaAddressBook className="text-xl mr-2" />
                    Latest Transaction
                </button>

                <button
                    className="flex items-center justify-center bg-purple-500 text-white p-4 rounded-lg shadow-md hover:bg-purple-600"
                    onClick={() => openModal('createtoken')}
                >
                    <FaKitchenSet className="text-xl mr-2" />
                    Create token
                </button>
            </div>
                    </div>
                ) : (
                    <div className="text-center">
                        <h1 className="text-2xl font-semibold">Please connect your wallet</h1>
                    </div>
                )}
            </div>
          
            <Modal isOpen={isModalOpen} onClose={closeModal}>
                {renderModalContent()}
            </Modal>
        </div>
    );
};

export default Home;
