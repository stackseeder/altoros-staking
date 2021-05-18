import Web3 from "web3";
import { stakingABI } from "../config/abi";
import config from "../config/variables";

const getContractInstance = (provider) => {
    const web3 = new Web3(provider);
    return new web3.eth.Contract(stakingABI, config.stakingContractAddress);
};

export const getPositiveVotes = (provider) => {
    const contract = getContractInstance(provider);
    return contract.methods.votesForYes().call();
};

export const getNegativeVotes = (provider) => {
    const contract = getContractInstance(provider);
    return contract.methods.votesForNo().call();
};

export const getVote = (provider, address) => {
    const contract = getContractInstance(provider);
    return contract.methods.getVote(address).call();
};

export const getProposalId = (provider) => {
    const contract = getContractInstance(provider);
    return contract.methods.proposalId().call();
};

export const submitVote = (provider, address, support = 1) => {
    const contract = getContractInstance(provider);
    console.log(contract)
    return contract.methods.vote(support).send({
        from: address,
        value: 10000000000000000,
    });
};