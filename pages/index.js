import Login from '../components/web3/Login'
import MainLayout from '../layout/MainLayout'


export default function Home() {
  return (
    <MainLayout>
      <div className="flex flex-wrap items-center justify-around h-96 max-w-4xl mt-6 sm:w-full">  
        <Login/>  
      </div>
    </MainLayout>
  )
}
