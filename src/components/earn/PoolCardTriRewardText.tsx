import React, { useCallback, useMemo, useState } from 'react'
import { ChainId, Token } from '@trisolaris/sdk'
import { TYPE } from '../../theme'
import { AutoColumn } from '../Column'
import { AutoRow, RowBetween } from '../Row'
import { TRI } from '../../constants/tokens'
import Popover from '../Popover'
import { PoolCardTriProps } from './PoolCardTri'
import styled from 'styled-components'
import { Info } from 'react-feather'
import { useAllTokens } from '../../hooks/Tokens'
import _ from 'lodash'
import CurrencyLogo from '../CurrencyLogo'

const IconWrapper = styled.div`
  ${({ theme }) => theme.flexColumnNoWrap};
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-left: 0.25rem;
`

const ContentWrapper = styled.div`
  padding: 0.5rem 1rem;
  width: fit-content;
`

type Props = Pick<PoolCardTriProps, 'apr' | 'inStaging' | 'nonTriAPRs'>

export default function PoolCardTriRewardText({ apr, inStaging, nonTriAPRs }: Props) {
  const [show, setShow] = useState(false)
  const open = useCallback(() => setShow(true), [setShow])
  const close = useCallback(() => setShow(false), [setShow])
  const allTokens = useAllTokens()
  const getTokenByAddress = useCallback(
    address =>
      _.find(allTokens, token => token.address.toLowerCase() === address.toLowerCase()) ??
      new Token(ChainId.AURORA, address, 18),
    [allTokens]
  )
  const tooltipData = useMemo(
    () =>
      [{ token: TRI[ChainId.AURORA], apr }].concat(
        nonTriAPRs?.map(({ address, apr }) => ({
          token: getTokenByAddress(address),
          apr
        })) ?? []
      ),
    [apr, getTokenByAddress, nonTriAPRs]
  )

  const tooltipContent = useMemo(
    () => (
      <ContentWrapper>
        <AutoColumn style={{ padding: '0.25rem' }}>
          {tooltipData.map(({ token, apr }) => (
            <RowBetween key={token.address}>
              <AutoColumn justify="center" style={{ display: 'inline-flex' }}>
                <CurrencyLogo currency={token} size={'16px'} />
                <TYPE.body marginLeft="0.5rem">{token.symbol}</TYPE.body>
              </AutoColumn>
              <AutoColumn style={{ marginLeft: '1rem' }}>
                <TYPE.body>{apr}%</TYPE.body>
              </AutoColumn>
            </RowBetween>
          ))}
        </AutoColumn>
      </ContentWrapper>
    ),
    [tooltipData]
  )

  if (inStaging) {
    return <TYPE.white textAlign="end">Coming Soon</TYPE.white>
  }

  const hasTriRewards = apr !== 0
  const hasNonTriRewards = nonTriAPRs?.some(({ apr }) => apr > 0)
  const hasOnlyTriRewards = hasTriRewards && !hasNonTriRewards
  const hasOnlyNonTriRewards = !hasTriRewards && hasNonTriRewards
  const hasMultipleNonTriRewards = hasNonTriRewards && Number(nonTriAPRs?.length) > 1

  // If only TRI rewards
  if (hasOnlyTriRewards) {
    return <PoolCardTriSingleCurrencyReward apr={apr} token={TRI[ChainId.AURORA]} />
  }

  // If only 1 non-TRI reward
  if (hasOnlyNonTriRewards && !hasMultipleNonTriRewards) {
    const [rewardTokenData] = nonTriAPRs
    return (
      <PoolCardTriSingleCurrencyReward apr={rewardTokenData.apr} token={getTokenByAddress(rewardTokenData.address)} />
    )
  }

  // If multiple rewards, render aggregate APR, token logos, and tooltip
  const totalAPR = (nonTriAPRs ?? []).reduce((acc, { apr: nonTriAPR }) => acc + nonTriAPR, apr)
  return (
    <Popover content={tooltipContent} show={show}>
      <IconWrapper onMouseEnter={open} onMouseLeave={close}>
        {tooltipData.map(({ token }) => (
          <CurrencyLogo currency={token} key={token.address} size={'16px'} style={{ marginRight: '4px' }} />
        ))}
        <TYPE.white marginRight="4px" textAlign="end">
          {totalAPR}%
        </TYPE.white>
        <Info size="16px" />
      </IconWrapper>
    </Popover>
  )
}

function PoolCardTriSingleCurrencyReward({ apr, token }: { apr: number; token: Token }) {
  return (
    <AutoRow alignItems="center">
      <CurrencyLogo currency={token} size={'16px'} style={{ marginRight: '4px' }} />
      <TYPE.body>{apr}%</TYPE.body>
    </AutoRow>
  )
}
