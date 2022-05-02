import '../styles/globals.css'
import { createTheme, ThemeProvider } from '@mui/material'
import Layout from '../Components/Layout';
import { SWRConfig } from 'swr'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'dayjs/locale/es'

const theme = createTheme({
  typography: {
    fontFamily: 'Raleway, Arial',
  },
  palette: {}, 
  overrides: {}
});

const fetcher = (...args) => fetch(...args).then(res => res.json())

function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider theme={theme}>
        <Layout>
        <ToastContainer />
          <SWRConfig value={{ provider: () => new Map, fetcher }}>
            <Component {...pageProps} />
          </SWRConfig>
        </Layout>
    </ThemeProvider>
  )
}

export default MyApp
