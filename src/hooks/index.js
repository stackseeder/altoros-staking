import { useState, useEffect } from 'react';
import { useWeb3React } from '@web3-react/core';
import { injected } from '../config/connectors'

export function useEagerConnect() {
    const { activate, active } = useWeb3React()

    const [tried, setTried] = useState(false)

    useEffect(() => {
        injected.isAuthorized().then((isAuthorized) => {
            if (isAuthorized) {
                activate(injected, undefined, true).catch(() => {
                    setTried(true)
                })
            } else {
                setTried(true)
            }
        })
    }, [activate])

    useEffect(() => {
        if (!tried && active) {
            setTried(true)
        }
    }, [tried, active])

    return tried
}

export function useInactiveListener(suppress) {
    const { active, error, activate } = useWeb3React()

    useEffect(() => {
        const { ethereum } = window
        if (ethereum && ethereum.on && !active && !error && !suppress) {
            const handleConnect = () => {
                activate(injected)
            }
            const handleChainChanged = () => {
                activate(injected)
            }
            const handleAccountsChanged = (accounts) => {
                if (accounts.length > 0) {
                    activate(injected)
                }
            }
            const handleNetworkChanged = () => {
                activate(injected)
            }

            ethereum.on('connect', handleConnect)
            ethereum.on('chainChanged', handleChainChanged)
            ethereum.on('accountsChanged', handleAccountsChanged)
            ethereum.on('networkChanged', handleNetworkChanged)

            return () => {
                if (ethereum.removeListener) {
                    ethereum.removeListener('connect', handleConnect)
                    ethereum.removeListener('chainChanged', handleChainChanged)
                    ethereum.removeListener('accountsChanged', handleAccountsChanged)
                    ethereum.removeListener('networkChanged', handleNetworkChanged)
                }
            }
        }
    }, [active, error, suppress, activate])
}