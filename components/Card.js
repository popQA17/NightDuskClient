import { Button, HStack, Icon, Skeleton, Spacer, Text, useColorModeValue, VStack } from "@chakra-ui/react"
import { FaChevronRight } from "react-icons/fa"

export default function Card(props){
    const {title, link, children, loading, ...others} = props
    return(<>
    <VStack as={loading && Skeleton} width={'full'} height={'400px'} {...others} overflow={'hidden'}  bg={useColorModeValue('gray.50', 'black')} rounded={'lg'}>
        <HStack px={'15px'} py={'5px'} bg={useColorModeValue('gray.100', 'zinc.800')} width={'full'}>
            <Text  color={useColorModeValue('blackAlpha.800', 'whiteAlpha.800')} fontWeight={'semibold'}>{title}</Text>
        </HStack>
        {children}
        <Spacer/>
        {link && 
        <HStack justifyContent={'center'} width={'full'} height={'40px'} borderTop={'1px'}  borderColor={useColorModeValue('gray.200', 'zinc.800')}>
            <Button variant={'link'} fontSize={'sm'} color={useColorModeValue("blackAlpha.700", 'whiteAlpha.700')} rightIcon={<Icon as={FaChevronRight} />}>See More</Button>
        </HStack>
        }
    </VStack>
    </>)
}