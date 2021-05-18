import React from 'react';
import { Web3ReactProvider } from '@web3-react/core';
import { Web3Provider } from "@ethersproject/providers";
import Staking from "./pages/Staking";
import './App.css';

function getLibrary(provider) {
    const library = new Web3Provider(provider)
    library.pollingInterval = 12000
    return library
}

const App = () => {
    return (
        <Web3ReactProvider getLibrary={getLibrary}>
            <Staking />
        </Web3ReactProvider>
    )
}

export default App;
