import { Box, Button, Heading, HStack, Icon, IconButton, Input, InputGroup, InputLeftElement, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Skeleton, Spacer, StatUpArrow, Text, useColorModeValue, useDisclosure, useToast, VStack, Wrap } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { FaLaptop, FaNewspaper, FaPen, FaPlus, FaSearch, FaTag } from "react-icons/fa"
import AdminLayout from "../../../components/AdminLayout"
import { config, creds, vars } from "../../../config"
import $ from 'jquery'
import { useRouter } from "next/router"
export default function Admin({isLoggedIn, setIsLoggedIn}){
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState({})
    const [selectedCategory, setSelectedCategory] = useState("All")
    const [catvalue, setCatValue] = useState("")
    const [catloading, setCatLoading] = useState(false)
    const [search, setSearch] = useState("")
    const toast = useToast({
        position: 'bottom-left',
        isClosable: true
    })
    const router = useRouter()
    const { isOpen: categoryAdd, onOpen: onCategoryAddOpen, onClose: onCategoryAddClose } = useDisclosure()
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
        <Heading mt={'20px'}>Documentation</Heading>
        <VStack mt={'30px'}>
            <InputGroup size={'lg'}>
                <InputLeftElement><Icon as={FaSearch}/></InputLeftElement>
                <Input value={search} onChange={(e)=> setSearch(e.target.value)} variant={'filled'} _focus={{borderColor: useColorModeValue(`${config.accent}.500`, `${config.accent}.200`)}} _placeholder={{color: useColorModeValue('blackAlpha.700', 'whiteAlpha.700')}} placeholder={"Search for doc titles"} />
            </InputGroup>
            <HStack overflow={'auto'} width={'full'} py={'20px'}>
                <Button variant={selectedCategory == "All" ? 'solid' : 'outline'} bg={selectedCategory == "All" && useColorModeValue("black", 'white')} onClick={()=> setSelectedCategory("All")} color={selectedCategory == "All" && useColorModeValue("white", 'black')} _hover={{}} _active={{}} rounded={'full'}>All</Button>
                {data.categories && 
                    data.categories.map((cat)=>{
                        return <Button variant={selectedCategory == cat.name ? 'solid' : 'outline'} bg={selectedCategory == cat.name && useColorModeValue("black", 'white')} onClick={()=> setSelectedCategory(cat.name)} color={selectedCategory == cat.name && useColorModeValue("white", 'black')} _active={{}} _hover={{}} rounded={'full'}>{cat.name}</Button>
                    })
                }
                <IconButton onClick={onCategoryAddOpen} icon={<FaPlus/>} rounded={'full'} variant={'outline'}/>
                <Spacer/>
                <Button onClick={()=> router.push('/admin/docs/create')} leftIcon={<FaPlus/>} variant={'outline'}>
                    Create
                </Button>
            </HStack>
            {data.docs && data.docs.map((doc)=>{
                if (selectedCategory == 'All' || selectedCategory ==  data.categories.filter((cat)=> cat.id == doc.category)[0].name){
                    if (!search || doc.title.toLowerCase().includes(search.toLowerCase())){
                        return <HStack transition={'ease-in-out 0.3s all;'} rounded={'lg'} shadow={'md'} bg={useColorModeValue('gray.50', 'black')} cursor={'pointer'} onClick={()=> router.push(`/admin/docs/edit/${doc.id}/`)} p={'10px'} width={'full'} _hover={{transform: 'translateY(-5px)'}}>
                        <VStack bg={useColorModeValue('white', 'zinc.900')} justifyContent={'center'} rounded={'lg'} height={'50px'} width={'50px'}>
                            <Icon fontSize={'2xl'} as={FaNewspaper}/>
                        </VStack>
                        <Text fontWeight={'500'} fontSize={'lg'}>{doc.title}</Text>
                        <Spacer/>
                        <Button leftIcon={<FaPen/>} nClick={()=> router.push(`/admin/docs/edit/${doc.id}/`)}>Edit</Button>
                    </HStack>
                }
                }
            })}
        </VStack>
        <Modal isOpen={categoryAdd} onClose={onCategoryAddClose}>
        <ModalOverlay backdropFilter={'blur(3px)'} />
        <ModalContent>
          <ModalHeader>Add Categories</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input value={catvalue} onChange={(e)=> setCatValue(e.target.value)} autoFocus></Input>
            <Text mt={'20px'} color={useColorModeValue('red.500', 'red.300')}>Warning: To delete categories, you have to contact the service owner.</Text>
          </ModalBody>
          <ModalFooter>
            <Button variant={'ghost'} mr={3} onClick={onCategoryAddClose}>
              Close
            </Button>
            <Button isDisabled={!catvalue || catloading} isLoading={catloading} colorScheme={`${config.accent}`} mr={3} onClick={()=>{
                setCatLoading(true)
                $.ajax({
                    url: `${vars.apiRoute}/admin/projects/createcat?key=${creds.siteKey}&token=${window.localStorage.getItem('token')}&new=${catvalue}`
                }).then((res)=>{
                    if (res.status == 'OK'){
                        const copy = {...data}
                        copy.categories.push({
                            name: catvalue,
                            id: res.id
                        })
                        setData(copy)
                        console.log(copy)
                        setCatValue("")
                        onCategoryAddClose()
                    }
                    setCatLoading(false)
                })
            }}>
              Create
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </AdminLayout>
    </>)
}