import { Button, HStack, Icon, IconButton, Image, Input, InputGroup, InputLeftAddon, InputLeftElement, InputRightAddon, Spacer, Text, useColorMode, useColorModeValue } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { config } from "../config";
import { FaMoon, FaSearch, FaSun } from 'react-icons/fa'
import { useRouter } from "next/router";
import NextNprogress from 'nextjs-progressbar'
import Head from "next/head";
export default function Navbar(){
    const [scrolled, setScrolled] = useState(false)
    useEffect(()=>{
        window.onscroll = ()=>{
            if (window.scrollY > 5){
                setScrolled(true)
            } else {
                setScrolled(false)
            }
        }
        return ()=>{
            window.onscroll = null
        }
    }, [])
    const [query, setQuery] = useState("")
    const {colorMode, toggleColorMode } = useColorMode()
    const router = useRouter()
    return(<>
    <Head>
        <link rel="icon" href={useColorModeValue(`${config.light.siteLogo}`, `${config.dark.siteLogo}`)}></link>
    </Head>
    <NextNprogress color={useColorModeValue(`black`, `white`)} options={{showSpinner: false}}/>
    <HStack px={'20px'} bg={scrolled ? colorMode  == 'light' ? 'white' : 'zinc.800' : 'transparent'} position={'fixed'} top={0} left={0} width={'full'} height={'60px'} zIndex={5}>
        <Image onClick={()=> router.push('/')} cursor={'pointer'} src={useColorModeValue(config.light.siteLogo, config.dark.siteLogo)} height={"40px"} width={'40px'} rounded={'lg'} />
        <Text onClick={()=> router.push('/')} cursor={'pointer'} fontSize={'lg'} fontWeight={'bold'}>{config.siteName}</Text>
        <Spacer/>
        {router.pathname != '/search' &&
        <form onSubmit={(e)=>{
            e.preventDefault()
            if(query){
                setQuery(null)
                router.push(`/search?q=${query}`)
            }
        }} style={{width: '100%'}}>
            <InputGroup variant={'filled'}>
                <InputLeftElement color={useColorModeValue('blackAlpha.700', 'whiteAlpha.700')}><Icon as={FaSearch}/></InputLeftElement>
                <Input value={query} onChange={(e)=> setQuery(e.target.value)} placeholder="Search for article names" bg={useColorModeValue('gray.50','whiteAlpha.200')} _hover={{bg: useColorModeValue('gray.100', 'whiteAlpha.300')}} _focus={{bg: useColorModeValue('gray.100', 'whiteAlpha.300')}} variant={'filled'} width={'full'} />
            </InputGroup>
        </form>
        }
        <Button colorScheme={'gray'} onClick={()=> router.push('/login')}>Login</Button>
        <IconButton icon={colorMode == 'light' ? <FaMoon/> : <FaSun/>} onClick={toggleColorMode}/>
    </HStack>
    </>)
}