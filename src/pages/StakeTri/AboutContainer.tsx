import React from 'react'
import styled from 'styled-components'
import { LightCard } from '../../components/Card'
import { AutoColumn } from '../../components/Column'
import PoolCardTriRewardText from '../../components/earn/PoolCardTri/PoolCardTriRewardText'
import { StableSwapPoolName, STABLESWAP_POOLS } from '../../state/stableswap/constants'
import { useFarmsAPI } from '../../state/stake/useFarmsAPI'
import { ExternalLink, TYPE } from '../../theme'

const Container = styled(AutoColumn)`
  margin-right: 16px;
  flex: 1 40%;
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    margin: 0 0 20px;
    font-size: 14px;
  `};
`
const StyledExternalLink = styled(ExternalLink)`
  font-weight: 600;
  color: ${({ theme }) => theme.primaryText1};
  // margin: 2px 0 10px;
  margin-top: 20px 0;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`
const DynamicAPRContainer = styled.span`
  display: inline-block;
  position: relative;
  top: 0.1rem;
`

const { lpToken: USD_TLP } = STABLESWAP_POOLS[StableSwapPoolName.USDC_USDT_USN]

export default function AboutContainer() {
  const farmsData = useFarmsAPI()
  const { apr, inStaging, nonTriAPRs } = farmsData.filter(item => item.lpAddress === USD_TLP.address)?.[0]

  const usdTLPLink = (
    <StyledExternalLink target="_blank" href={`https://aurorascan.dev/token/${USD_TLP.address}`}>
      USD TLP
    </StyledExternalLink>
  )

  const dynamicStableAPRNode =
    apr > 0 ? (
      <span>
        Compound your rewards and earn an <strong>additional</strong>{' '}
        <DynamicAPRContainer>
          <PoolCardTriRewardText apr={apr} inStaging={inStaging} nonTriAPRs={nonTriAPRs} />
        </DynamicAPRContainer>{' '}
        APR.
      </span>
    ) : null

  return (
    <Container>
      <LightCard>
        <TYPE.largeHeader textAlign="center">pTRI</TYPE.largeHeader>
        <TYPE.main margin="20px 0">
          Stake TRI to earn rewards in {usdTLPLink}. {dynamicStableAPRNode}
        </TYPE.main>
        <TYPE.main margin="20px 0">
          A 0.05% fee is deducted from every swap and used to buy {usdTLPLink} tokens which are distributed to all pTRI
          holders.
        </TYPE.main>
        <StyledExternalLink
          href="https://medium.com/trisolaris-labs/ptri-the-first-step-of-trinomics-revamp-e4c7045e37b7"
          target="_blank"
        >
          Learn more ↗
        </StyledExternalLink>
      </LightCard>
    </Container>
  )
}
