import { Box, Button, Heading, HStack, Icon, Image, Spinner, useColorModeValue, useToast, VStack } from "@chakra-ui/react";
import { when } from "jquery";
import { useEffect, useState } from "react";
import { config, vars } from "../config";
import $ from 'jquery'
import { FaCog, FaExternalLinkSquareAlt, FaHome, FaNewspaper } from "react-icons/fa";
import { useRouter } from "next/router";
export default function AdminLayout({isLoggedIn, setIsLoggedIn, callback=()=>{}, children}){
    const [loading, setLoading] = useState(true)
    const toast = useToast({
        position: 'bottom-left'
    })
    useEffect(()=>{
        function checkUser(callback){
            $.ajax({
                url: `${vars.apiRoute}/projects/verify?token=${localStorage.getItem("token")}`
            }).then((res)=>{
                if (res.status == 'OK'){
                    callback('OK')
                } else if (res.status == 'INVALID'){
                    callback('INVALID')
                } else if (res.status == 'SUSPENDED'){
                    callback("SUSPENDED")
                } else {
                    callback("UNKNOWN_ERROR")
                }
            }).catch(()=>{
                return callback("UNKNOWN_ERROR")
            })
        }
        if (isLoggedIn == false){
            checkUser((res)=>{
                if (res == 'OK'){
                    setIsLoggedIn(true)
                    setLoading(false)
                    callback()
                } else if (res == 'INVALID'){
                    setLoading(true)
                    setIsLoggedIn(false)
                    toast({
                        title: "Invalid Token",
                        description: "Please login again.",
                        status: 'error'
                    })
                } else if (res == 'SUSPENDED'){
                    setLoading(true)
                    setIsLoggedIn(false)
                    toast({
                        title: "Site Suspended",
                        description: "This site has been suspended. Please check with the site owner.",
                        status: 'error'
                    })
                } else if (res == 'UNKNOWN_ERROR'){
                    setLoading(true)
                    setIsLoggedIn(false)
                    toast({
                        title: "Unknown Error",
                        description: "An unknown error occured. Try again later.",
                        status: 'error'
                    })
                } else {
                    console.log(res)
                }
            })
        } else {
            setLoading(false)
            callback()
        }
        function whenFocus(event){ 
            if (isLoggedIn == true){
                checkUser((res)=>{
                    if (res == 'OK'){
                        setIsLoggedIn(true)
                        setLoading(false)
                    } else if (res == 'INVALID'){
                        setLoading(true)
                        setIsLoggedIn(false)
                        toast({
                            title: "Invalid Token",
                            description: "Please login again.",
                            status: 'error'
                        })
                    } else if (res == 'SUSPENDED'){
                        setLoading(true)
                        setIsLoggedIn(false)
                        toast({
                            title: "Site Suspended",
                            description: "This site has been suspended. Please check with the site owner.",
                            status: 'error'
                        })
                    } else if (res == 'UNKNOWN_ERROR'){
                        setLoading(true)
                        setIsLoggedIn(false)
                        toast({
                            title: "Unknown Error",
                            description: "An unknown error occured. Try again later.",
                            status: 'error'
                        })
                    } else {
                        console.log(res)
                    }
                })
            }
        }
        window.addEventListener("focus", whenFocus, false);
        return ()=>{
            window.removeEventListener("focus", whenFocus)
        }
    }, [])
    const links = [
        {
            name: "Dashboard",
            icon: FaHome,
            href: '/admin'
        },
        {
            name: "Documentation",
            icon: FaNewspaper,
            href: '/admin/docs'
        },
        {
            name: "Settings",
            icon: FaCog,
            href: '/admin/settings'
        }
    ]
    const router = useRouter()
    return(<>
    <HStack pt={"100px"} pb={'30px'} px={'10px'} width={'full'} height={'100vh'}>
        <VStack spacing={'20px'} py={'30px'} px={'30px'} bg={useColorModeValue('white', 'zinc.900')} shadow={'md'} height={'full'} maxWidth={'300px'} minWidth={'300px'} rounded={'lg'}>
            <HStack mb={'30px !important'} width={'full'} spacing={'10px'} cursor={'pointer'} onClick={()=> router.push('/admin')}>
                <Image src={useColorModeValue(config.light.siteLogo, config.dark.siteLogo)} height={'50px'} width={"50px"} rounded={'lg'}/>
                <Heading fontSize={'2xl'}>{config.siteName}</Heading>
            </HStack>
            {links.map((link)=>{
                return(<Button onClick={()=> router.push(link.href)} justifyContent={'left'} leftIcon={<Icon as={link.icon}/>} key={link.name} size={'lg'} variant={router.pathname == link.href ? 'solid' : 'ghost'} colorScheme={router.pathname == link.href ? config.accent : 'gray'} width={'full'}>{link.name}</Button>)
            })}
        </VStack>
        <VStack justifyContent={'center'} rounded={'lg'} bg={useColorModeValue('white','zinc.900')} height={'full'} width={'full'} shadow={'md'}>
            {loading ? 
            <>
            <Spinner color={useColorModeValue(`${config.accent}.500`, `${config.accent}.200`)}/>
            </>
            :
            <Box px={'20px'} overflow={'auto'} height={'full'} width={'full'}>
                {children}
            </Box>
            }
        </VStack>
    </HStack>
    </>)
}