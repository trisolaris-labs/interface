import React from 'react'
import styled from 'styled-components'

import { PageWrapper } from '../../components/Page'
import StakeBox from './StakeBox'
import MigrateXtri from './MigrateXtri'
import ClaimPtri from './ClaimPtri'
import StatsBox from './StatsBox'
import { ExternalLink } from '../../theme'
import { Text } from 'rebass'

import { StyledContainer } from './StatsBox'

const StyledLearnMoreContainer = styled.div`
  display: flex;
  align-items: center;
`

const StyledExternalLink = styled(ExternalLink)`
  font-weight: 600;
  color: ${({ theme }) => theme.primaryText1};
  margin: 2px 0 10px;
`

const StyledTextinfo = styled.div`
  margin: 20px 0;
`

const TopContainer = styled.div`
  display: flex;
  justify-content: space-between;
`

const StatsBoxContainer = styled.div`
  flex: 1;
  max-width: 55%;
  width: 100%;
  height: 100%;
`

const AboutContainer = styled(StyledContainer)`
  flex: 1;
  max-width: 40%;
  width: 100%;
`

function StakeV2() {
  return (
    <PageWrapper gap="lg">
      <TopContainer>
        <StatsBoxContainer>
          <StatsBox />
        </StatsBoxContainer>
        <AboutContainer>
          <Text fontSize={24} fontWeight={500}>
            About pTRI
          </Text>
          <StyledTextinfo>pTri is the new Trisolaris revenue share Token.</StyledTextinfo>
          <StyledLearnMoreContainer>
            <StyledExternalLink href=""> Learn about how it works ↗</StyledExternalLink>
          </StyledLearnMoreContainer>
        </AboutContainer>
      </TopContainer>
      <MigrateXtri />
      <StakeBox />
      <ClaimPtri />
    </PageWrapper>
  )
}

export default StakeV2
