import {
  useEffect,
  useRef,
  useState,
  useCallback,
  useImperativeHandle,
  forwardRef,
  ChangeEvent,
  MouseEvent,
  ForwardRefRenderFunction
} from 'react'
import {
  IoAlertCircleOutline,
  IoChevronDownOutline,
  IoCloseOutline
} from 'react-icons/io5'

import {
  FormControl,
  Input,
  Text,
  Flex,
  Button,
  theme,
  Divider,
  Icon,
  Tooltip,
  Center,
  IconButton,
  Spinner
} from '@chakra-ui/react'

export type Option = {
  value: string
  label: string
}

export type AsyncSelectHandles = {
  state: {
    inputValue: string
    inputIsFocused: boolean
    menuIsOpen: boolean
    isLoading: boolean
    onClearData: () => void
    onChange: (
      value: Option | null,
      event?: MouseEvent<HTMLButtonElement>
    ) => void
  }
  select: {
    state: {
      inputValue: string
      value: Option | null
    }
  }
}

type MessageObj = { inputValue: string }

export type AsyncSelectProps = {
  options?: Option[]
  defaultOptions?: Option[]
  isLoading?: boolean
  menuIsOpen?: boolean
  placement?: string
  isClearable?: boolean
  error?: string | null | undefined
  defaultSelectedValue?: Option
  onChange?: (value: Option | null) => void
  onFocus?: () => void
  onInputChange?: (event: ChangeEvent<HTMLInputElement>) => void
  noOptionsMessage?: (messageObj: MessageObj) => string | null
  loadingMessage?: (messageObj: MessageObj) => string | null
  loadOptions?: (inputValue: string) => Promise<Option[]>
}

let debounce: NodeJS.Timeout

const AsyncSelectRaw: ForwardRefRenderFunction<
  AsyncSelectHandles,
  AsyncSelectProps
