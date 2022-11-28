import styled, { css } from 'styled-components'

export const DropDownHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 7px 16px;
  border: none;
  border-radius: 16px;
  background: ${({ theme }) => theme.bg3};
  transition: border-radius 0.15s;
`

export const DropDownListContainer = styled.div`
  min-width: 160px;
  height: 0;
  position: absolute;
  overflow: hidden;
  background: ${({ theme }) => theme.bg3};
  z-index: 10;
  transition: transform 0.15s, opacity 0.15s;
  transform: scaleY(0);
  transform-origin: top;
  opacity: 0;

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
  min-width: 168px;
`};
`

export const DropDownContainer = styled.div<{ isOpen: boolean }>`
  cursor: pointer;
  position: relative;
  background: ${({ theme }) => theme.bg1};
  border: none;
  border-radius: 16px;
  min-width: 160px;
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

export const DropDownList = styled.ul`
  padding: 0;
  margin: 0;
  box-sizing: border-box;
  z-index: 10;
`

export const ListItem = styled.li`
  list-style: none;
  padding: 8px 16px;
  position: relative;
  &:hover {
    background: ${({ theme }) => theme.primary1};
  }
`
