import React from 'react'
import { Text } from 'rebass'
import { Settings2 as ManageIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom'

import { ButtonGold } from '../../../Button'

import { currencyId } from '../../../../utils/currencyId'

import { TYPE } from '../../../../theme'

import { PoolCardTriProps } from '..'

import {
  Button,
  ActionsContainer,
  StyledMutedSubHeader,
  ExpandableStakedContainer,
  ExpandableActionsContainer
} from '../PoolCardTri.styles'
import { Currency } from '@trisolaris/sdk'

function Expandable({
  totalStakedInUSDFriendly,
  isStaking,
  isPeriodFinished,
  currencies,
  stableSwapPoolName,
  version,
  isLegacy,
  enableClaimButton
}: {
  totalStakedInUSDFriendly: string
  enableClaimButton?: boolean
  currencies: Currency[]
} & Pick<PoolCardTriProps, 'isStaking' | 'isPeriodFinished' | 'stableSwapPoolName' | 'version' | 'isLegacy'>) {
  const history = useHistory()
  const { t } = useTranslation()

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

  function renderActionsContainer() {
    return isLegacy && !isStaking ? (
      <Button disabled={true} isStaking={isStaking}>
        {t('earn.deposit')}
      </Button>
    ) : (
      <ActionsContainer>
        {enableClaimButton && (
          <ButtonGold padding="8px" borderRadius="8px" maxWidth="65px">
            Claim
          </ButtonGold>
        )}
        {renderManageOrDepositButton()}
      </ActionsContainer>
    )
  }

  return (
    <div>
      <ExpandableStakedContainer>
        <Text>{t('earn.totalStaked')}</Text>
        <TYPE.white fontWeight={500}>{`$${totalStakedInUSDFriendly}`}</TYPE.white>
      </ExpandableStakedContainer>
      <ExpandableActionsContainer>
        <Text>Manage this Farm</Text>
        {renderActionsContainer()}
      </ExpandableActionsContainer>
    </div>
  )
}

export default Expandable
