import React from 'react'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import { darken } from 'polished'

const ToggleElement = styled.span<{ isActive?: boolean; isOnSwitch?: boolean; fontSize?: string; padding?: string }>`
  padding: 0.25rem 0.5rem;
  border-radius: 14px;
  background: ${({ theme, isActive, isOnSwitch }) => (isActive ? (isOnSwitch ? theme.primary1 : theme.text4) : 'none')};
  color: ${({ theme, isActive, isOnSwitch }) => (isActive ? (isOnSwitch ? theme.white : theme.text2) : theme.text3)};
  font-size: 1rem;
  font-weight: 400;

  padding: ${({ padding }) => padding ?? '0.35rem 0.6rem'};
  border-radius: 12px;
  background: ${({ theme, isActive }) => (isActive ? theme.primary1 : 'none')};
  color: ${({ theme, isActive, isOnSwitch }) => (isActive ? (isOnSwitch ? theme.white : theme.text2) : theme.text2)};
  font-size: ${({ fontSize }) => (fontSize ? fontSize : '1rem')};
  font-weight: ${({ isOnSwitch }) => (isOnSwitch ? '500' : '400')};
  :hover {
    user-select: ${({ isOnSwitch }) => (isOnSwitch ? 'none' : 'initial')};
    background: ${({ theme, isActive }) => (isActive ? darken(0.12, theme.primary1) : 'none')};
    color: ${({ theme }) => theme.text3};
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
`

export interface ToggleProps {
  id?: string
  isActive: boolean
  toggle: () => void
  customToggleText?: { on: string; off: string }
  fontSize?: string
  padding?: string
  stopPropagation?: boolean
}

export default function Toggle({
  id,
  isActive,
  toggle,
  customToggleText,
  fontSize,
  padding,
  stopPropagation,
  ...otherProps
}: ToggleProps) {
  const { t } = useTranslation()
  return (
    <StyledToggle
      id={id}
      isActive={isActive}
      onClick={(e: React.MouseEvent) => {
        stopPropagation && e.stopPropagation()
        toggle()
      }}
      {...otherProps}
    >
      <ToggleElement isActive={isActive} isOnSwitch={true} fontSize={fontSize} padding={padding}>
        {customToggleText?.on ?? t('toggle.on')}
      </ToggleElement>
      <ToggleElement isActive={!isActive} isOnSwitch={false} fontSize={fontSize} padding={padding}>
        {customToggleText?.off ?? t('toggle.off')}
      </ToggleElement>
    </StyledToggle>
  )
}
