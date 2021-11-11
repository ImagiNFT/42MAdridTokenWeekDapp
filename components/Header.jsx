import { Universelle } from './svg/Logo'

const Header = () => {
    return (
        <div className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center pb-4 border-b">
            <h1 className="text-4xl font-bold">
                <a className="text-blue-600 text-5xl" href="https://42Madrid.com" target="_blank">
                    42Madrid Token Week
                </a>
            </h1>
            <Universelle />
        </div>
    )
}

export default Header
