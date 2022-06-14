import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { ChainId } from '@trisolaris/sdk'

import { PageWrapper } from '../../components/Page'
import StakeBox from './StakeBox'
import ClaimPtri from './ClaimPtri'
import StatsBox from './StatsBox'
import { TYPE } from '../../theme'
import MigrateXtri from './MigrateXtri'
import Modal from '../../components/Modal'
import { ButtonConfirmed } from '../../components/Button'

import { useActiveWeb3React } from '../../hooks'
import { useTokenBalance } from '../../state/wallet/hooks'

import { XTRI } from '../../constants/tokens'
import { BIG_INT_ZERO } from '../../constants'
import { RowBetween } from '../../components/Row'
import { AutoColumn } from '../../components/Column'
import { CardSection, HighlightCard } from '../../components/earn/styled'
import { LargeHeaderWhite } from './StakeTriV1'
import AboutContainer from './AboutContainer'
import PTRIRemittances from './PTRIRemittances'

const TopContainer = styled.div`
  align-items: stretch;
  display: flex;
  justify-content: space-between;
  margin: 0;
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
  flex-direction:column;
`};
`

const StatsBoxContainer = styled(AutoColumn)`
  flex: 1 50%;
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
  font-size: 14px;
`};
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
    // Should only track hasXTriBalance, otherwise modal will continually pop up
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        <AboutContainer />
        <StatsBoxContainer>
          <StatsBox />
        </StatsBoxContainer>
      </TopContainer>
      <ClaimPtri />
      <StakeBox />
      <PTRIRemittances />
    </PageWrapper>
  )
}

export default StakeTri
