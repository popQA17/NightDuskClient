import { Button, FormControl, FormLabel, Heading, Input, Spacer, useColorModeValue, useToast, VStack } from "@chakra-ui/react";
import { useState } from "react";
import { config, creds, vars } from "../config";
import $ from 'jquery'
import { useRouter } from "next/router";
export default function Login(){
    const [value, setValue] = useState("")
    const [loading, setLoading] = useState(false)
    const toast = useToast({
        position: 'bottom-left',
        isClosable: true
    })
    const router = useRouter()
    return(<>
    <VStack height={'100vh'} px={'10px'} justifyContent={"center"} width={'full'}>
        <VStack py={'30px'} rounded={'lg'} height={"300px"} bg={useColorModeValue('white', 'zinc.900')} maxWidth={'500px'} px={'50px'} width={'full'}>
            <Heading>Admin Panel</Heading>
            <Spacer/>
            <FormControl>
                <FormLabel>Password</FormLabel>
                <Input value={value} onChange={(e)=> setValue(e.target.value)} variant={'filled'} type={'password'} isRequired/>
            </FormControl>
            <Spacer/>
            <Button onClick={()=>{
                setLoading(true)
                $.ajax({
                    url: `${vars.apiRoute}/projects/login?key=${creds.siteKey}&password=${value}`
                }).then((res)=>{
                    setLoading(false)
                    if (res.status == 'INVALID'){
                        toast({
                            title: "Invalid Password",
                            description: "That password is incorrect.",
                            status: 'error'
                        })
                    } else if (res.status == "OK"){
                        router.push('/admin')
                        localStorage.setItem("token", res.token)
                    }
                }).catch(()=>{
                    setLoading(false)
                    toast({
                        title: "Oops!",
                        description: "An unexpected error occured. Please try again later.",
                        status: 'error'
                    })
                })
            }} isDisabled={!value} isLoading={loading} colorScheme={value ? config.accent : "gray"} width={'full'}>Login</Button>
        </VStack>
    </VStack>
    </>)
}