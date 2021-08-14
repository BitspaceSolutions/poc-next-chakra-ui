import axios from 'axios'
import { useRef, useEffect } from 'react'
import { OptionTypeBase } from 'react-select'
import AsyncSelect, { Props as AsyncProps } from 'react-select/async'

import theme from '@chakra-ui/theme'
import { useField } from '@unform/core'

type Option = {
  value: string
  label: string
}

interface SelectProps extends AsyncProps<Option, boolean> {
  name: string
  url: string
}

let debounce: NodeJS.Timeout
export function Select({ name, url, ...rest }: SelectProps): JSX.Element {
  const selectRef = useRef(null)
  const { fieldName, defaultValue, registerField, error } = useField(name)

  async function loadData(value: string): Promise<Option[]> {
    const { data } = await axios.get(url, {
      params: {
        query: value
      }
    })
    return data
  }

  async function handleLoadData(inputValue: string): Promise<Option[]> {
    return new Promise(resolve => {
      if (inputValue.length >= 3) {
        clearTimeout(debounce)
        debounce = setTimeout(
          async () => resolve(await loadData(inputValue)),
          750
        )
      } else {
        clearTimeout(debounce)
      }
    })
  }

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: selectRef.current,
      getValue: ref => {
        console.log(ref)
        if (rest.isMulti) {
          if (!ref.select.state.value) {
            return []
          }
          return ref.select.state.value.map(
            (option: OptionTypeBase) => option.value
          )
        }
        if (!ref.select.state.value) {
          return ''
        }
        return ref.select.state.value.value
      }
    })
  }, [fieldName, registerField, rest.isMulti])

  return (
    <AsyncSelect
      instanceId={name}
      defaultValue={defaultValue}
      ref={selectRef}
      classNamePrefix="react-select"
      placeholder=""
      loadOptions={handleLoadData}
      styles={{
        control: base => ({
          ...base,
          alignItems: 'start',
          borderColor: error ? theme.colors.red['500'] : base.borderColor,
          boxShadow: error
            ? `0 0 0 1px ${theme.colors.red['500']}`
            : base.boxShadow,
          '&:hover': {
            boxShadow: error
              ? `0 0 0 1px ${theme.colors.red['500']}`
              : base.boxShadow
          },
          '&:focus-within': {
            borderColor: theme.colors.teal['500'],
            boxShadow: `0 0 0 1px ${theme.colors.teal['500']}`
          }
        })
        // valueContainer: base => ({ ...base }),
        // indicatorsContainer: base => ({ ...base, alignItems: 'start' })
      }}
      theme={base => ({
        ...base,
        colors: {
          ...base.colors,
          primary: theme.colors.teal['500'],
          neutral10: theme.colors.teal['500'],
          dangerLight: theme.colors.teal['600'],
          danger: theme.colors.white
        }
      })}
      noOptionsMessage={() => 'Sem opções'}
      loadingMessage={() => 'Buscando opções...'}
      {...rest}
    />
  )
}
