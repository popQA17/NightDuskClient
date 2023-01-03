import { Box, Button, Heading, HStack, Icon, IconButton, Input, InputGroup, InputLeftElement, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Skeleton, Spacer, Spinner, StatUpArrow, Text, useColorModeValue, useDisclosure, useToast, VStack, Wrap } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { FaLaptop, FaNewspaper, FaPaperPlane, FaPlus, FaSearch, FaTag } from "react-icons/fa"
import AdminLayout from "../../../../components/AdminLayout"
import { config, creds, vars } from "../../../../config"
import $ from 'jquery'
import CustomInput from "../../../../components/CustomInput"
import { useRouter } from "next/router"
import { serialize } from "next-mdx-remote/serialize"
export default function Admin({isLoggedIn, setIsLoggedIn}){
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [loaded, setLoaded] = useState(false)
    const [cat, setCat] = useState("")
    const [cats, setCats] = useState([])
    const [content, setContent] = useState("")
    const [title, setTitle] = useState("")
    const router = useRouter()
    const toast = useToast({
        position: 'bottom-left',
        isClosable: true
    })
    useEffect(()=>{
        if (router.query.id){
            //const x = setInterval(()=>{
            if (!loaded){
                $.ajax({
                    url: `${vars.apiRoute}/docs/get?key=${creds.siteKey}&id=${router.query.id}`
                }).then((res)=>{
                    if (res.status == 'OK'){
                        setLoading(false)
                        setContent(res.data.content)
                        setTitle(res.data.title)
                        setCat(res.data.category.id)
                        $.ajax({
                            url: `${vars.apiRoute}/admin/projects/get?key=${creds.siteKey}&token=${localStorage.getItem('token')}`
                        }).then((res)=>{
                            if (res.status == 'OK'){
                                res.categories.map((cat)=>{
                                    setCats((old)=> [...old, {
                                        name: cat.name,
                                        value: cat.id
                                    }])
                                })
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
                            //clearInterval(x)
                        }).catch(()=>{
                            toast({
                                title: "Unexpected Error",
                                description: "Please try again later.",
                                status: 'error'
                            })
                            //clearInterval(x)
                        })
                        setLoading(true)

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
                    //clearInterval(x)
                    }).catch(()=>{
                    toast({
                        title: "Oops!",
                        description: "An unexpected error occured. Try again later.",
                        status: 'error'
                    })
                    //clearInterval(x)
                })
            }
            //}, 100)
        }
    }, [router.query.id])
    return(<>
    <AdminLayout callback={()=>{
        setLoaded(true)
    }} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}>
        {loading ? 
        <VStack height={'full'} justifyContent={'center'}>
            <Spinner color={useColorModeValue(`${config.accent}.500`, `${config.accent}.300`)}/>
        </VStack>
        :
        <>
        <Heading mt={'20px'}>Create Doc</Heading>
        <VStack py={'40px'} width={'full'}>
            <CustomInput value={title} onChange={(e)=> setTitle(e.target.value)} type={'input'} label={"Title"} description={"Title of your documentation"} />
            <CustomInput value={cat} onChange={setCat} type={'select'} label={"Category"} description={"Which category your documentation falls under"} values={cats} />
            <CustomInput value={content} onChange={setContent} type={'markdown'} label={"Category"} description={"Which category your documentation falls under"} values={cats} />
            <HStack width={'full'} mt={"20px !important"}>
                <Spacer/>
                <Button onClick={()=>{
                    setSubmitting(true)
                    const payload = {
                        title: title,
                        category: cat,
                        content: content
                    }
                    $.ajax({
                        url: `${vars.apiRoute}/admin/docs/edit?key=${creds.siteKey}&token=${localStorage.getItem('token')}&id=${router.query.id}`,
                        type: 'POST',
                        data: $.param(payload)
                    }).then((res)=>{
                        if (res.status == 'OK'){
                            setSubmitting(false)
                            toast({
                                title: "Success!",
                                description: "This article has been edited successfully!",
                                status: 'success'
                            })
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
                        setSubmitting(false)
                    }).catch(()=>{
                        setSubmitting(false)
                        toast({
                            title: "Unexpected Error",
                            description: "Please try again later.",
                            status: 'error'
                        })
                    })
                }} colorScheme={'blue'} isDisabled={submitting || (!title || !cat || !content)} leftIcon={<FaPaperPlane/>}>Submit</Button>
            </HStack>
        </VStack>
        </>
        }
    </AdminLayout>
    </>)
}