import { cloneElement, ReactElement, useState } from 'react'

import {
  Tooltip as ChakraTooltip,
  TooltipProps as ChakraTooltipProps
} from '@chakra-ui/react'

type TooltipProps = { children: ReactElement } & ChakraTooltipProps

export function Tooltip({ children, ...rest }: TooltipProps): JSX.Element {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <ChakraTooltip isOpen={isOpen} {...rest}>
      {cloneElement(children, {
        onMouseEnter: () => setIsOpen(true),
        onMouseLeave: () => setIsOpen(false),
        onClick: () => setIsOpen(!isOpen)
      })}
    </ChakraTooltip>
  )
}
