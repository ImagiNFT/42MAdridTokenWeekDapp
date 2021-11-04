import { ethers } from 'ethers';
import { createContext, useEffect, useState } from 'react'
import detectEthereumProvider from '@metamask/detect-provider';

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

    getProvider: function ({ detectedProvider = false }) {
        const provider = new ethers.providers.Web3Provider(detectedProvider ? detectedProvider : window.ethereum)
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
            const detectedProvider = await detectEthereumProvider();


            if (detectedProvider) {
                await this.requestAccount()
                const provider = this.getProvider({ detectedProvider })
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

export const Web3Context = createContext()

export const Web3Provider = ({ children }) => {
    const [account, setAccount] = useState(null)
    const [network, setNetwork] = useState(null)
    const [provider, setProvider] = useState(null)
    const [signer, setSigner] = useState(null)
    const [NFTFactory, setNFTFactory] = useState(null)
    const [NFTs, setNFTs] = useState(null)


    // NFTFactory UTILS


    const fetchMetadata = async ({ uri }) => {
        try {
            let response = await fetch(uri)
            let data = await response.json()
            return data
        } catch (error) {
            console.error("ERR:WEB3CTX:FETCHMETADATA:", error)
        }
    }

    const getNFTs = async () => {
        try {
            let lastId = await NFTFactory.getNFT_ID()
            let uri = await NFTFactory.uri(0)
            let nfts = []
            for (let i = 0; i < lastId.toNumber(); i++) {
                let id = ethers.BigNumber.from(i).toHexString()
                let customUri = uri.replace('{id}', ethers.BigNumber.from(i).toHexString().replace('0x', '').padStart(64, '0'))
                let res = await fetch(customUri)
                let meta = await res.json()
                nfts.push({ meta, id })
            }
            return nfts
        } catch (error) {
            console.error("ERR:WEB3CTX:GETNFTS:", error)
        }
    }


    const connect = async () => {
        try {
            if (typeof window !== 'undefined') {
                console.log("LLEGO")
                const { contract, account, provider, network, signer } = await utils.connect()
                console.log({ contract, account, provider, network, signer })
                setAccount(account)
                setNetwork(network)
                setProvider(provider)
                setNFTFactory(contract)
                setSigner(signer)
            }
        } catch (error) {
            console.error("ERR:WEB3CTX:CONNECT:", error)
        }
    }

    useEffect(function () {
        async function fetchNFTs() {
            if (NFTFactory && (!NFTs || NFTs.length === 0)) {
                let nfts = await getNFTs()
                console.log("AQUI", { nfts })
                setNFTs(nfts)
            }
        }
        fetchNFTs()
    }, [NFTs, NFTFactory])


    const states = {
        account,
        network,
        provider,
        signer,
        NFTFactory,
        NFTs,
    }

    const methods = {
        connect,
    }

    const contextProps = {
        ...states,
        ...methods,
    }

    return (
        <Web3Context.Provider value={contextProps}>
            {children}
        </Web3Context.Provider>
    )
}