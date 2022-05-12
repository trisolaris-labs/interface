import React from 'react'
import { AutoColumn } from '../../components/Column'
import PoolCardTRI from '../../components/earn/PoolCardTri'
import { FarmTabs } from '../../components/NavigationTabs'
import { useFarms } from '../../state/stake/apr'
import { TYPE } from '../../theme'
import { isTokenAmountPositive } from '../../utils/pools'
import { PoolSection, DataRow } from './EarnTri.styles'

const MemoizedPoolCardTRI = React.memo(PoolCardTRI)

export default function EarnTri({ stablePoolsOrder }: { stablePoolsOrder: number[] }) {
  const allFarmArrs = useFarms()
  const stablePoolsOrderSet = new Set(stablePoolsOrder)
  const stablePools = allFarmArrs.filter(({ ID }) => stablePoolsOrderSet.has(ID))

  return (
    <>
      <AutoColumn gap="lg" style={{ width: '100%' }}>
        <FarmTabs active="stable" />
      </AutoColumn>
      <AutoColumn gap="lg" style={{ width: '100%' }}>
        <DataRow style={{ alignItems: 'baseline' }}>
          <TYPE.mediumHeader style={{ marginTop: '0.5rem' }}>Stable Pools</TYPE.mediumHeader>
        </DataRow>

        <PoolSection>
          {stablePools.map(farm =>
            farm.stableSwapPoolName == null ? null : (
              <MemoizedPoolCardTRI
                key={farm.ID}
                apr={farm.apr}
                apr2={farm.apr2}
                nonTriAPRs={farm.nonTriAPRs}
                chefVersion={farm.chefVersion}
                isPeriodFinished={farm.isPeriodFinished}
                tokens={farm.tokens}
                stableSwapPoolName={farm.stableSwapPoolName}
                totalStakedInUSD={farm.totalStakedInUSD}
                version={farm.ID}
                doubleRewards={farm.doubleRewards}
                inStaging={farm.inStaging}
                noTriRewards={farm.noTriRewards}
                doubleRewardToken={farm.doubleRewardToken}
                isStaking={isTokenAmountPositive(farm.stakedAmount)}
              />
            )
          )}
        </PoolSection>
      </AutoColumn>
    </>
  )
}
