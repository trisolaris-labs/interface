import { ChainId } from '@trisolaris/sdk'
import React from 'react'
import { ButtonPrimary } from '../../components/Button'
import { RowBetween } from '../../components/Row'
import { ApprovalState, useApproveCallback } from '../../hooks/useApproveCallback'
import { useDerivedStableSwapAddLiquidityInfo } from '../../state/stableswap-add-liquidity/hooks'
import { Field } from '../../state/stableswap-add-liquidity/actions'
import { isMetaPool, StableSwapPoolName, STABLESWAP_POOLS } from '../../state/stableswap/constants'
import { Dots } from '../Pool/styleds'
import { useTranslation } from 'react-i18next'
import { BIG_INT_ZERO } from '../../constants'

type Props = {
  children: JSX.Element
  stableSwapPoolName: StableSwapPoolName
}

export default function StableSwapPoolAddLiquidityApprovalsRow({ children, stableSwapPoolName }: Props) {
  const { address, metaSwapAddresses } = STABLESWAP_POOLS[ChainId.AURORA][stableSwapPoolName]
  const { currencies, parsedAmounts, error, hasThirdCurrency } = useDerivedStableSwapAddLiquidityInfo(
    stableSwapPoolName
  )

  const effectiveAddress = isMetaPool(stableSwapPoolName) ? metaSwapAddresses : address

  const [approval0, approve0Callback] = useApproveCallback(parsedAmounts[Field.CURRENCY_0], effectiveAddress)
  const [approval1, approve1Callback] = useApproveCallback(parsedAmounts[Field.CURRENCY_1], effectiveAddress)
  const [approval2, approve2Callback] = useApproveCallback(parsedAmounts[Field.CURRENCY_2], effectiveAddress)

  const currencyApprovalsData = [
    {
      approval: approval0,
      value: parsedAmounts[Field.CURRENCY_0],
      symbol: currencies[Field.CURRENCY_0]?.symbol,
      onClick: approve0Callback
    },
    {
      approval: approval1,
      value: parsedAmounts[Field.CURRENCY_1],
      symbol: currencies[Field.CURRENCY_1]?.symbol,
      onClick: approve1Callback
    }
  ]

  if (hasThirdCurrency) {
    currencyApprovalsData.push({
      approval: approval2,
      value: parsedAmounts[Field.CURRENCY_2],
      symbol: currencies[Field.CURRENCY_2]?.symbol,
      onClick: approve2Callback
    })
  }

  const unapprovedTokens = currencyApprovalsData.filter(
    ({ approval, value }) =>
      [ApprovalState.NOT_APPROVED, ApprovalState.PENDING].includes(approval) &&
      value != null &&
      value.greaterThan(BIG_INT_ZERO)
  )

  // If no approvals needed or there's an error, return children
  if (unapprovedTokens.length === 0 || error) {
    return children
  }

  const width = `${Math.floor(100 / unapprovedTokens.length) - 2}%`

  return (
    <RowBetween>
      {unapprovedTokens.map(({ approval, symbol, onClick }, i) => (
        <ButtonPrimary
          id={`add-liquidity-approve-button-${['a', 'b'][i]}`}
          key={symbol ?? i}
          onClick={onClick}
          disabled={[ApprovalState.PENDING, ApprovalState.APPROVED].includes(approval)}
          width={width}
        >
          <ApprovalText approvalState={approval} symbol={symbol ?? ''} />
        </ButtonPrimary>
      ))}
    </RowBetween>
  )
}

function ApprovalText({ approvalState, symbol }: { approvalState: ApprovalState; symbol: string }) {
  const { t } = useTranslation()
  switch (approvalState) {
    case ApprovalState.PENDING:
      return <Dots>Approving {symbol}</Dots>
    case ApprovalState.APPROVED:
      return <span>Approved {symbol}</span>
    case ApprovalState.UNKNOWN:
    case ApprovalState.NOT_APPROVED:
    default:
      return (
        <span>
          {t('addLiquidity.approve')} {symbol}
        </span>
      )
  }
}
