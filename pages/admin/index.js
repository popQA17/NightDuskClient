import { Box, Heading, HStack, Icon, Skeleton, Spacer, StatUpArrow, Text, useColorModeValue, useToast, VStack, Wrap } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { FaLaptop, FaNewspaper, FaTag } from "react-icons/fa"
import AdminLayout from "../../components/AdminLayout"
import Card from "../../components/Card"
import { config, creds, vars } from "../../config"
import $ from 'jquery'
import { useRouter } from "next/router"
export default function Admin({isLoggedIn, setIsLoggedIn}){
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState({})
    const toast = useToast({
        position: 'bottom-left',
        isClosable: true
    })
    function StatCard({loading, name, icon, value, color}){
        return(<>
        <HStack as={loading && Skeleton} px={'10px'} bg={useColorModeValue('gray.50', 'black')} alignItems={'center'} rounded={'lg'} height={'80px'} width={'200px'}>
            <VStack justifyContent={'center'} height={'50px'} minWidth={'50px'} bg={useColorModeValue(`${color || config.accent}.500`, `${color || config.accent}.200`)} rounded={'lg'}>
                <Icon as={icon} fontSize={'30px'} color={useColorModeValue('white', 'black')}/>
            </VStack>
            <VStack alignItems={'flex-start'} ml={'10px !important'} spacing={'0'} justifyContent={'center'} height={'full'} width={'full'}>
                <Text fontSize={'small'} fontWeight={'semibold'} color={useColorModeValue("blackAlpha.700", 'whiteAlpha.700')}>{name}</Text>
                <Text fontSize={'xl'} fontWeight={'semibold'}>{value}</Text>
            </VStack>
        </HStack>
        </>)
    }
    const router = useRouter()
    return(<>
    <AdminLayout callback={()=>{
        $.ajax({
            url: `${vars.apiRoute}/admin/projects/get?key=${creds.siteKey}&token=${localStorage.getItem('token')}`
        }).then((res)=>{
            if (res.status == 'OK'){
                setData(res)
                setLoading(false)
            } else if (res.status == 'INVALID'){
                toast({
                    title: "Invalid Token",
                    description: "Please login to the site again!",
                    status: 'error'
                })
            } else if (res.status == 'SUSPENDED'){
                toast({
                    title: "Site Suspended",
                    description: "This site has been suspended. Please check with the site owner.",
                    status: 'error'
                })
            } else if (res.status == 'NOT_FOUND'){
                toast({
                    title: "Invalid SiteKey",
                    description: "Please contact the site owner to rectify this issue.",
                    status: 'error'
                })
            } else {
                toast({
                    title: "Unexpected Error",
                    description: "Please try again later.",
                    status: 'error'
                })
            }
        }).catch(()=>{
            toast({
                title: "Unexpected Error",
                description: "Please try again later.",
                status: 'error'
            })
        })
    }} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}>
        <Heading mt={'20px'}>Dashboard</Heading>
        <HStack width={'full'} py={'30px'}>
            <Spacer/>
                <StatCard loading={loading} name={'Docs'} value={!loading && data.docs.length} icon={FaNewspaper}/>
                <StatCard loading={loading} name={'Categories'} value={!loading && data.categories.length} icon={FaTag}/>
                <StatCard loading={loading} name={'Status'} color={"green"} value={'Active'} icon={FaLaptop}/>
            <Spacer/>
        </HStack>
        <HStack width={'full'} height={'400px'}>
            <Spacer/>
            <Card loading={loading} width={'50%'} maxWidth={'500px'} link={'/admin/documentation'} title={"Recently Added"}>
                {data.docs && data.docs.map((doc, index)=>{
                    if (index < 6){
                        return <HStack cursor={'pointer'} onClick={()=> router.push(`/admin/docs/edit/${doc.id}/`)} p={'10px'} width={'full'} _hover={{bg: useColorModeValue('blackAlpha.50', 'whiteAlpha.100')}}>
                            <VStack bg={useColorModeValue('white', 'zinc.900')} justifyContent={'center'} rounded={'lg'} height={'50px'} width={'50px'}>
                                <Icon fontSize={'2xl'} as={FaNewspaper}/>
                            </VStack>
                            <Text fontWeight={'500'} fontSize={'lg'}>{doc.title}</Text>
                        </HStack>
                    }
                })}

            </Card>
            <Card loading={loading} width={'50%'} maxWidth={'500px'} title={"Recent Activity"}>
                <VStack height={'full'} justifyContent={'center'}>
                    <Heading>🚧 WIP!</Heading>
                    <Text>This portion is not complete.</Text>
                </VStack>
            </Card>
            <Spacer/>
        </HStack>
    </AdminLayout>
    </>)
}