import { useRef } from 'react'

import { Box, Button, Flex } from '@chakra-ui/react'
import { FormHandles, SubmitHandler } from '@unform/core'

import { SearchSelect } from '../components/Form/AsyncSelect'
import { Form } from '../components/Form/Form'
import { Header } from '../components/Header'

export default function Home(): JSX.Element {
  const formRef = useRef<FormHandles>(null)

  const handleSubmit: SubmitHandler<unknown> = async data => {
    console.log(data)
  }

  return (
    <>
      <Header />
      <Flex w="full" h="100vh" bg="gray.400" p="4">
        <Form
          ref={formRef}
          onSubmit={handleSubmit}
          w="800px"
          mx="auto"
          p="6"
          borderRadius="4"
          mb="80px"
          bg="white"
          d="flex"
          flexDirection="column"
          gridGap="4"
        >
          <SearchSelect
            name="name"
            url={`${process.env.NEXT_PUBLIC_URL}/api/home-select`}
          />
          <Button type="submit">teste</Button>
        </Form>
      </Flex>
    </>
  )
}
