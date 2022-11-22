import React, { useRef } from 'react'
import { useState, useEffect } from 'react'

import { ChevronDown, Check } from 'lucide-react'
import { Text } from 'rebass'

import { useOnClickOutside } from '../../hooks/useOnClickOutside'
import { RowBetween } from '../Row'

import { DropDownHeader, DropDownListContainer, DropDownContainer, DropDownList, ListItem } from './Select.styles'

export type OptionProps = {
  label: string
  value: any
}

type SelectProps = {
  options: OptionProps[]
  onOptionChange?: (option: OptionProps) => void
  placeHolderText?: string
  defaultOptionIndex?: number
  className?: string
}

const Select: React.FunctionComponent<React.PropsWithChildren<SelectProps>> = ({
  options,
  onOptionChange,
  defaultOptionIndex = 0,
  placeHolderText,
  className
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [optionSelected, setOptionSelected] = useState(false)
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(defaultOptionIndex)

  const node = useRef<HTMLDivElement>()
  useOnClickOutside(node, isOpen ? () => setIsOpen(false) : undefined)

  const toggling = (event: React.MouseEvent<HTMLDivElement>) => {
    setIsOpen(!isOpen)
    event.stopPropagation()
  }

  const onOptionClicked = (selectedIndex: number) => () => {
    setSelectedOptionIndex(selectedIndex)
    setIsOpen(false)
    setOptionSelected(true)

    if (onOptionChange) {
      onOptionChange(options[selectedIndex])
    }
  }

  useEffect(() => {
    if (defaultOptionIndex) {
      setSelectedOptionIndex(defaultOptionIndex - 1)
      setOptionSelected(true)
    }
  }, [defaultOptionIndex])

  return (
    <DropDownContainer isOpen={isOpen} className={className} ref={node as any}>
      <DropDownHeader onClick={toggling}>
        <Text color={!optionSelected && placeHolderText ? 'text' : undefined}>
          {!optionSelected && placeHolderText ? placeHolderText : options[selectedOptionIndex].label}
        </Text>
      </DropDownHeader>
      <div onClick={toggling}>
        <ChevronDown />
      </div>
      <DropDownListContainer>
        <DropDownList>
          {options.map((option, index) => (
            <ListItem onClick={onOptionClicked(index)} key={option.label}>
              <RowBetween>
                <Text>{option.label}</Text>
                {index === selectedOptionIndex && <Check size={16} />}
              </RowBetween>
            </ListItem>
          ))}
        </DropDownList>
      </DropDownListContainer>
    </DropDownContainer>
  )
}

export default Select
