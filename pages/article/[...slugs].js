import { Box, Button, Heading, HStack, Icon, Image, ListItem, Spacer, Spinner, Text, UnorderedList, useColorModeValue, useToast, VStack } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import $ from 'jquery'
import { config, creds, vars } from "../../config";
import Head from "next/head";
import { serialize } from "next-mdx-remote/serialize";
import { MDXRemote } from "next-mdx-remote";
import { FaBook, FaClock, FaInfo, FaNewspaper, FaPen, FaTags } from "react-icons/fa";
import { timeDiff } from "../../components/timeDIff";
export default function Article(){
    const router = useRouter()
    const [others, setOthers] = useState([])
    const [data, setData] = useState({})
    const [loading, setLoading] = useState(true)
    const toast = useToast({
        position: 'bottom-left',
        isClosable: true
    })
    const [source, setSource] = useState(null)
    useEffect(()=>{
        setLoading(true)
        if (router.query.slugs && router.query.slugs.length > 0){
            $.ajax({
                url: `${vars.apiRoute}/docs/get?key=${creds.siteKey}&id=${router.query.slugs[0]}`
            }).then((res)=>{
                if (res.status == 'OK'){
                    setLoading(false)
                    window.history.replaceState("", "EEEE", `/article/${res.data.id}/${res.data.title.replace(/ /g, "-")}`)
                    setData(res.data)
                    setOthers(res.others)
                    async function serial(){
                        setSource(await serialize(res.data.content))
                    }
                    serial()
                } else if (res.status == 'INVALID'){
                    toast({
                    title: "Unknown Article",
                    description: "This article does not exist.",
                    status: "warning"
                    })
                } else if (res.status == 'NOT_FOUND'){
                    toast({
                    title: "Unknown Site Key",
                    description: "Please contact the site owner to rectify this issue.",
                    status: "warning"
                    })
                } else if (res.status == 'SUSPENDED'){
                    toast({
                    title: "Site Suspended",
                    description: "This site has been suspended. Please check with the site owner.",
                    status: "error"
                    })
                } else {
                    toast({
                    title: "Oops!",
                    description: "An unexpected error occured. Try again later.",
                    status: 'error'
                    })
                }
                }).catch(()=>{
                toast({
                    title: "Oops!",
                    description: "An unexpected error occured. Try again later.",
                    status: 'error'
                })
            })
        }
    }, [router.query.slugs])
    function DetailCard({icon, text}){
        return <HStack bg={useColorModeValue('gray.50', 'whiteAlpha.100')} rounded={'lg'} width={'full'}>
            <VStack justifyContent={'center'} width={'50px'} height={'50px'} roundedLeft={'lg'} bg={useColorModeValue('blackAlpha.50', 'whiteAlpha.50')}>
                <Icon as={icon}/>
            </VStack>
            <Text fontWeight={'semibold'}>{text}</Text>
        </HStack>
    }
    return(<>
    <Head>
        <title>{loading ? "Loading Article.." : `${data.title} | ${config.siteName}`}</title>
    </Head>
    <VStack minHeight={'100vh'} justifyContent={loading && 'center'}>
        {loading ?
        <Spinner color={useColorModeValue(`${config.accent}.500`, `${config.accent}.300`)}/>
        :
        <HStack alignItems={'flex-start'} width={'full'} padding={'10px'} pt={'80px'}  rounded={'lg'} maxWidth={'1000px'}>
            <VStack justifyContent={'left'} position={'relative'} alignItems={'flex-start'} className="md-wrapper" width={'full'} padding={'20px'} rounded={'lg'} bg={useColorModeValue('white', 'zinc.900')}>
                <VStack width={'full'} position={'absolute'} left={0} top={0}>
                    <VStack alignItems={'flex-start'} width={'full'} position={'relative'} style={{aspectRatio: '2/1'}} >
                        <Image roundedTop={'lg'} position={'absolute'} left={0} top={0} width={'full'} height={'full'} src={config.light.homepageBanner}/>
                        <VStack alignItems={'flex-start'} py={'10px'} px={'20px'} height={'100px'} width={'full'} position={'absolute'} bottom={0} bgGradient={`linear(to-b, transparent, 40%, ${useColorModeValue('white', 'zinc.900')})`}>
                            <Spacer/>
                            <Heading mb={'10px !important'} fontSize={'4xl !important'}>{data.title}</Heading>
                        </VStack>
                    </VStack>
                </VStack>
                <Box left={0} top={0} width={'full'} style={{aspectRatio: '2/1'}}/>
                {source && 
                    <MDXRemote {...source}/>
                }
            </VStack>
            <VStack alignItems={'flex-start'} minWidth={'300px'} padding={'20px'} maxWidth={'300px'} rounded={'lg'} bg={useColorModeValue("white", "zinc.900")}>
                <HStack>
                    <Icon fontSize={'xl'} color={useColorModeValue(`${config.accent}.500`, `${config.accent}.300`)} as={FaBook}/>
                    <Text fontSize={'xl'} fontWeight={'semibold'} color={useColorModeValue(`blackAlpha.800`, 'whiteAlpha.800')}>Details</Text>
                </HStack>
                <DetailCard icon={FaTags} text={data.category && data.category.name}/>
                <DetailCard icon={FaClock} text={data.created_at && timeDiff(data.created_at * 1000)}/>
                {data.edited_at && 
                <DetailCard icon={FaPen} text={data.edited_at && timeDiff(data.edited_at * 1000)}/>
                }
                <HStack>
                    <Icon fontSize={'xl'} color={useColorModeValue(`${config.accent}.500`, `${config.accent}.300`)} as={FaNewspaper}/>
                    <Text fontSize={'xl'} fontWeight={'semibold'} color={useColorModeValue(`blackAlpha.800`, 'whiteAlpha.800')}>Other Articles</Text>
                </HStack>
                { others.length > 0 ?
                <UnorderedList rounded={'lg'} ml={'20px !important'} width={'full'}>
                    {others.map((doc)=>{
                    return <ListItem>
                        <Text onClick={()=> router.push(`/article/${doc.id}/${doc.title.replace(/ /g, "-")}`)} _hover={{color: useColorModeValue(`${config.accent}.500`, `${config.accent}.200`), textDecoration: 'underline'}} textDecoration={"none"} textUnderlineOffset={'2px'} cursor={'pointer'} color={useColorModeValue("blackAlpha.900", 'whiteAlpha.900')} fontSize={'lg'}>{doc.title}</Text>
                    </ListItem>
                    })
                    }
                </UnorderedList>
                :
                <Text textAlign={'center'} color={useColorModeValue('blackAlpha.700', 'whiteAlpha.700')}>Oops! No posts of the same category exist.</Text>
                }
            </VStack>
        </HStack>
        }
    </VStack>
    </>)
}