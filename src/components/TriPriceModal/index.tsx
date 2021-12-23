import styled, { css } from 'styled-components';
import { ChainId } from '@trisolaris/sdk';
import { TRI } from '../../constants';
import { ApplicationModal } from '../../state/application/actions';
import { useModalOpen, useToggleTriPriceModal } from '../../state/application/hooks';
import Modal from '../Modal';
import { ReactComponent as Close } from '../../assets/images/x.svg'
import { ExternalLink, TYPE } from '../../theme'
import { isMobile } from 'react-device-detect'
import React from 'react'
import { AutoRow } from '../Row';
import { AutoColumn } from '../Column';
import useTriPrice from '../../hooks/useTriPrice';
import CirculatingSupplyMarketCap from './CirculatingSupplyMarketCap';
import { useTotalSupply } from '../../data/TotalSupply';

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
  
  &:hover, &:active, &:focus {
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

export default function TriPriceModal() {
  const isModalOpen = useModalOpen(ApplicationModal.TRI_PRICE)
  const toggleWalletModal = useToggleTriPriceModal()
  const { getTriPrice, triPriceFriendly } = useTriPrice();
  const totalTRI = useTotalSupply(TRI[ChainId.AURORA]);

  return (
    <Modal isOpen={isModalOpen} onDismiss={toggleWalletModal} minHeight={false} maxHeight={90}>
      <Wrapper>
        <UpperSection>
          <CloseIcon onClick={toggleWalletModal}>
            <CloseColor />
          </CloseIcon>
          <HeaderRow color="blue">
            Trisolaris Token
          </HeaderRow>
          <ContentWrapper mobile={isMobile}>
            <AutoRow>
              <AutoColumn>
                <IconWrapper size={32}>
                  <img src={'https://github.com/trisolaris-labs/tokens/blob/master/assets/0xFa94348467f64D5A457F75F8bc40495D33c65aBB/logo.png?raw=true'} />
                </IconWrapper>
              </AutoColumn>
              <AutoColumn style={{ padding: '0 .75em', flex: '1 1 0%' }}>
                <AutoRow>
                  <TYPE.largeHeader>TRI</TYPE.largeHeader>
                </AutoRow>
              </AutoColumn>
              <AutoColumn>
                <TYPE.mediumHeader fontWeight={500}>{triPriceFriendly != null ? `$${triPriceFriendly}` : '-'}</TYPE.mediumHeader>
              </AutoColumn>
            </AutoRow>
            <CirculatingSupplyMarketCap totalTRI={totalTRI} triPrice={getTriPrice()} />
            <AutoRow align="center" justify="space-around" padding="1rem 0 0 0">
              <Link href="https://explorer.mainnet.aurora.dev/token/0xFa94348467f64D5A457F75F8bc40495D33c65aBB">Contract</Link>
              <Link href="https://dexscreener.com/aurora/0x84b123875f0f36b966d0b6ca14b31121bd9676ad">DEX Screener</Link>
            </AutoRow>
          </ContentWrapper>
        </UpperSection>
      </Wrapper>
    </Modal>
  );
}