> = (
  {
    isClearable = false,
    error = null,
    onFocus,
    defaultSelectedValue = null,
    defaultOptions = [],
    placement = 'Digite ...',
    noOptionsMessage = () => 'Nenhum item encontrado.',
    loadingMessage = () => 'Procurando items ...',
    ...props
  },
  ref
) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const [inputIsFocused, setInputIsFocused] = useState(false)
  const [menuIsOpen, setMenuIsOpen] = useState(props.menuIsOpen ?? false)
  const [inputValue, setInputValue] = useState('')
  const [selectedValue, setSelectedValue] = useState<Option | null>(
    defaultSelectedValue
  )
  const [isLoading, setIsLoading] = useState(false)
  const [options, setOptions] = useState<Option[]>(defaultOptions)
  const [isLabelOpen, setIsLabelOpen] = useState(false)

  const clearData = useCallback(() => {
    setInputIsFocused(false)
    setMenuIsOpen(false)
    setInputValue('')
    setOptions(defaultOptions)
    if (inputRef.current) {
      inputRef.current.value = ''
    }
  }, [defaultOptions])

  const handleChange = useCallback(
    (value: Option | null, event?: MouseEvent<HTMLButtonElement>) => {
      event?.stopPropagation()
      setSelectedValue(value)
      setMenuIsOpen(false)
      setInputIsFocused(false)
      setOptions(defaultOptions)
      inputRef.current?.blur()
      if (props.onChange) props.onChange(value)
    },
    [defaultOptions, props]
  )

  useEffect(() => {
    function handleClickOutside(event: globalThis.MouseEvent): void {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        clearData()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [clearData])

  useImperativeHandle(
    ref,
    (): AsyncSelectHandles => {
      return {
        state: {
          isLoading: props.isLoading ?? isLoading,
          menuIsOpen: props.menuIsOpen ?? menuIsOpen,
          inputIsFocused,
          inputValue,
          onClearData: clearData,
          onChange: handleChange
        },
        select: {
          state: {
            inputValue,
            value: selectedValue
          }
        }
      }
    },
    [
      clearData,
      handleChange,
      inputIsFocused,
      inputValue,
      isLoading,
      menuIsOpen,
      props.isLoading,
      props.menuIsOpen,
      selectedValue
    ]
  )

  async function handleLoadOptions(newValue = ''): Promise<void> {
    if (props.loadOptions) {
      try {
        setIsLoading(true)
        const options = await props.loadOptions(inputValue)
        setOptions(options)
      } finally {
        setIsLoading(false)
      }
    } else {
      clearTimeout(debounce)
      if (newValue.length >= 3) {
        setIsLoading(true)

        debounce = setTimeout(() => {
          const optionsToFilter = props.options ?? []
          const filteredOptions = optionsToFilter.filter(option =>
            option.label.toLowerCase().match(newValue.toLowerCase())
          )
          setOptions(filteredOptions)
          setIsLoading(false)
        }, 750)
      } else {
        setOptions(defaultOptions)
        setIsLoading(false)
      }
    }
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>): void {
    setInputValue(event.target.value)
    if (props.onInputChange) props.onInputChange(event)
    handleLoadOptions(event.target.value)
  }

  function handleClearable(): void {
    clearData()
    setSelectedValue(null)
  }

  function handleOpen(): void {
    setInputIsFocused(true)
    setMenuIsOpen(!menuIsOpen)
    inputRef.current?.focus()
    if (!inputIsFocused && onFocus) {
      onFocus()
    }
  }

  return (
    <FormControl
      ref={containerRef}
      isInvalid={!!error}
      position="relative"
      transitionDuration="0.2s"
      transitionProperty="border-color, box-shadow"
      border="1px"
      borderRadius="4"
      borderColor={error ? 'red.400' : inputIsFocused ? 'blue.300' : 'gray.200'}
      boxShadow={
        error
          ? `0px 0px 0px 1px ${theme.colors.red[400]}`
          : inputIsFocused
          ? `0px 0px 0px 1px ${theme.colors.blue[300]}`
          : 'none'
      }
      _focusWithin={{
        borderColor: 'blue.300',
        boxShadow: `0px 0px 0px 1px ${theme.colors.blue[300]}`
      }}
    >
      <Flex
        w="full"
        h="full"
        alignItems="center"
        flexWrap={['wrap', 'nowrap']}
        justifyContent="space-between"
      >
        <Flex w="full" maxH="42px" pl="10px" py="2" onClick={handleOpen}>
          {!inputIsFocused && !menuIsOpen && !selectedValue && (
            <Text userSelect="none" color="gray.400" isTruncated>
              {placement}
            </Text>
          )}
          {!!selectedValue && (!inputIsFocused || inputValue.length === 0) && (
            <Text userSelect="none" position="absolute" isTruncated>
              {selectedValue?.label}
            </Text>
          )}

          <Input
            ref={inputRef}
            onChange={handleInputChange}
            variant="unstyled"
            autoComplete="off"
            w={inputIsFocused ? '100%' : '1px'}
            opacity={inputIsFocused ? '1' : '0'}
          />
        </Flex>
        <Flex
          ml="auto"
          h="max-content"
          align="center"
          flexWrap={['wrap', 'nowrap']}
        >
          {(props.isLoading ?? isLoading) && (
            <Center w="38px" h="40px" py="6px" alignItems="center">
              <Spinner size="sm" color="gray.400" emptyColor="gray.200" />
            </Center>
          )}
          {selectedValue && isClearable && (
            <Flex h="40px" py="6px" alignItems="center">
              <Divider
                orientation="vertical"
                borderColor="gray.400"
                transitionDuration="0.2s"
                transitionProperty="color"
              />
              <IconButton
                onClick={handleClearable}
                icon={
                  <Icon
                    as={IoCloseOutline}
                    color="gray.400"
                    w="18px"
                    h="18px"
                    _hover={{
                      color: 'gray.500'
                    }}
                  />
                }
                _focus={{
                  boxShadow: `0px 0px 0px 2px ${theme.colors.blue[300]}`
                }}
                aria-label="Limpar input"
                variant="unstyled"
                h="40px"
                w="38px"
              />
            </Flex>
          )}
          {!!error && (
            <Flex h="40px" alignItems="center" py="6px">
              <Divider
                orientation="vertical"
                borderColor="gray.400"
                transitionDuration="0.2s"
                transitionProperty="color"
              />
              <Tooltip
                isOpen={isLabelOpen}
                hasArrow
                arrowSize={15}
                label={error}
                placement="top"
                aria-label="Error tooltip"
              >
                <IconButton
                  onMouseEnter={() => setIsLabelOpen(true)}
                  onMouseLeave={() => setIsLabelOpen(false)}
                  onClick={() => setIsLabelOpen(!isLabelOpen)}
                  icon={
                    <Icon
                      as={IoAlertCircleOutline}
                      color="gray.400"
                      w="18px"
                      h="18px"
                      _hover={{
                        color: 'gray.500'
                      }}
                    />
                  }
                  _focus={{
                    boxShadow: `0px 0px 0px 2px ${theme.colors.blue[300]}`
                  }}
                  aria-label="Limpar input"
                  variant="unstyled"
                  h="40px"
                  w="38px"
                />
              </Tooltip>
            </Flex>
          )}
          <Flex h="40px" alignItems="center" py="6px">
            <Divider
              orientation="vertical"
              borderColor="gray.400"
              transitionDuration="0.2s"
              transitionProperty="color"
              my="2"
            />
            <IconButton
              onClick={handleOpen}
              icon={
                <Icon
                  as={IoChevronDownOutline}
                  color="gray.400"
                  w="18px"
                  h="18px"
                  _hover={{
                    color: 'gray.500'
                  }}
                />
              }
              _focus={{
                boxShadow: `0px 0px 0px 2px ${theme.colors.blue[300]}`
              }}
              aria-label="Limpar input"
              variant="unstyled"
              h="40px"
              w="38px"
            />
          </Flex>
        </Flex>
      </Flex>

      {(props.menuIsOpen ?? menuIsOpen) && (
        <Flex
          onClick={() => {
            inputRef.current?.focus()
          }}
          w="100%"
          maxH="200px"
          p="2"
          mt="4"
          borderRadius="4"
          direction="column"
          boxShadow="0 0 0 1px hsl(0deg 0% 0% / 10%), 0 4px 11px hsl(0deg 0% 0% / 10%)"
          bg="white"
          gridGap="2"
          position="absolute"
          top="100%"
          left="0"
          overflowY="auto"
          zIndex="5"
        >
          <>
            {options.map(select => (
              <Button
                key={select.value}
                w="full"
                h="42px"
                minH="42px"
                d="flex"
                justifyContent="space-between"
                onClick={event => handleChange(select, event)}
              >
                {select.label}
              </Button>
            ))}

            <Text
              w="full"
              textAlign="center"
              color="gray.500"
              userSelect="none"
            >
              {props.isLoading ?? isLoading
                ? loadingMessage({ inputValue })
                : options.length === 0 && noOptionsMessage({ inputValue })}
            </Text>
          </>
        </Flex>
      )}
    </FormControl>
  )
}

export const AsyncSelect = forwardRef(AsyncSelectRaw)
