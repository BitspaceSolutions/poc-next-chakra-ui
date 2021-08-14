import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { useRef } from 'react'
import * as yup from 'yup'

import {
  Button,
  Center,
  Grid,
  Heading,
  Img,
  Link,
  Text
} from '@chakra-ui/react'
import { FormHandles, SubmitHandler } from '@unform/core'

import { Form } from '../components/Form/Form'
import { Input } from '../components/Form/Input'
import { formatYupError } from '../utils/formatYupError'

type FormData = {
  email: string
  password: string
}

const loginFormSchema = yup.object({
  email: yup.string().email('E-mail Inválido').required('E-mail é obrigatório'),
  password: yup.string().required('Senha é obrigatória')
})

export default function Login(): JSX.Element {
  const formRef = useRef<FormHandles>(null)
  const router = useRouter()

  const handleSubmit: SubmitHandler<FormData> = async data => {
    try {
      await loginFormSchema.validate(data, { abortEarly: false })
      router.push('/home')
    } catch (error) {
      formRef.current?.setErrors(formatYupError(error))
    }
  }

  return (
    <Grid w="full" h="full" gridTemplateColumns="1fr 1fr">
      <Img
        src="https://www.3mind.com.br/blog/wp-content/uploads/2021/02/melhores-advogados-do-brasil-dicas-para-se-destacar-no-mercado.jpg"
        alt="advogados"
        w="full"
        h="100vh"
        objectFit="cover"
      />
      <Center d="flex" flexDirection="column" w="full" h="full" bg="teal.200">
        <Form
          ref={formRef}
          onSubmit={handleSubmit}
          d="flex"
          alignItems="center"
          flexDirection="column"
          w="full"
          maxW="400"
          p="8"
          bg="white"
          borderRadius="4"
        >
          <Heading as="strong" fontSize="xl" mb="4">
            Acessar conta
          </Heading>
          <Input name="email" placeholder="E-mail" mb="4" />
          <Input name="password" placeholder="Senha" type="password" mb="2" />
          <NextLink href="forgot" passHref>
            <Link ml="auto">Esqueci minha senha.</Link>
          </NextLink>
          <Button type="submit" colorScheme="teal" w="full" h="48px" mt="4">
            Entrar
          </Button>
        </Form>
        <Text mt="8" textAlign="center">
          Ainda não possui uma conta?
          <NextLink href="signup" passHref>
            <Link d="block">Cadastre-se</Link>
          </NextLink>
        </Text>
      </Center>
    </Grid>
  )
}
