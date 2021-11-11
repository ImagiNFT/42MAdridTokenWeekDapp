import { ethers } from 'ethers';
import { createContext, useEffect, useState } from 'react'
import detectEthereumProvider from '@metamask/detect-provider';
import { toast } from 'react-toastify'

import NFTFactory from '../contracts/NFTFactory.jsx';

const { address, abi, network: factNet } = NFTFactory


const networks = {
    137: {
        chainName: "Polygon",
        chainId: "0x89",
        rpcUrls: ["https://polygon-rpc.com"],
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

    getProviderWithoutMetaMask: function ({ url }) {
        const provider = new ethers.providers.JsonRpcProvider(url)
        console.log('UTILS:WEB3:PROVIDER', provider)
        return provider
    },

    connectWithoutMetamask: function () {
        const provider = this.getProviderWithoutMetaMask({ url: networks[factNet.chainId].rpcUrls[0] })
        const contract = this.connectSmartContract({ abi, address, signer: provider })

        return { provider, contract }
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
            return await window.ethereum.request({
                method: "wallet_switchEthereumChain",
                params: [{ chainId: network.chainId }],
            });
        } catch (error) {
            if (error.code === 4902) {
                try {
                    return await window.ethereum.request({
                        method: "wallet_addEthereumChain",
                        params: [
                            network,
                        ],
                    });
                } catch (error) {
                    toast.error(error.message);
                }
            }
        }
    },

    connect: async function () {
        try {
            const detectedProvider = await detectEthereumProvider();
            if (detectedProvider) {
                await this.requestAccount()
                const provider = this.getProvider({ detectedProvider })
                let network = await this.getNetwork({ provider })
                if (network?.chainId !== factNet?.chainId) {
                    toast.warning('Please switch to the correct network')
                    let response = await this.switchNetwork({ network: networks[factNet.chainId] })
                    console.log('UTILS:WEB3:SWITCHNETWORK:', response)
                }
                network = await this.getNetwork({ provider })
                if (network?.chainId === factNet?.chainId) {
                    const signer = await this.getSigner({ provider })
                    const account = await this.getAccount({ provider })
                    let contract;
                    contract = this.connectSmartContract({ abi, address, signer })
                    return { contract, account, provider, network, signer }
                }
            } else {
                toast.error('Please install MetaMask.')
                const provider = this.getProviderWithoutMetaMask({ url: networks[factNet.chainId].rpcUrls[0] })
                const contract = this.connectSmartContract({ abi, address, signer: provider })
                let network = await this.getNetwork({ provider })
                return { provider, contract, network, account: null, signer: null }
            }
        } catch (error) {
            toast.error('Error connecting', error.message)
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
    const [isConnected, setIsConnected] = useState(false)


    useEffect(async function () {
        async function fetchNFTs() {
            if (NFTFactory && !NFTs) {
                let nfts = await getNFTs()
                setNFTs(nfts)
            }
            if (NFTs?.filter(n => n.balance !== 0).length === 0 && account) {
                let nfts = await getNFTs()
                setNFTs(nfts)
            }
        }
        await fetchNFTs()
    }, [NFTs, NFTFactory, account])

    useEffect(() => {
        const { contract, provider } = utils.connectWithoutMetamask()
        setNFTFactory(contract)
        setProvider(provider)
        setIsConnected(true)
    }, [])





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
                let balance = account ? await NFTFactory.balanceOf(account, id) : 0
                nfts.push({ meta, id, balance })
            }
            return nfts
        } catch (error) {
            toast.error('Error while fetching NFTs.')
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
            toast.error('Error while connecting.')
            console.error("ERR:WEB3CTX:CONNECT:", error)
        }
    }


    const states = {
        account,
        network,
        provider,
        signer,
        NFTFactory,
        NFTs,
        isConnected
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