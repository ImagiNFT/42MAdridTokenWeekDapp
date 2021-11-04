import { ethers } from 'ethers';
import { useContext, useEffect, useState } from 'react';
import { Web3Context } from '../../context/Web3Context';



const AuthZone = () => {
    const {
        account,
        connect,
        NFTs
    } = useContext(Web3Context)

    const handleConnect = async (e) => {
        e.preventDefault()
        await connect()
    }

    useEffect(() => {
        console.log('DEBUG:UC:NFTs', NFTs)
    }, [NFTs])

    return (
        <div className=" w-screen h-full flex flex-col">
            {
                !account &&
                <button className="p-6 m-6 rounded rounded-2xl border border-blue-600 " onClick={(e) => handleConnect(e)}>Connect</button>
            }
            {
                account &&
                <div className="flex flex-col items-center justify-center m-4">
                    <h1>Account: {account.slice(0, 6) + '...' + account.slice(account.length - 4, account.length)}</h1>
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
                                                {`#${nft.id}`}
                                            </h1>
                                        </div>
                                        <p className="text-center text-sm font-light">{nft.description}</p>
                                    </div>
                                )
                            })
                        }

                    </div>
                </div>
            }
        </div>
    )
}

export default AuthZone
