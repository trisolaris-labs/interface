import React, { useRef } from 'react'
import { useState, useEffect } from 'react'
import styled, { css } from 'styled-components'
import { ChevronDown, Check } from 'lucide-react'
import { Text } from 'rebass'

import { useOnClickOutside } from '../../hooks/useOnClickOutside'
import { RowBetween } from '../Row'

const DropDownHeader = styled.div`
  width: 100%;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0px 16px;
  border: none;
  border-radius: 16px;
  background: ${({ theme }) => theme.bg3};
  transition: border-radius 0.15s;
`

const DropDownListContainer = styled.div`
  min-width: 136px;
  height: 0;
  position: absolute;
  overflow: hidden;
  background: ${({ theme }) => theme.bg3};
  z-index: 10;
  transition: transform 0.15s, opacity 0.15s;
  transform: scaleY(0);
  transform-origin: top;
  opacity: 0;
  width: 100%;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    min-width: 168px;
 `};
`

const DropDownContainer = styled.div<{ isOpen: boolean }>`
  cursor: pointer;
  width: 100%;
  position: relative;
  background: ${({ theme }) => theme.bg1};
  border: none;
  border-radius: 16px;
  height: 40px;
  min-width: 136px;
  user-select: none;
  z-index: 20;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    min-width: 168px;
 `};

  ${({ isOpen }) =>
    isOpen &&
    css`
      ${DropDownHeader} {
        border-bottom: 1px solid ${({ theme }) => theme.bg1};
        border-radius: 16px 16px 0 0;
      }

      ${DropDownListContainer} {
        height: auto;
        transform: scaleY(1);
        opacity: 1;
        border: none;
        border-top-width: 0;
        border-radius: 0 0 16px 16px;
      }
    `}

  svg {
    position: absolute;
    right: 16px;
    top: 50%;
    transform: translateY(-50%);
  }
`

const DropDownList = styled.ul`
  padding: 0;
  margin: 0;
  box-sizing: border-box;
  z-index: 10;
`

const ListItem = styled.li`
  list-style: none;
  padding: 8px 16px;
  position: relative;
  &:hover {
    background: ${({ theme }) => theme.primary1};
  }
`

type OptionProps = {
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
                {index === selectedOptionIndex && <Check />}
              </RowBetween>
            </ListItem>
          ))}
        </DropDownList>
      </DropDownListContainer>
    </DropDownContainer>
  )
}

export default Select
