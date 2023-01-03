import { HStack, Input, Spacer, Text } from "@chakra-ui/react";
import { SYMBOL_CLEARED_COOKIES } from "next/dist/server/api-utils";
import { useEffect, useState } from "react";

export default function Time({value, onChange}){
    const [days, setDays] = useState(0)
    const [hours, setHours] = useState(0)
    const [minutes, setMinutes] = useState(0)
    const [seconds, setSeconds] = useState(0)

    useEffect(()=>{
        if (onChange){
            const units = [3600 * 24, 3600, 60, 1]
            var totaltime = 0
            totaltime += days * units[0]
            totaltime += hours * units[1]
            totaltime += minutes * units[2]
            totaltime += seconds * units[3]
            onChange(totaltime)
        }
    }, [minutes, seconds, days, hours])

    return(<>
    <HStack width={'full'} px={'15px'} py={'12px'} bg={'whiteAlpha.50'} cursor={'pointer'} rounded={'md'}>
        <Spacer/>
        <HStack>
            <Input _focus={{bg: 'whiteAlpha.100', borderColor: 'brand.500'}} variant={'filled'} textAlign={'center'} size={'sm'} rounded={'md'} width={'50px'} px={0} py={0} p={'10px'} value={days} onChange={(e)=> e.target.value.length < 4 && setDays(e.target.value)} type={'number'}/>
            <Text fontWeight={'semibold'}>Days</Text>
        </HStack>
        <Spacer/>
        <HStack>
            <Input _focus={{bg: 'whiteAlpha.100', borderColor: 'brand.500'}} variant={'filled'} textAlign={'center'} size={'sm'} rounded={'md'} width={'50px'} px={0} py={0} p={'10px'} value={hours} onChange={(e)=> e.target.value.length < 4 && setHours(e.target.value)} type={'number'}/>
            <Text fontWeight={'semibold'}>Hours</Text>
        </HStack>
        <Spacer/>
        <HStack>
            <Input _focus={{bg: 'whiteAlpha.100', borderColor: 'brand.500'}} variant={'filled'} textAlign={'center'} size={'sm'} rounded={'md'} width={'50px'} px={0} py={0} p={'10px'} value={minutes} onChange={(e)=> e.target.value.length < 4 && setMinutes(e.target.value)} type={'number'}/>
            <Text fontWeight={'semibold'}>Minutes</Text>
        </HStack>
        <Spacer/>
        <HStack>
            <Input _focus={{bg: 'whiteAlpha.100', borderColor: 'brand.500'}} variant={'filled'} textAlign={'center'} size={'sm'} rounded={'md'} width={'50px'} px={0} py={0} p={'10px'} value={seconds} onChange={(e)=> e.target.value.length < 4 && setSeconds(e.target.value)} type={'number'}/>
            <Text fontWeight={'semibold'}>Seconds</Text>
        </HStack>
        <Spacer/>
    </HStack>
    </>)
}