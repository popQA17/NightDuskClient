import { ColorModeScript } from '@chakra-ui/react'
import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang='en'>
      <Head />
      <body>
        {/* 👇 Here's the script */}
        <ColorModeScript initialColorMode={'system'} />
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}