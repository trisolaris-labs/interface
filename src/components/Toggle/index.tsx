import React from 'react'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import { darken } from 'polished'

const ToggleElement = styled.span<{ isActive?: boolean; isOnSwitch?: boolean; fontSize?: string }>`
  padding: 0.25rem 0.5rem;
  border-radius: 14px;
  color: ${({ theme, isActive, isOnSwitch }) => (isActive ? (isOnSwitch ? theme.white : theme.text2) : theme.text3)};
  font-size: 1rem;
  font-weight: 400;

  padding: 0.35rem 0.6rem;
  border-radius: 12px;
  color: ${({ theme, isActive, isOnSwitch }) => (isActive ? (isOnSwitch ? theme.white : theme.text2) : theme.text2)};
  font-size: ${({ fontSize }) => (fontSize ? fontSize : '1rem')};
  font-weight: ${({ isOnSwitch }) => (isOnSwitch ? '500' : '400')};


  position:relative;
  :hover {
    user-select: ${({ isOnSwitch }) => (isOnSwitch ? 'none' : 'initial')};
  }

`

const StyledToggle = styled.button<{ isActive?: boolean; activeElement?: boolean }>`
  border-radius: 12px;
  border: none;
  background: ${({ theme }) => theme.bg3};
  display: flex;
  width: fit-content;
  cursor: pointer;
  outline: none;
  padding: 0;

  position: relative;
  &:before {
    transition: 0.3s;
    content: '';
    display: block;
    width: 50%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    background: ${({ theme }) => theme.primary1};
    left: ${({ isActive }) => (isActive ? 0 : '50%')};
    border-radius: 14px;
  }
`

export interface ToggleProps {
  id?: string
  isActive: boolean
  toggle: () => void
  customToggleText?: { on: string; off: string }
  fontSize?: string
}

export default function Toggle({ id, isActive, toggle, customToggleText, fontSize, ...otherProps }: ToggleProps) {
  const { t } = useTranslation()
  return (
    <StyledToggle id={id} isActive={isActive} onClick={toggle} {...otherProps}>
      <ToggleElement isActive={isActive} isOnSwitch={true} fontSize={fontSize}>
        {customToggleText?.on ?? t('toggle.on')}
      </ToggleElement>
      <ToggleElement isActive={!isActive} isOnSwitch={false} fontSize={fontSize}>
        {customToggleText?.off ?? t('toggle.off')}
      </ToggleElement>
    </StyledToggle>
  )
}
