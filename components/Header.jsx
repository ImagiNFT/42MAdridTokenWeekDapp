import { Universelle } from './svg/Logo'

const Header = () => {
    return (
        <div className="flex flex-row w-full flex-1 px-20 text-center pb-4 border-b">
            <h1 className="text-4xl font-bold">
                42 Madrid Token Week 
            </h1>
            <Universelle />
            
        </div>
    )
}

export default Header
