import Head from 'next/head'
import Header from '../components/Header'

const MainLayout = ({ children }) => {
    return (
        <div className="flex flex-1 flex-col items-center justify-center min-h-screen py-2">
            <Head>
                <title>42 Madrid Token Week Metaverse Pass by Universelle</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Header />

            <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
                {children}
            </main>

        </div>
    )
}

export default MainLayout
