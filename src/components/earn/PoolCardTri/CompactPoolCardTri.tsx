import React from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom'
import { Settings2 as ManageIcon } from 'lucide-react'

import { TYPE } from '../../../theme'
import { AutoColumn } from '../../Column'
import { ButtonGold } from '../../Button'
import { AutoRow, RowBetween } from '../../Row'
import MultipleCurrencyLogo from '../../MultipleCurrencyLogo'

import { ChefVersions } from '../../../state/stake/stake-constants'
import { useColorForToken } from '../../../hooks/useColor'
import { currencyId } from '../../../utils/currencyId'
import { addCommasToNumber } from '../../../utils'
import { getPairRenderOrder } from '../../../utils/pools'
import GetTokenLink from '../FarmsPortfolio/GetTokenLink'
import PoolCardTriRewardText from './PoolCardTriRewardText'

import { PoolCardTriProps } from '.'

import { PairContainer, ResponsiveCurrencyLabel, TokenPairBackgroundColor, Button } from './PoolCardTri.styles'

import { CompactWrapper, CompactActionsContainer } from './CompactPoolCardTri.styles'

function CompactPoolCardTri({
  apr,
  chefVersion,
  inStaging,
  isLegacy,
  isPeriodFinished,
  tokens: _tokens,
  totalStakedInUSD,
  isStaking,
  version,
  enableClaimButton = false,
  enableModal = () => null,
  stableSwapPoolName,
  nonTriAPRs,
  hasNonTriRewards,
  friendlyFarmName,
  isFeatured = false
}: { enableClaimButton?: boolean; enableModal?: () => void } & PoolCardTriProps) {
  const history = useHistory()
  const { t } = useTranslation()

  const isDualRewards = chefVersion === ChefVersions.V2

  const { currencies, tokens } = getPairRenderOrder(_tokens)

  const backgroundColor1 = useColorForToken(tokens[0])

  const backgroundColor2 = useColorForToken(tokens[tokens.length - 1], () => isDualRewards)

  const totalStakedInUSDFriendly = addCommasToNumber(totalStakedInUSD.toString())

  function renderManageOrDepositButton() {
    const sharedProps = {
      marginLeft: '0.5rem',
      onClick: () => {
        history.push(
          stableSwapPoolName
            ? `/tri/${stableSwapPoolName}/${version}`
            : `/tri/${currencyId(currencies[0])}/${currencyId(currencies[1])}/${version}`
        )
      }
    }

    return isStaking ? (
      <Button isStaking={true} {...sharedProps}>
        <ManageIcon size={20} />
      </Button>
    ) : (
      <Button disabled={isPeriodFinished} isStaking={false} {...sharedProps}>
        {t('earn.deposit')}
      </Button>
    )
  }

  const currenciesQty = currencies.length

  return (
    <CompactWrapper
      bgColor1={backgroundColor1}
      bgColor2={backgroundColor2}
      isFeatured={isFeatured}
      currenciesQty={currenciesQty}
    >
      <TokenPairBackgroundColor bgColor1={backgroundColor1} bgColor2={backgroundColor2} />

      <AutoRow justifyContent="space-between">
        <PairContainer>
          <GetTokenLink tokens={tokens} />
          <MultipleCurrencyLogo currencies={currencies} size={20} />
          <ResponsiveCurrencyLabel currenciesQty={currenciesQty}>
            {friendlyFarmName ?? currencies.map(({ symbol }) => symbol).join('-')}
          </ResponsiveCurrencyLabel>
        </PairContainer>
        <AutoColumn>
          <TYPE.mutedSubHeader>{t('earn.totalStaked')}</TYPE.mutedSubHeader>
          <TYPE.white>{`$${totalStakedInUSDFriendly}`}</TYPE.white>
        </AutoColumn>
        <AutoColumn>
          <TYPE.mutedSubHeader textAlign="end">APR</TYPE.mutedSubHeader>
          <PoolCardTriRewardText apr={apr} inStaging={inStaging} nonTriAPRs={nonTriAPRs} isLegacy={isLegacy} />
        </AutoColumn>
        {isLegacy && !isStaking ? (
          <Button disabled={true} isStaking={isStaking}>
            {t('earn.deposit')}
          </Button>
        ) : (
          <CompactActionsContainer>
            {enableClaimButton && (
              <ButtonGold padding="8px" borderRadius="8px" maxWidth="65px" onClick={enableModal}>
                Claim
              </ButtonGold>
            )}
            {renderManageOrDepositButton()}
          </CompactActionsContainer>
        )}
      </AutoRow>
    </CompactWrapper>
  )
}

export default CompactPoolCardTri
