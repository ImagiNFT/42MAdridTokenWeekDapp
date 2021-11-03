import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import NFTFactory from '../../contracts/NFTFactory'

let utils = {

    requestAccount: async function () {
        return await window.ethereum.request({ method: 'eth_requestAccounts' });
    },

    getProvider: function () {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        console.log('DEBUG:UC:PROVIDER', provider)
        return provider
    },

    getSigner: async function ({ provider }) {
        const signer = await provider.getSigner()
        console.log('DEBUG:UC:SIGNER', signer)
        return signer
    },

    getAccount: async function ({ provider }) {
        const account = await await provider.getSigner().getAddress()
        console.log('DEBUG:UC:ACCOUNT', account)
        return account
    },

    getNetwork: async function ({ provider }) {
        const network = await provider.getNetwork()
        console.log('DEBUG:UC:NETWORK', network)
        return network
    },

    connectSmartContract: function ({ abi, address, signer }) {
        const contract = new ethers.Contract(address, abi, signer)
        console.log('DEBUG:UC:CONTRACT', contract)
        return contract
    },
}


const Login = () => {
    const [account, setAccount] = useState(null)
    const [provider, setProvider] = useState(null)
    const [signer, setSigner] = useState(null)
    const [contract, setContract] = useState(null)
    const [chainId, setChainId] = useState(null)
    const [uri, setUri] = useState(null)
    const [balance, setBalance] = useState(null)

    const { address, abi, network } = NFTFactory

    const connect = async () => {
        let _provider = await utils.getProvider()
        setProvider(_provider)
        let _signer = await utils.getSigner({ provider: _provider })
        setSigner(_signer)
        let _account = await utils.getAccount({ provider: _provider })
        setAccount(_account)
        let _network = await utils.getNetwork({ provider: _provider })
        setChainId(_network.chainId)

        if (_network?.chainId !== network?.chainId) {
            alert('Wrong network! please connect to Polygon')
            setContract(null)
        } else {
            let _contract = utils.connectSmartContract({abi: abi, address: address, signer: _signer})
            setContract(_contract)
            let _uri = await _contract.uri(ethers.BigNumber.from(0))
            setUri(_uri)
            let _balance = await _contract.balanceOf(_account,ethers.BigNumber.from(0))
            setBalance(_balance)
            console.log({uri:_uri, balanceOf: owner.toNumber()})
        }
    }

    const handleConnect = async (e) => {
        e.preventDefault()
        await connect()
    }

    useEffect(() => {
        console.log({ network, address, abi })
        let isMetamask = utils.requestAccount()
        if (!isMetamask) {
            alert('Please install MetaMask')
        }
    }, [])

    return (
        <div className=" w-screen h-full flex flex-col">
            {
                !account &&  
                    <button className="p-6 m-6 rounded rounded-2xl border border-blue-600 " onClick={(e) => handleConnect(e)}>Connect</button>
            }
            {
                account && 
                    <div className="flex flex-col items-center justify-center m-4">
                        <h1>Account: {account.slice(0,6) + '...' + account.slice(account.length - 4, account.length)}</h1>
                        <div className="border rounded-lg m-4 h-96 w-full">
                            {/* AQUI HAY QUE PONER LA IMAGEN DEL TIKET  */}
                            
                        </div>
                    </div>
                }
        </div>
    )
}

export default Login
