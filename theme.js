import { createMultiStyleConfigHelpers, extendTheme } from "@chakra-ui/react"


const modalHelpers = createMultiStyleConfigHelpers(['modal'])

const Modal = modalHelpers.defineMultiStyleConfig({
    baseStyle: (props)=> ({
      header: {
        bg: props.colorMode == 'dark' ? 'zinc.900' : 'white',
        roundedTop: "md"
      },
      footer: {
        bg: props.colorMode == 'dark' ? 'zinc.900' : 'white',
        roundedBottom: 'md',
      },
      body: {
        bg: props.colorMode == 'dark' ? 'zinc.900' : 'white'
      }
    }),
    defaultProps: {
      
    },
  })


const theme = extendTheme({
    styles: {
      global: (props) => ({
        body: {
          bg: props.colorMode == 'dark' ? 'black' : 'gray.50'
        }
      })
    },
    components: {
        Modal,
    },
    colors: {
      zinc: {
        50: "#fafafa",
        100: "#f4f4f5",
        200: "#e4e4e7",
        300: "#d4d4d8",
        400: "#a1a1aa",
        500: "#71717a",
        600: "#52525b",
        700: "#3f3f46",
        800: "#27272a",
        900: "#18181b"
      }
    }
  })

export {theme}