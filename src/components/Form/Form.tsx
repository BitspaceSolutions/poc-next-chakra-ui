import { chakra } from '@chakra-ui/react'
import { ChakraComponent } from '@chakra-ui/react'
import { FormHandles, FormProps as UnformFormProps } from '@unform/core'
import { Form as UnformForm } from '@unform/web'

type FormProps = Omit<UnformFormProps, 'ref'> & {
  ref?: React.RefObject<FormHandles>
}

type FormComponent = ChakraComponent<'form', FormProps>

export const Form = chakra(UnformForm, {}) as FormComponent
