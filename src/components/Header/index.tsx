/* eslint-disable react/jsx-no-undef */
import NextLink from 'next/link'

import {
  Flex,
  Img,
  Link,
  Button,
  Text,
  Popover,
  PopoverTrigger,
  PopoverArrow,
  PopoverContent,
  PopoverBody
} from '@chakra-ui/react'

export function Header(): JSX.Element {
  return (
    <Flex
      w="full"
      h="55px"
      bg="teal.300"
      px="4"
      align="center"
      justify="center"
    >
      <Flex w="full" h="full" maxW="1120px" py="3">
        <NextLink href="/home" passHref>
          <Link>
            <Img src="/logo.svg" alt="Logo" />
          </Link>
        </NextLink>
      </Flex>
      <Flex gridGap="4" align="center">
        <NextLink href="/about" passHref>
          <Link>Quem somos</Link>
        </NextLink>
        <NextLink href="/how-it-works" passHref>
          <Link>Como funciona</Link>
        </NextLink>
        <Popover>
          <PopoverTrigger>
            <Button type="button" h="35px" w="135px">
              Sou advogado
            </Button>
          </PopoverTrigger>
          <PopoverContent w="200px">
            <PopoverArrow />

            <PopoverBody>
              <Flex direction="column" align="center" gridGap="2">
                <NextLink href="/signin" passHref>
                  <Link>Já sou cadastrado</Link>
                </NextLink>
                <Text as="span">ou</Text>
                <NextLink href="/signup" passHref>
                  <Link
                    px="4"
                    py="2"
                    borderRadius="4"
                    bg="gray.100"
                    transitionProperty="background-color"
                    _hover={{ bg: 'gray.200' }}
                  >
                    Inscrever-se
                  </Link>
                </NextLink>
              </Flex>
            </PopoverBody>
          </PopoverContent>
        </Popover>
      </Flex>
    </Flex>
  )
}
