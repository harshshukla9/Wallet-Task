import React from 'react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import '@solana/wallet-adapter-react-ui/styles.css';

const Navbar = () => {
    return (
        <div className="px-5 w-full flex items-center justify-between border-solid bg-white text-black py-4">
            <div className="flex-shrink-0">
                <h1 className="font-bold text-3xl cursor-pointer hover:text-gray-400">Swatantra</h1>
            </div>
            <div className="flex-grow text-center ">
                <h2 className="font-mono text-2xl md:block hidden">A Web Based Crypto Wallets</h2>
            </div>
            <div className="flex-shrink-0">
                <WalletMultiButton />
            </div>
        </div>
    );
};

export default Navbar;
