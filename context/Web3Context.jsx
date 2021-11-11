import { ethers } from 'ethers';
import { createContext, useEffect, useState } from 'react'

import config from '../contracts/NFTFactory'
import utils, {networks} from '../utils/web3';

export const Web3Context = createContext()

export const Web3Provider = ({ children }) => {
    const [account, setAccount] = useState(null)
    const [isConnected, setConnected] = useState(false)
    const [network, setNetwork] = useState(null)
    const [provider, setProvider] = useState(null)
    const [signer, setSigner] = useState(null)
    const [NFTFactory, setNFTFactory] = useState(null)
    const [NFTs, setNFTs] = useState(null)

    const { address, abi, network: factNet } = config
    // NFTFactory UTILS

    useEffect(() => {
        let url = networks[factNet.chainId]?.rpcUrls[0]
        console.log({url})
        const provider = utils.getProviderWithoutMetaMask({
            url
        })        
        let contract = utils.connectSmartContract({ abi, address, signer:provider })
        setNFTFactory(contract)
    }, [])

    useEffect(function () {
        async function fetchNFTs() {
            if (NFTFactory && (!NFTs || NFTs.length === 0)) {
                let nfts = await getNFTs()
                console.log("AQUI",{ nfts, NFTFactory })
                setNFTs(nfts)
            }
        }
        fetchNFTs()
    }, [NFTs, NFTFactory])



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
                let customUri = uri.replace('{id}', ethers.BigNumber.from(i).toHexString().replace('0x','').padStart(64, '0'))
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
            console.log("LLEGO")
            const { contract, account, provider, network, signer } = await utils.connect()
            console.log({ contract, account, provider, network, signer })
            setAccount(account)
            setNetwork(network)
            setProvider(provider)
            setNFTFactory(contract)
            setSigner(signer)
            setConnected(true)
        } catch (error) {
            console.error("ERR:WEB3CTX:CONNECT:", error)
        }
    }




    const states = {
        isConnected,
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