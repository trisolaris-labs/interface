import styled, { css } from 'styled-components'
import { ApplicationModal } from '../../state/application/actions'
import { useModalOpen, useToggleNetworkSelectModal, useToggleTriPriceModal } from '../../state/application/hooks'
import Modal from '../Modal'
import { ReactComponent as Close } from '../../assets/images/x.svg'
import AuroraIcon from '../../assets/images/aurora.png'
import TurboIcon from '../../assets/images/turbo.png'
import { ExternalLink, TYPE } from '../../theme'
import { isMobile } from 'react-device-detect'
import React, { useCallback } from 'react'
import Option from '../WalletModal/Option'
import { TURBO } from '../../constants/chains'
import { ChainId } from '@trisolaris/sdk'
import { useActiveWeb3React } from '../../hooks'

const CloseIcon = styled.div`
  position: absolute;
  right: 1rem;
  top: 14px;
  &:hover {
    cursor: pointer;
    opacity: 0.6;
  }
`

const CloseColor = styled(Close)`
  path {
    stroke: ${({ theme }) => theme.text4};
  }
`

const Wrapper = styled.div`
  ${({ theme }) => theme.flexColumnNoWrap}
  margin: 0;
  padding: 0;
  width: 100%;
`

const HeaderRow = styled.div`
  ${({ theme }) => theme.flexRowNoWrap};
  padding: 1rem 1rem;
  font-weight: 500;
  color: ${props => (props.color === 'blue' ? ({ theme }) => theme.primary1 : 'inherit')};
  ${({ theme }) => theme.mediaWidth.upToMedium`
    padding: 1rem;
  `};
`

const ContentWrapper = styled.div<{ mobile: boolean }>`
  background-color: ${({ theme }) => theme.bg2};
  padding: 2rem;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;

  ${({ theme }) => theme.mediaWidth.upToMedium`padding: 1rem`};

  ${({ theme, mobile }) => theme.mediaWidth.upToSmall`
      width:  85vw;
      ${mobile &&
        css`
          width: 100vw;
          border-bottom-left-radius: 0;
          border-bottom-right-radius: 0;
        `}
    `}
`

const UpperSection = styled.div`
  position: relative;

  h5 {
    margin: 0;
    margin-bottom: 0.5rem;
    font-size: 1rem;
    font-weight: 400;
  }

  h5:last-child {
    margin-bottom: 0px;
  }

  h4 {
    margin-top: 0;
    font-weight: 500;
  }
`

const Link = styled(ExternalLink)`
  text-decoration: none;

  &:hover,
  &:active,
  &:focus {
    text-decoration: none;
  }
`

const IconWrapper = styled.div<{ size?: number }>`
  ${({ theme }) => theme.flexColumnNoWrap};
  align-items: center;
  justify-content: center;
  & > * {
    height: ${({ size }) => (size ? size + 'px' : '32px')};
    width: ${({ size }) => (size ? size + 'px' : '32px')};
  }
`

const OptionGrid = styled.div`
  display: grid;
  grid-gap: 10px;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    grid-template-columns: 1fr;
    grid-gap: 10px;
  `};
`

export default function NetworkSelectModal() {
  const isModalOpen = useModalOpen(ApplicationModal.NETWORK_SELECT)
  const toggleWalletModal = useToggleNetworkSelectModal()
  const { appSelectedChain, setSelectedChain } = useActiveWeb3React()

  const changeNetwork = useCallback(
    async (chainId: number) => {
      if (appSelectedChain !== chainId) {
        setSelectedChain(chainId.toString())
      }
    },
    [appSelectedChain, setSelectedChain]
  )

  return (
    <Modal isOpen={isModalOpen} onDismiss={toggleWalletModal} minHeight={false} maxHeight={90}>
      <Wrapper>
        <UpperSection>
          <CloseIcon onClick={toggleWalletModal}>
            <CloseColor />
          </CloseIcon>
          <HeaderRow>Network</HeaderRow>
          <ContentWrapper mobile={isMobile}>
            <OptionGrid data-cy="option-grid">
              <Option
                active={appSelectedChain === ChainId.AURORA}
                id={`connect-${ChainId.AURORA}`}
                key={ChainId.AURORA}
                color={'#E8831D'}
                header={'Aurora'}
                subheader={null}
                icon={AuroraIcon}
                onClick={() => changeNetwork(ChainId.AURORA)}
              />
              <Option
                active={appSelectedChain === TURBO}
                id={`chain-${TURBO}`}
                key={TURBO}
                color={'#E8831D'}
                header={'Turbo'}
                subheader={null}
                icon={TurboIcon}
                onClick={() => changeNetwork(TURBO)}
              />
            </OptionGrid>
          </ContentWrapper>
        </UpperSection>
      </Wrapper>
    </Modal>
  )
}
