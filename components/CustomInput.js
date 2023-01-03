import { HStack, Text, VStack, Input, useToast, Button, Spacer, IconButton, useMediaQuery, useTabsContext, Tabs, TabList, Tab, TabPanels, TabPanel, Textarea, useColorModeValue } from "@chakra-ui/react";
import { MDXRemote } from "next-mdx-remote";
import { serialize } from 'next-mdx-remote/serialize'
import { useEffect, useState } from "react";
import { FaPlus, FaTimes } from "react-icons/fa";
import { config, vars } from "../config";
import Select from "./Select";
import Time from "./Time";



export default function CustomInput({label, description, type, value, onChange, values = [], multi, placeholder}){
    const [text, setText] = useState("")
    const [source, setSource] = useState(null)
    const [mobile] = useMediaQuery('(max-width: 800px)')
    const toast= useToast({
        position: 'bottom-left',
        isClosable: true
    })
    
    useEffect(()=>{
        if (type == 'markdown'){
            setText(value)
        }
    }, [value])

    useEffect(()=>{
        async function serial(){
            setSource(await serialize(text))
        }
        serial()
    }, [text])

    return <HStack flexDir={mobile ? 'column' : 'row'} p={'20px'} spacing={!mobile && '20px'} px={'20px'} rounded={'lg'} bg={useColorModeValue('gray.50', 'whiteAlpha.50')} width={'full'}>
        {type == "markdown" ? 
        <Tabs colorScheme={config.accent} minHeight={'300px'} width={'full'} variant='solid-rounded' isFitted>
            <TabList mb='1em'>
                <Tab>Content</Tab>
                <Tab>Preview</Tab>
            </TabList>
            <TabPanels height={'full'}>
                <TabPanel>
                    <Textarea variant={'filled'} height={"200px"} value={text} onChange={(e)=> {
                        if (onChange){
                            onChange(e.target.value)
                        } else {
                            setText(e.target.value)
                        }
                    }} />
                </TabPanel>
                <TabPanel className="md-wrapper">
                    {source && 
                    <MDXRemote components={Button} {...source}/>
                    }
                </TabPanel>
            </TabPanels>
        </Tabs>
        :
        <>
        <VStack mb={mobile && '20px'} spacing={mobile ? 0 : '0px'} flexDir={'column'} maxWidth={mobile ? 'full' : '200px'} minWidth={mobile ? 'full' : '200px'}>
            <Text width={'full'} ml={!mobile && '20px !important'} mr={!mobile && '20px !important'} fontWeight={'bold'}>{label}</Text>
            <Text width={'full'} fontSize={'sm'} fontWeight={'semibold'} color={useColorModeValue('blackAlpha.700', 'whiteAlpha.700')}>{description}</Text>
        </VStack>
        {type == "select" ? 
            <Select placeholder={placeholder} multi={multi} closeOnSelect={!multi} value={value} onChange={onChange} values={values}/>
        :
        type == 'input' ?
            <Input placeholder={placeholder} type='text' size={'lg'} _focus={{bg: 'whiteAlpha.100', borderColor: 'brand.500'}} variant={'filled'} value={value} onChange={onChange}/>
            : type == 'time' && 
            <Time value={value} onChange={onChange}/>
        }
        </>
    }
    </HStack>
}