import { ChakraProvider, useColorModeValue } from '@chakra-ui/react'
import '../styles/globals.css'
import Navbar from '../components/Navbar'
import { theme } from '../theme'
import { config } from '../config'
import { useState } from 'react'
import Head from 'next/head'

function MyApp({ Component, pageProps }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  return <>
    <ChakraProvider theme={theme}>
      <Navbar/>
      <Head>
        <title>{config.siteName}</title>
      </Head>
      <Component isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} {...pageProps} />
    </ChakraProvider>
  </>
}

export default MyApp
