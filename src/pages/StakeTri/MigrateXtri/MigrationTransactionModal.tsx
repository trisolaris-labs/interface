import React, { useContext } from 'react'
import { ChainId, CurrencyAmount, Fraction, JSBI, Percent } from '@trisolaris/sdk'
import { Text } from 'rebass'
import { ThemeContext } from 'styled-components'

import { TYPE } from '../../../theme'
import { RowBetween, RowFixed } from '../../../components/Row'
import { ButtonConfirmed } from '../../../components/Button'
import { TransactionErrorContent, ConfirmationModalContent } from '../../../components/TransactionConfirmationModal'
import { AutoColumn } from '../../../components/Column'
import CurrencyLogo from '../../../components/CurrencyLogo'

import { XTRI, PTRI, TRI } from '../../../constants/tokens'

type MigrationTransactionModalProps = {
  depositFee: Percent | null
  errorMessage: string | undefined
  onDismiss: () => void
  handleMigrate: () => void
  pendingTx: boolean
  xTriBalance: CurrencyAmount | undefined
  xTriBalanceInTRI: Fraction
}

function MigrationTransactionModal({
  depositFee,
  errorMessage,
  onDismiss,
  handleMigrate,
  pendingTx,
  xTriBalance,
  xTriBalanceInTRI
}: MigrationTransactionModalProps) {
  const theme = useContext(ThemeContext)

  const pTRIAmount =
    depositFee != null && xTriBalanceInTRI != null
      ? xTriBalanceInTRI.subtract(
          new Fraction(
            JSBI.multiply(xTriBalanceInTRI.numerator, depositFee.numerator),
            JSBI.multiply(xTriBalanceInTRI.denominator, depositFee.denominator)
          )
        )
      : xTriBalanceInTRI

  function confirmationHeader() {
    return (
      <AutoColumn gap={'md'} style={{ marginTop: '20px' }}>
        <TYPE.main>You will be unstaking your xTRI for TRI, then staking your TRI for pTRI.</TYPE.main>
        <TYPE.main>pTRI can be redeemed for the underlying TRI at any time.</TYPE.main>
        <RowBetween align="flex-end">
          <RowFixed gap={'0px'}>
            <CurrencyLogo currency={XTRI[ChainId.AURORA]} size={'24px'} style={{ marginRight: '12px' }} />
            <Text fontSize={24} fontWeight={500}>
              {xTriBalance?.toSignificant(2)}
            </Text>
          </RowFixed>
          <RowFixed gap={'0px'}>
            <Text fontSize={24} fontWeight={500} style={{ marginLeft: '10px' }}>
              {XTRI[ChainId.AURORA].symbol}
            </Text>
          </RowFixed>
        </RowBetween>
        <RowFixed>To</RowFixed>
        <RowBetween align="flex-end">
          <RowFixed gap={'0px'}>
            <CurrencyLogo currency={TRI[ChainId.AURORA]} size={'24px'} style={{ marginRight: '12px' }} />
            <Text fontSize={24} fontWeight={500}>
              {xTriBalanceInTRI?.toSignificant(2)}
            </Text>
          </RowFixed>
          <RowFixed gap={'0px'}>
            <Text fontSize={24} fontWeight={500} style={{ marginLeft: '10px' }}>
              {TRI[ChainId.AURORA].symbol}
            </Text>
          </RowFixed>
        </RowBetween>
        <RowFixed>To</RowFixed>
        <RowBetween align="flex-end">
          <RowFixed gap={'0px'}>
            <CurrencyLogo currency={PTRI[ChainId.AURORA]} size={'24px'} style={{ marginRight: '12px' }} />
            <Text fontSize={24} fontWeight={500} color={theme.primary1}>
              {pTRIAmount?.toSignificant(2)}
            </Text>
          </RowFixed>
          <RowFixed gap={'0px'}>
            <Text fontSize={24} fontWeight={500} style={{ marginLeft: '10px' }}>
              {PTRI[ChainId.AURORA].symbol}
            </Text>
          </RowFixed>
        </RowBetween>
      </AutoColumn>
    )
  }

  return errorMessage ? (
    <TransactionErrorContent onDismiss={onDismiss} message={errorMessage} />
  ) : (
    <ConfirmationModalContent
      title="Confirm Migration"
      onDismiss={onDismiss}
      topContent={confirmationHeader}
      bottomContent={() => (
        <>
          {depositFee != null ? (
            <TYPE.small textAlign="center">
              A {depositFee.toSignificant(2)}% deposit fee is deducted when you deposit your TRI tokens.
            </TYPE.small>
          ) : null}
          <ButtonConfirmed onClick={handleMigrate} disabled={pendingTx}>
            Confirm
          </ButtonConfirmed>
        </>
      )}
    />
  )
}

export default MigrationTransactionModal
