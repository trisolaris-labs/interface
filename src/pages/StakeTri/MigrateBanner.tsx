import React, { useState } from 'react'
import styled from 'styled-components'
import { Text } from 'rebass'

import { TYPE } from '../../theme'
import { RowBetween } from '../../components/Row'
import MigrateXtri from './MigrateXtri'
import Modal from '../../components/Modal'
import { ButtonPrimary } from '../../components/Button'

import { CardBackground } from './StakingAPRCard'
import { StyledContainer } from './MigrateXtri.styles'

const StyledBannerContainer = styled(StyledContainer)`
  background: #3e6587;
`

const ButtonsContainer = styled.div`
  display: flex;
  justify-content: center;
`

function MigrateBanner() {
  const [openModal, setOpenModal] = useState(false)
  return (
    <StyledBannerContainer>
      <Modal isOpen={openModal} onDismiss={() => setOpenModal(false)}>
        <MigrateXtri />
      </Modal>
      <TYPE.mediumHeader fontWeight={600}>Migrate your xTRI</TYPE.mediumHeader>
      <RowBetween />
      <Text marginTop="10px">
        You have xTRI available to migrate to the new <span style={{ fontWeight: 600 }}>pTRI</span>, Trisolaris Revenue
        Share token.
      </Text>
      <Text marginTop="10px">
        In order to continue making profits from staking, you need to migrate your current Stake in xTri into the new
        pTri Staking.
      </Text>
      <ButtonsContainer>
        <ButtonPrimary onClick={() => setOpenModal(true)} maxWidth={200} padding="10px 50px">
          Migrate now
        </ButtonPrimary>
      </ButtonsContainer>
    </StyledBannerContainer>
  )
}

export default MigrateBanner
