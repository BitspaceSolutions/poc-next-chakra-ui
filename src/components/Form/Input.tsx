import { useEffect, useRef } from 'react'
import { IoAlertCircleOutline } from 'react-icons/io5'

import {
  InputProps as ChakraInputProps,
  Input as ChakraInput,
  theme,
  InputGroup,
  Tooltip,
  Box,
  IconButton,
  Icon,
  InputRightElement
} from '@chakra-ui/react'
import { useField } from '@unform/core'

type InputProps = ChakraInputProps & {
  name: string
}

export function Input({ name, ...rest }: InputProps): JSX.Element {
  const inputRef = useRef<HTMLInputElement>(null)
  const { defaultValue, error, fieldName, registerField } = useField(name)

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputRef.current,
      path: 'value'
    })
  }, [fieldName, registerField])

  return (
    <InputGroup>
      <ChakraInput
        ref={inputRef}
        defaultValue={defaultValue}
        isInvalid={!!error}
        colorScheme="teal"
        _focus={{
          boxShadow: `0 0 0 1px ${theme.colors.teal['300']}`,
          borderColor: 'teal.300'
        }}
        {...rest}
      />
      {!!error && (
        <InputRightElement>
          <Tooltip
            hasArrow
            arrowSize={15}
            label={error}
            px="2"
            py="1"
            placement="top-end"
            aria-label="Error tooltip"
          >
            <Box as="span">
              <IconButton
                d="flex"
                icon={<Icon as={IoAlertCircleOutline} />}
                fontSize="22"
                variant="unstyled"
                aria-label="Open error message"
                color="red.500"
              />
            </Box>
          </Tooltip>
        </InputRightElement>
      )}
    </InputGroup>
  )
}
