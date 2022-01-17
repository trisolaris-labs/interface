import styled from 'styled-components'
import { TYPE } from '../../theme'
import React, { useCallback, useMemo, useState } from 'react'
import { RowBetween } from '../Row'
import { AutoColumn } from '../Column'
import Popover from '../Popover'
import question from '../../assets/images/question.svg'
import { Fraction, JSBI, TokenAmount } from '@trisolaris/sdk'
import { addCommasToNumber } from '../../utils'

const DataRow = styled(RowBetween)`
  background: ${({ theme }) => theme.bg3};
  box-sizing: border-box;
  border-radius: 8px;
  padding: 5px;
  margin-top: 1rem;
`

const HorizontalRule = styled.hr`
  border-top-width: 1px;
  border-bottom-width: 0;
  color: black;
  width: 100%;
`

const IconWrapper = styled.div<{ size?: number }>`
  ${({ theme }) => theme.flexColumnNoWrap};
  align-items: center;
  justify-content: center;
  margin-left: 0.25rem;
  & > * {
    height: ${({ size }) => (size ? size + 'px' : '32px')};
    width: ${({ size }) => (size ? size + 'px' : '32px')};
  }
`

const ContentWrapper = styled.div`
  padding: 0.5rem 1rem;
  width: 250px;
`

const LOCKED_TRI = JSBI.BigInt(165000000) // TX: 0x93026b0e7150837de8180890d4f1790bf14f3bc36f771433717830647c1a0516

type Props = {
  totalTRI?: TokenAmount
  triPrice: Fraction | null
}

export default function CirculatingSupplyMarketCap({ totalTRI, triPrice }: Props) {
  const [show, setShow] = useState(false)
  const open = useCallback(() => setShow(true), [setShow])
  const close = useCallback(() => setShow(false), [setShow])

  const isLoading = totalTRI == null || triPrice == null

  const circulating = useMemo(() => (isLoading ? null : JSBI.subtract(JSBI.BigInt(totalTRI!.toFixed(0)), LOCKED_TRI)), [
    isLoading,
    totalTRI,
    LOCKED_TRI
  ])

  const marketCap = useMemo(() => (isLoading ? null : new Fraction(circulating!, '1').multiply(triPrice!).toFixed(0)), [
    isLoading,
    triPrice,
    circulating
  ])

  const lockedTRIFriendly = addCommasToNumber(isLoading ? '-' : LOCKED_TRI?.toString() ?? '-')
  const totalTRIFriendly = addCommasToNumber(isLoading ? '-' : totalTRI?.toFixed(0) ?? '-')
  const circulatingFriendly = addCommasToNumber(isLoading ? '-' : circulating?.toString() ?? '-')
  const marketCapFriendly = isLoading ? '-' : `$${addCommasToNumber(marketCap!)}`

  const content = (
    <ContentWrapper>
      <AutoColumn>
        <RowBetween padding="0 0 .5rem 0">
          <TYPE.body>Total</TYPE.body>
          <TYPE.body>{totalTRIFriendly}</TYPE.body>
        </RowBetween>
        <RowBetween padding="0 0 .5rem 0">
          <TYPE.body>Locked</TYPE.body>
          <TYPE.body>{lockedTRIFriendly}</TYPE.body>
        </RowBetween>
        <HorizontalRule />
        <RowBetween>
          <TYPE.body>Circulating</TYPE.body>
          <TYPE.body>{circulatingFriendly}</TYPE.body>
        </RowBetween>
      </AutoColumn>
    </ContentWrapper>
  )

  return (
    <>
      <DataRow>
        <TYPE.body>
          Circulating Supply
          <Popover content={content} show={show}>
            <IconWrapper size={16} onMouseEnter={open} onMouseLeave={close}>
              <img src={question} />
            </IconWrapper>
          </Popover>
        </TYPE.body>
        <TYPE.body>{circulatingFriendly}</TYPE.body>
      </DataRow>
      <DataRow>
        <TYPE.body>Market Cap</TYPE.body>
        <TYPE.body>{marketCapFriendly}</TYPE.body>
      </DataRow>
    </>
  )
}
