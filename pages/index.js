import { Badge, Button, Heading, HStack, Icon, Image, Link, List, ListItem, Skeleton, Spacer, Text, Toast, UnorderedList, useColorMode, useColorModePreference, useColorModeValue, useToast, VStack, Wrap } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import $ from 'jquery'
import { config, creds, vars } from "../config"
import { FaClock, FaList, FaPen, FaTag, FaTags } from "react-icons/fa"
import { timeDiff } from "../components/timeDIff"
import { Router, useRouter } from "next/router"
export default function Index(){
  const [categories, setCategories] = useState([])
  const [data, setData] = useState({})
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const toast = useToast({
    position: "bottom-left",
    isClosable: true
  })
  useEffect(()=>{
    setLoading(true)
    $.ajax({
      url: `${vars.apiRoute}/projects/get?key=${creds.siteKey}`
    }).then((res)=>{
      if (res.status == 'OK'){
        setLoading(false)
        setCategories(res.categories)
        setData(res)
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
  const [selectedCategory, setSelectedCategory] = useState("All")
  return(<>
    <VStack backgroundSize={'cover'} backgroundRepeat={'no-repeat'}  backgroundPosition={'bottom'} backgroundColor={useColorModeValue("white", 'zinc.900')} backgroundImage={useColorModeValue(`${config.light.homepageBanner}`, `${config.dark.homepageBanner}`)} height={'300px'} justifyContent={'center'}>
      <Heading>NightDusk</Heading>
      <Text color={useColorModeValue('blackAlpha.700', 'whiteAlpha.700')} fontWeight={'semibold'}>Support Sites made Simple</Text>
    </VStack>
    <HStack pt={'40px'} px={'20px'} overflow={'auto'} width={'full'} py={'20px'}>
        <Button variant={selectedCategory == "All" ? 'solid' : 'outline'} bg={selectedCategory == "All" && useColorModeValue("black", 'white')} onClick={()=> setSelectedCategory("All")} color={selectedCategory == "All" && useColorModeValue("white", 'black')} _hover={{}} _active={{}} rounded={'full'}>All</Button>
        {data.categories && 
            data.categories.map((cat)=>{
                return <Button variant={selectedCategory == cat.name ? 'solid' : 'outline'} bg={selectedCategory == cat.name && useColorModeValue("black", 'white')} onClick={()=> setSelectedCategory(cat.name)} color={selectedCategory == cat.name && useColorModeValue("white", 'black')} _active={{}} _hover={{}} rounded={'full'}>{cat.name}</Button>
            })
        }
    </HStack>
    <HStack alignItems={'flex-start'} width={'full'} px={'20px'} height={'full'}>
      <Wrap spacing={'20px'} width={'full'} py={'10px'}>
        {data.docs && data.docs.map((doc)=>{
          if (selectedCategory == "All" || selectedCategory == categories.filter((cat)=> cat.id == doc.category)[0].name){
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
          }
        })}
      </Wrap>
      <VStack alignItems={'flex-start'} bg={useColorModeValue('white', 'zinc.900')} padding={'20px'} height={'400px'} maxHeight={'400px'} minWidth={'300px'} rounded={'lg'}>
        <HStack>
          <Icon fontSize={'xl'} as={FaList}/>
          <Text fontSize={'xl'} fontWeight={'semibold'} color={useColorModeValue(`blackAlpha.800`, 'whiteAlpha.800')}>Contents</Text>
        </HStack>
        <VStack bg={useColorModeValue("blackAlpha.50", 'whiteAlpha.50')} padding={'10px'} width={'full'} rounded={'lg'}>
          <UnorderedList ml={'30px'} width={'full'}>
            {categories.map((cat)=>{
              return <ListItem>
                <Text fontSize={'lg'} _hover={{color: useColorModeValue(`${config.accent}.500`, `${config.accent}.200`), textDecoration: 'underline'}} textDecoration={"none"} textUnderlineOffset={'2px'} cursor={'pointer'} onClick={()=> setSelectedCategory(cat.name)} color={selectedCategory == cat.name ? useColorModeValue(`${config.accent}.500`, `${config.accent}.200`) : useColorModeValue("blackAlpha.700", 'whiteAlpha.700')}>{cat.name}</Text>
              </ListItem>
            })}
          </UnorderedList>
        </VStack>      
      </VStack>
    </HStack>
  </>)
}