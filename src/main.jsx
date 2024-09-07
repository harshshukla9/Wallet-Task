import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { WalletProvider, ConnectionProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';
import App from './App.jsx';
import './index.css';
import { Buffer } from 'buffer';

// Polyfill Buffer globally
window.Buffer = Buffer;

const wallets = [new PhantomWalletAdapter()];

const network = clusterApiUrl('devnet'); // You can change 'devnet' to 'mainnet-beta' or 'testnet'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ConnectionProvider endpoint={network}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <App  />
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  </StrictMode>,
);
