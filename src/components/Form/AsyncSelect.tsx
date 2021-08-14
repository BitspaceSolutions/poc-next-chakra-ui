import axios from 'axios'
import { useEffect, useRef } from 'react'

import { useField } from '@unform/core'

import {
  AsyncSelect,
  AsyncSelectHandles,
  AsyncSelectProps,
  Option
} from '../AsyncSelect'

type SearchSelectProps = AsyncSelectProps & {
  name: string
  url: string
}

let debounce: NodeJS.Timeout

export function SearchSelect({
  name,
  url,
  ...rest
}: SearchSelectProps): JSX.Element {
  const inputRef = useRef<AsyncSelectHandles>(null)
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
      ref: inputRef.current,
      getValue: (ref: AsyncSelectHandles) => ref.select.state.value,
      setValue: (ref: AsyncSelectHandles, value: Option | null) =>
        ref.state.onChange(value),
      clearValue: (ref: AsyncSelectHandles) => ref.state.onClearData()
    })
  }, [fieldName, registerField])

  return (
    <AsyncSelect
      ref={inputRef}
      defaultSelectedValue={defaultValue}
      error={error}
      loadOptions={handleLoadData}
      {...rest}
    />
  )
}
