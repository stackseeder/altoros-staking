import React, { useEffect, useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import { formatEther } from '@ethersproject/units'
import { useEagerConnect, useInactiveListener } from '../hooks'
import { Spinner } from './Spinner'
import { injected } from "../config/connectors";

const Account = () => {
    const {account} = useWeb3React()
    return (
        <div style={{ marginRight: 20 }}>
            <span>Account: </span>
            <span>
                {account === null
                    ? '-'
                    : account
                        ? `${account.substring(0, 6)}...${account.substring(account.length - 4)}`
                        : ''}
            </span>
        </div>
    )
}

const Balance = () => {
    const {account, library, chainId} = useWeb3React()
    const [balance, setBalance] = useState(0)

    useEffect(() => {
        if (!!account && !!library) {
            let stale = false

            library
                .getBalance(account)
                .then((balance) => {
                    if (!stale) {
                        setBalance(balance)
                    }
                })
                .catch(() => {
                    if (!stale) {
                        setBalance(null)
                    }
                })

            return () => {
                stale = true
                setBalance(undefined)
            }
        }
    }, [account, library, chainId])

    return (
        <div style={{ marginRight: 20 }}>
            <span>Balance: </span>
            <span>{balance === null ? 'Error' : balance ? `${formatEther(balance)}` : ''}</span>
        </div>
    )
}

const Header = () => {
    const context = useWeb3React()
    const {connector, activate, deactivate, active, error} = context
    const [activatingConnector, setActivatingConnector] = useState()

    const triedEager = useEagerConnect()

    useInactiveListener(!triedEager || !!activatingConnector)

    useEffect(() => {
        if (activatingConnector && activatingConnector === connector) {
            setActivatingConnector(undefined)
        }
    }, [activatingConnector, connector])

    const currentConnector = injected
    const activating = currentConnector === activatingConnector
    const connected = currentConnector === connector
    const disabled = !triedEager || !!activatingConnector || connected || !!error

    const handleActive = () => {
        setActivatingConnector(currentConnector)
        activate(currentConnector)
    }

    return (
        <div className="app-header">
            <Account />
            <Balance />
            <div className="btn-container">
                <button
                    style={{
                        borderColor: activating ? 'orange' : connected ? 'green' : 'unset',
                        cursor: disabled ? 'unset' : 'pointer',
                    }}
                    className="btn-active"
                    disabled={disabled}
                    onClick={handleActive}
                >
                    <div
                        className="checked"
                    >
                        {activating && <Spinner color={'black'} style={{ height: '25%', marginLeft: '-1rem' }} />}
                        {connected && (
                            <span role="img" aria-label="check">✅</span>
                        )}
                    </div>
                    Active Metamask
                </button>
                {(active || error) && (
                    <button
                        className="btn-deactive"
                        onClick={() => deactivate()}
                    >
                        Deactivate
                    </button>
                )}
            </div>
        </div>
    )
}

export default Header;
