import React, { useEffect, useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import Header from '../components/Header';
import * as stakingService from '../services/staking.service';

const getVoteInfo = async (provider, address) => {
    return Promise.all([
        stakingService.getVote(provider, address),
        stakingService.getNegativeVotes(provider),
        stakingService.getPositiveVotes(provider),
        stakingService.getProposalId(provider)
    ]);
};

const submitVote = (provider, address, support) => {
    return stakingService.submitVote(provider, address, support);
};

const Staking = () => {
    const [voteInfo, setVoteInfo] = useState({
        voted: 0,
        votesForYes: 0,
        votesForNo: 0,
        proposalId: 0,
    });
    const { account, active, library } = useWeb3React();

    const handleVote = async (support) => {
        try {
            await submitVote(library.provider, account, support);
        } catch (e) {
            console.log(e)
        }
    };

    useEffect(() => {
        if (active && account && library) {
            const loadVoteInfo = async () => {
                const result = await getVoteInfo(library.provider, account)
                if (result && result.length === 4) {
                    setVoteInfo({
                        voted: Number(result[0]),
                        votesForYes: Number(result[1]),
                        votesForNo: Number(result[2]),
                        proposalId: Number(result[3]),
                    });
                }
            };

            const timer = setInterval( async () => {
                await loadVoteInfo();
            }, 5000)

            // initial load
            loadVoteInfo();

            return () => {
                clearInterval(timer);
            };
        }
    }, [active, library, account]);

    return (
        <>
            <Header />
            {active && (
                <div className="vote-form">
                    <h2 className="vote-form__title">
                        Staking Contract
                    </h2>
                    <div className="vote-form__result">
                        <span>{'Total Votes For Yes:'}</span>
                        <span>{voteInfo.votesForYes}</span>
                    </div>
                    <div className="vote-form__result">
                        <span>{'Total Votes For No:'}</span>
                        <span>{voteInfo.votesForNo}</span>
                    </div>
                    <div className="vote-form__result">
                        <span>{'Proposal ID:'}</span>
                        <span>{voteInfo.proposalId}</span>
                    </div>
                    <hr />
                    <div className="voted-status">
                        {voteInfo.voted === 0 ? (
                            <>
                                <div className="vote-form__warning">
                                    You are not voted yet. Please click the buttons below to vote!
                                </div>
                                <div className="vote-form__cta">
                                    <button className="btn-vote" onClick={() => handleVote(1)}>
                                        Yes
                                    </button>
                                    <button className="btn-vote" onClick={() => handleVote(2)}>
                                        No
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="vote-form__warning">
                                    {' You already '}
                                    {voteInfo.voted === 1 ? '"Yes"' : 'No'}
                                    {' voted!'}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </>
    )
}

export default Staking;
