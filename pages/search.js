import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import $ from 'jquery'
import { config, creds, vars } from "../config"
import { motion } from "framer-motion"
import { Badge, Button, Heading, HStack, Icon, IconButton, Image, Input, Spacer, Spinner, Text, useColorModeValue, useToast, VStack, Wrap } from "@chakra-ui/react"
import { FaClock, FaFilter, FaList, FaPen, FaSearch, FaTag } from "react-icons/fa"
import { timeDiff } from "../components/timeDIff"
import Select from "../components/Select"
export default function Search(){
    const [query, setQuery] = useState("")
    const router = useRouter()
    const [data, setData] = useState([])
    const [filteredData, setFilteredData] = useState([])
    const [stage, setStage] = useState(0)
    const [categories, setCategories] = useState([])
    const [selectedCategory, setSelectedCategory] = useState(null)
    const toast = useToast({
        position: 'bottom-left'
    })
    function searchQuery(q, callback){
        $.ajax({
            url: `${vars.apiRoute}/docs/search?query=${q}&key=${creds.siteKey}`
        }).then((res)=>{
            if (res.status == 'OK'){
                callback(res)
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
    useEffect(()=>{
        if (router.query.q){
            setQuery(router.query.q)
        }
    }, [router.query.q])
    useEffect(()=>{
        $.ajax({
            url: `${vars.apiRoute}/projects/get?key=${creds.siteKey}`
          }).then((res)=>{
            const cats = [{
                name: 'All',
                value: null
            }]
            res.categories.map((cat)=>{
                cat.value = cat.id
                cats.push(cat)
            })
            setCategories(cats)
            if (res.status == 'OK'){
                if (query){
                    setStage(2)
                    searchQuery(query, (res)=>{
                        setData(res.data)
                    })
                } else {
                    setStage(1)
                }
            } else if (res.status == 'INVALID'){
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
    }, [])
    useEffect(()=>{
        const fdata = []
        if (data.length > 0){
            data.map((doc)=>{
                if (selectedCategory == null || doc.category == selectedCategory){
                    fdata.push(doc)
                }
            })
            setFilteredData([...fdata])
            
        }
    }, [data, selectedCategory])
    return(<>
        <VStack filter={'blur(10px)'} backgroundSize={'cover'} opacity={0.2} backgroundRepeat={'no-repeat'}  backgroundPosition={'bottom'} backgroundColor={useColorModeValue("white", 'zinc.900')} backgroundImage={useColorModeValue(`${config.light.homepageBanner}`, `${config.dark.homepageBanner}`)} height={'100vh'} justifyContent={'center'}>
        </VStack>
        {stage == 0 ? 
            <VStack height={'100vh'} width={'full'} justifyContent={'center'} position={'fixed'} top={0} zIndex={2}>
                <Spinner size={'lg'}/>
            </VStack>
            : stage == 1 ?
            <VStack justifyContent={'center'} height={'100vh'} width={'full'} position={'absolute'} top={0}>
                <Heading>NightDusk</Heading>
                <Text color={useColorModeValue('blackAlpha.700', 'whiteAlpha.700')} fontWeight={'semibold'}>Support Sites made Simple</Text>
                <form style={{width: '100%', maxWidth: '800px'}} onSubmit={(e)=>{
                        e.preventDefault()
                        setStage(3)
                        searchQuery(query, (res)=>{
                            setStage(2)
                            setData(res.data)
                        })
                }}>
                    <HStack width={'full'} maxWidth={'800px'} as={motion.div} layoutId={'searchbar'}>
                        <Input value={query} onChange={(e)=> setQuery(e.target.value)} placeholder="Search for article names" bg={useColorModeValue('gray.50','whiteAlpha.200')} _hover={{bg: useColorModeValue('gray.100', 'whiteAlpha.300')}} _focus={{bg: useColorModeValue('gray.100', 'whiteAlpha.300')}} variant={'filled'} size={'lg'} width={'full'} />
                        <IconButton onClick={()=>{
                            setStage(3)
                            searchQuery(query, (res)=>{
                                setStage(2)
                                setData(res.data)
                            })
                        }} size={'lg'} colorScheme={query ? config.accent : 'gray'} isDisabled={!query} icon={<Icon as={FaSearch}/>}/>
                    </HStack>
                </form>
            </VStack>
            :
            <HStack alignItems={'flex-start'} px={'20px'} height={'100vh'} pt={'100px'} width={'full'} position={'absolute'} top={0}>
                <VStack alignItems={'flex-start'} p={'10px'} minWidth={'300px'} maxWidth={'300px'} bg={useColorModeValue('whiteAlpha.800', 'whiteAlpha.100')} rounded={'lg'} position={'sticky'} top={0}>
                    <HStack>
                        <Icon fontSize={'xl'} as={FaFilter}/>
                        <Text fontSize={'xl'} fontWeight={'semibold'} color={useColorModeValue(`blackAlpha.800`, 'whiteAlpha.800')}>Filters</Text>
                    </HStack>
                    <VStack width={'full'}>
                        <Text>Category</Text>
                        <Select values={categories} value={selectedCategory} onChange={setSelectedCategory}/>
                    </VStack>
                    <Button width={'full'} mt={'20px !important'} size={'sm'} onClick={()=>{
                        setSelectedCategory(null)
                    }}>Reset Filters</Button>
                </VStack>
                <VStack overflow={'auto'} width={'full'} bg={useColorModeValue('whiteAlpha.800', 'whiteAlpha.100')} rounded={'lg'} minHeight={'90%'}>
                   <form style={{width: '100%'}} onSubmit={(e)=>{
                        e.preventDefault()
                        setStage(3)
                        searchQuery(query, (res)=>{
                            setStage(2)
                            setData(res.data)
                        })
                   }}>
                        <HStack p={'10px'} bg={useColorModeValue('gray.200', 'whiteAlpha.100')} width={'full'} as={motion.div} layoutId={'searchbar'}>
                            <Input value={query} onChange={(e)=> setQuery(e.target.value)} placeholder="Search for article names" bg={useColorModeValue('gray.50','whiteAlpha.200')} _hover={{bg: useColorModeValue('gray.100', 'whiteAlpha.300')}} _focus={{bg: useColorModeValue('gray.100', 'whiteAlpha.300')}} variant={'filled'} size={'lg'} width={'full'} />
                            <IconButton onClick={()=>{
                                setStage(3)
                                searchQuery(query, (res)=>{
                                    setStage(2)
                                    setData(res.data)
                                })
                            }} size={'lg'} colorScheme={query ? config.accent : 'gray'} isDisabled={!query} icon={<Icon as={FaSearch}/>}/>
                        </HStack>
                    </form>
                    {stage == 2 ? filteredData.length > 0 ?
                    <Wrap spacing={'20px'} p={'20px'} width={'full'}>
                        {filteredData.map((doc)=>{
                            return <VStack cursor={'pointer'} onClick={()=> router.push(`/article/${doc.id}/${doc.title.replace(/ /g, "-")}`)} height={'320px'} width={'300px'} bg={"transparent"} rounded={'lg'} _hover={{transform: 'translateY(-10px)', shadow: 'lg'}} shadow={'none'} transition={'ease-in-out all 0.3s'}>
                                <Image rounded={'lg'} height={'200px'} width={'full'} fallbackSrc={config.light.homepageBanner} />
                                <VStack px={'10px'} width={'full'} alignItems={'flex-start'} height={'full'}>
                                <Text width={'full'} _hover={{color: useColorModeValue(`${config.accent}.500`, `${config.accent}.300`)}} fontSize={'3xl'} fontWeight={'bold'}>{doc.title}</Text>
                                <Wrap>
                                    <Badge size={'lg'} colorScheme={'gray'} rounded={'md'}><HStack spacing={'2px'}><Icon fontSize={'x-small'} as={FaTag}/> <Text>{categories.filter((cat)=> cat.id == doc.category)[0].name}</Text></HStack></Badge>
                                    <Badge size={'lg'} colorScheme={'gray'} rounded={'md'}><HStack spacing={'2px'}><Icon fontSize={'x-small'} as={FaClock}/><Text>{timeDiff(doc.created_at * 1000)}</Text></HStack></Badge>
                                    {doc.edited_at && 
                                    <Badge size={'lg'} colorScheme={'gray'} rounded={'md'}><HStack spacing={'2px'}><Icon fontSize={'x-small'} as={FaPen}/><Text>{timeDiff(doc.edited_at * 1000)}</Text></HStack></Badge>
                                    }
                                </Wrap>
                                </VStack>
                                <Spacer/>
                            </VStack>
                        
                        })
                        
                    }
                    </Wrap>
                    :
                    <>
                        <Spacer/>
                            <Heading>No Article Found 🤔</Heading>
                            <Text color={useColorModeValue('blackAlpha.700','whiteAlpha.700')}>Hmm, we couldn&apos;t find your article. Try resetting filters or check for typos.</Text>
                        <Spacer/>
                    </>
                    :
                    <>
                        <Spacer/>
                        <Spinner size={'lg'}/>
                        <Spacer/>
                    </>
                    }
                </VStack>
            </HStack>
        }
    </>)
}