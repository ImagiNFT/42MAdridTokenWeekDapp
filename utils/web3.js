import { ethers } from 'ethers';
import NFTFactory from '../contracts/NFTFactory.jsx';

const networks = {
    137: {
        chainName: "Polygon",
        chainId: "0x89",
        rpcUrls: ["polygon-rpc.com"],
        nativeCurrency: {
            name: "Matic",
            symbol: "Matic",
            decimals: 18,
        },
        blockExplorerUrls: ["https://polygonscan.com"]

    },
    80001: {
        chainId: "0x13881",
        chainName: "Mumbai",
        rpcUrls: ["https://rpc-mumbai.matic.today"],
        nativeCurrency: {
            name: "Matic",
            symbol: "Matic",
            decimals: 18,
        },
        blockExplorerUrls: ["https://explorer-mumbai.maticvigil.com"],
    }
}


const utils = {

    requestAccount: async function () {
        return await window.ethereum.request({ method: 'eth_requestAccounts' });
    },

    getProvider: function () {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        console.log('UTILS:WEB3:PROVIDER', provider)
        return provider
    },

    getSigner: async function ({ provider }) {
        const signer = await provider.getSigner()
        console.log('UTILS:WEB3:SIGNER', signer)
        return signer
    },

    getAccount: async function ({ provider }) {
        const account = await await provider.getSigner().getAddress()
        console.log('UTILS:WEB3:ACCOUNT', account)
        return account
    },

    getNetwork: async function ({ provider }) {
        const network = await provider.getNetwork()
        console.log('UTILS:WEB3:NETWORK', network)
        return network
    },

    connectSmartContract: function ({ abi, address, signer }) {
        const contract = new ethers.Contract(address, abi, signer)
        console.log('UTILS:WEB3:CONTRACT', contract)
        return contract
    },

    switchNetwork: async function ({ network }) {
        try {
            await window.ethereum.request({
                method: "wallet_switchEthereumChain",
                params: [{ chainId: network.chainId }],
            });
        } catch (error) {
            if (error.code === 4902) {
                try {
                    await window.ethereum.request({
                        method: "wallet_addEthereumChain",
                        params: [
                            network,
                        ],
                    });
                } catch (error) {
                    alert(error.message);
                }
            }
        }
    },

    connect: async function () {
        try {
            const { address, abi, network: factNet } = NFTFactory


            if (typeof (window.ethereum) !== 'undefined') {
                let rquest = await this.requestAccount()
                console.log({ rquest })
                const provider = this.getProvider()
                const signer = await this.getSigner({ provider })
                const account = await this.getAccount({ provider })
                const network = await this.getNetwork({ provider })
                let contract;
                if (network?.chainId !== factNet?.chainId) {
                    alert('Please switch to the correct network')
                    console.log('UTILS:WEB3:CONNECT:SWITCH_TO', networks[factNet.chainId])
                    await this.switchNetwork({ network: networks[factNet.chainId] })
                }
                if (network?.chainId === factNet?.chainId) {
                    contract = this.connectSmartContract({ abi, address, signer })
                    return { contract, account, provider, network, signer }
                } else {
                    throw new Error('Please switch to the correct network')
                }
            } else {
                alert('Please install MetaMask.')
                throw new Error('Please install MetaMask')
            }
        } catch (error) {
            console.error("UTILS:WEB3:CONNECT:", error)
        }
    }

}

export default utils
