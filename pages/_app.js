import 'tailwindcss/tailwind.css'
import 'react-toastify/dist/ReactToastify.css'
import { Web3Provider } from '../context/Web3Context'
import { ToastContainer } from 'react-toastify'


function MyApp({ Component, pageProps }) {
  return (
    <Web3Provider>
      <Component {...pageProps} />
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover />
    </Web3Provider>
  )
}

export default MyApp
