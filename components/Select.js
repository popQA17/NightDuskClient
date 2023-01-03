import { Box, HStack, Icon, Spacer, Text, useColorModeValue, VStack } from "@chakra-ui/react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FaChevronDown, FaTimes } from "react-icons/fa";
import { config } from "../config.js";
import useOuterClick from "./useOuterClick.js";

export default function Select({values, multi, onChange=null, value, closeOnSelect = true}){
    const [isOpen, setIsOpen] = useState(false)
    const [selected, setSelected] = useState(value)
    const innerRef = useOuterClick(ev => {setIsOpen(false)});
    useEffect(()=>{
        console.log(values)
    }, [])
    useEffect(()=>{
        if (value) {
            setSelected(value)
        }
    }, [value])
    useEffect(()=>{
            console.log(selected)
            //setSelected(value)
            if (onChange){
                onChange(selected)
            }
    }, [selected])
    return(<>
    <VStack w={'100%'} position={'relative'} ref={innerRef}>
        <HStack cursor={'pointer'} zIndex={'1'} onClick={()=> setIsOpen(!isOpen)} w={'full'} color={useColorModeValue('black','white')}  background={useColorModeValue('gray.100', 'whiteAlpha.50')} _hover={{background: useColorModeValue('gray.200', 'whiteAlpha.100')}} _focus={{background: 'whiteAlpha.100', color: 'brand.400'}} variant={'filled'} px={'15px'} py={'12px'} rounded={'md'}>
            <HStack zIndex={'0'} overflow={'auto'} width={'full'}>
            {values && multi ? 
            values.map((val)=>{
                if (selected && selected.includes(val.value)){
                    return <HStack padding={'2px'} fontSize={'sm'} rounded={'md'} px={'5px'} bg={'whiteAlpha.100'}>
                        <Text whiteSpace={'nowrap'}>{val.name}</Text>
                        <Spacer/>
                        <VStack onClick={()=>{
                            setSelected((old)=> old.filter((older)=> older != val.value))
                        }} justifyContent={'center'} padding={'3px'} _hover={{bg: 'brand.500'}} rounded={'full'}>
                            <Icon as={FaTimes} rounded={'full'}/>
                        </VStack>
                    </HStack>
                }
            })
            :
            <Text>
                {
                values.filter((old)=> old.value == selected)[0]?.name
                }
            </Text>
            }
            </HStack>
            <Spacer/>
            <Icon color={useColorModeValue('black', 'white')} as={FaChevronDown}  fontSize={'lg'}/>
        </HStack>
        <AnimatePresence>
        {isOpen &&<motion.div transition={{duration: 0.1}} style={{position: 'absolute', top: '50px', width: '100%', zIndex: '3'}} initial={{opacity: 0, y: -10, scale: 0.7}} exit={{opacity: 0, scale: 0.95, y: -10}} animate={{opacity: 1, y: 0, scale: 1}}>
        <VStack maxH={'200px'} overflow={'auto'} bg={useColorModeValue('gray.100', 'whiteAlpha.100')} backdropFilter={'blur(10px)'} p={'5px'} color={useColorModeValue('black', '#fff')}  w={'100%'} rounded={'md'}>
            {values.map((option) => {
            return <Box cursor={'pointer'} onClick={()=> {
                if (multi){
                    if (selected.includes(option.value)){
                        setSelected((old)=> old.filter((older)=> older != option.value))
                    } else {
                        setSelected((old)=> [...old,  option.value])
                    }
                } else {
                    setSelected(option.value)
                }
                if (closeOnSelect){
                    setIsOpen(false)
                }
            }} color={(multi ? selected.includes(option.value) : option.value == selected) && 'white'} bg={(multi ? selected.includes(option.value) : option.value == selected) && `${config.accent}.500 !important`} px={'10px'} fontSize={'16px'} py={'10px'} w={'100%'} _hover={{bg: 'whiteAlpha.100'}} rounded={'md'}>
                <motion.div transition={{duration: 0.5, type: 'spring'}} initial={{opacity: 0, y: 100}} animate={{y: 0, opacity : 1}}><Text>{option.name}</Text></motion.div>
            </Box>
            })}
        </VStack>
        </motion.div>
        }
        </AnimatePresence>
    </VStack>
    </>)
}