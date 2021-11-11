import { ethers } from 'ethers';
import { useContext, useEffect, useState } from 'react';
import { Web3Context } from '../../context/Web3Context';
import Link from 'next/link'



const AuthZone = () => {
    const [showModal, setShowModal] = useState({
        show: false,
        nft: null
    });

    const {
        account,
        connect,
        NFTs,
        isConnected
    } = useContext(Web3Context)

    const handleConnect = async (e) => {
        e.preventDefault()
        await connect()
    }

    const handleModal = (nft) => {
        setShowModal({
            show: !showModal.show,
            nft
        })
    }

    useEffect(() => {
        console.log('DEBUG:UC:NFTs', NFTs)
    }, [NFTs])




    return (
        <div className=" w-screen h-full flex flex-col">
            <div className="flex flex-col items-center justify-center m-4">
                {
                    !account &&
                    <button className="p-6 m-6 rounded rounded-2xl border border-blue-600 " onClick={(e) => handleConnect(e)}>Connect</button>
                }
                {
                    !account && isConnected &&
                    <h1>No estas Conectado con tu cuenta</h1>

                }
                {
                    account &&
                    <h1>Account: {account.slice(0, 6) + '...' + account.slice(account.length - 4, account.length)}</h1>
                }
                <div className="border rounded-lg m-4 h-full w-full m-auto p-4 shadow">
                    {
                        NFTs && NFTs.length > 0 &&
                        NFTs.map((nft) => {
                            return (
                                <div key={nft.id} className='bg-white shadow rounded-lg flex flex-col'>
                                    <img src={nft.meta.image} alt="nft" className="rounded-2xl p-2" />
                                    <hr className="mx-2 " />
                                    <div className="flex flex-row justify-around border-b mx-2">
                                        <h1 className="text-center">
                                            {`${nft.meta.name}`}
                                        </h1>

                                        <h1 className="text-center">
                                            {`#${nft.id.replace('0x', '')}`}
                                        </h1>


                                    </div>
                                    <p className="text-center text-sm font-light">{nft.meta.description}</p>
                                    {nft.balance > 0 &&

                                        <button
                                            onClick={(e) => { e.preventDefault(); handleModal(nft) }}
                                            className="text-center text-sm border border-blue-600  rounded-lg p-1 mx-4 my-2 hover:text-white hover:bg-blue-600" >
                                            {`You have ${nft.balance} NFTs, Show benefits as owner`}
                                        </button>

                                    }

                                </div>
                            )
                        })
                    }

                </div>
            </div>

            {
                showModal.show &&
                <div className="absolute h-full top-0 w-screen bg-blue-600 border flex flex-col items-center justify-center">
                    <button
                        className="absolute top-0 w-full border p-1"
                        onClick={(e) => { e.preventDefault(); setShowModal(false) }}>close modal</button>
                    <h1>{showModal.nft.id}</h1>
                </div>
            }
        </div >
    )
}

export default AuthZone
