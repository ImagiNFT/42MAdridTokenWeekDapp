import MainLayout from '../layout/MainLayout'


export default function Home() {
  return (
    <MainLayout>
      <div className="flex flex-wrap items-center justify-around h-96 max-w-4xl mt-6 sm:w-full">  
          <p className="mt-3 text-2xl max-w-40">
            Here you can find information about how to create your own{' '} token and start bringing benefits to the community.
          </p>
          <div className="max-w-40 flex flex-col mt-3">
            <h1 className="text-blue-600 text-4xl border-b border-blue-600 ">Resources</h1>
            <a className="text-2xl hover:text-blue-600" href="https://google.es">
              Smart Contract NFT
            </a>
            <a className="text-2xl hover:text-blue-600" href="https://google.es">
              Web3 Github Repo in Nextjs
            </a>
            <a className="text-2xl hover:text-blue-600" href="https://docs.openzeppelin.com/contracts/4.x/erc1155">
              OpenZeppelin Docs for ERC1155
            </a>
          </div>
        </div>
    </MainLayout>
  )
}
