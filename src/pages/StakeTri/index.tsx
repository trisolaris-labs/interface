import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { ChainId } from '@trisolaris/sdk'

import { PageWrapper } from '../../components/Page'
import StakeBox from './StakeBox'
import ClaimPtri from './ClaimPtri'
import StatsBox from './StatsBox'
import { ExternalLink, TYPE } from '../../theme'
import MigrateXtri from './MigrateXtri'
import Modal from '../../components/Modal'
import { ButtonConfirmed } from '../../components/Button'

import { useActiveWeb3React } from '../../hooks'
import { useTokenBalance } from '../../state/wallet/hooks'

import { USD_TLP, XTRI } from '../../constants/tokens'
import { BIG_INT_ZERO } from '../../constants'
import { LightCard } from '../../components/Card'
import { AutoRow, RowBetween } from '../../components/Row'
import { AutoColumn } from '../../components/Column'
import { CardSection, HighlightCard } from '../../components/earn/styled'
import { LargeHeaderWhite } from './StakeTriV1'
import _ from 'lodash'

const StyledExternalLink = styled(ExternalLink)`
  font-weight: 600;
  color: ${({ theme }) => theme.primaryText1};
  margin: 2px 0 10px;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`

const StyledTextinfo = styled.div`
  margin: 20px 0;
`

const TopContainer = styled(AutoRow)`
  align-items: stretch;
  display: flex;
  justify-content: space-between;
  margin: 0;
`

const AboutContainer = styled(AutoColumn)`
  margin-right: 16px;
  flex: 1 40%;
`

const StatsBoxContainer = styled(AutoColumn)`
  flex: 1 50%;
`

function StakeTri() {
  const { account } = useActiveWeb3React()
  const xTriBalance = useTokenBalance(account ?? undefined, XTRI[ChainId.AURORA])

  const [openModal, setOpenModal] = useState(false)

  const hasXTriBalance = xTriBalance?.greaterThan(BIG_INT_ZERO)

  const closeModal = () => setOpenModal(false)

  useEffect(() => {
    if (hasXTriBalance && !openModal) {
      setOpenModal(true)
    }
  }, [hasXTriBalance])

  return (
    <PageWrapper gap="lg">
      <Modal isOpen={openModal} onDismiss={closeModal}>
        {xTriBalance != null && <MigrateXtri closeModal={closeModal} xTriBalance={xTriBalance} />}
      </Modal>
      {hasXTriBalance && (
        <HighlightCard>
          <CardSection>
            <AutoColumn gap="md">
              <RowBetween>
                <LargeHeaderWhite fontWeight={600}>Migrate to pTRI</LargeHeaderWhite>
              </RowBetween>
              <RowBetween>
                <TYPE.white fontSize={14}>
                  xTRI has been deprecated. Please migrate to pTRI to continue earning rewards.
                </TYPE.white>
              </RowBetween>{' '}
              <ButtonConfirmed padding={10} onClick={() => setOpenModal(true)}>
                Migrate to pTRI
              </ButtonConfirmed>
            </AutoColumn>
          </CardSection>
        </HighlightCard>
      )}
      <TopContainer>
        <AboutContainer>
          <LightCard>
            <TYPE.largeHeader textAlign="center">pTRI</TYPE.largeHeader>
            <StyledTextinfo>Stake your TRI tokens to receive your share of protocol generated revenue.</StyledTextinfo>
            <StyledTextinfo>
              A 0.05% fee is deducted from every swap and used to buy{' '}
              <StyledExternalLink
                target="_blank"
                href={`https://aurorascan.dev/token/${USD_TLP[ChainId.AURORA].address}`}
              >
                USD TLP
              </StyledExternalLink>{' '}
              tokens which are distributed to all pTRI holders.
            </StyledTextinfo>
          </LightCard>
        </AboutContainer>
        <StatsBoxContainer>
          <StatsBox />
        </StatsBoxContainer>
      </TopContainer>
      <ClaimPtri />
      <StakeBox />
    </PageWrapper>
  )
}

export default StakeTri
