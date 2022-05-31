import React, { useContext } from 'react'
import { ChainId, CurrencyAmount, Fraction } from '@trisolaris/sdk'
import { Text } from 'rebass'
import { ThemeContext } from 'styled-components'

import { TYPE } from '../../../theme'
import { RowBetween, RowFixed } from '../../../components/Row'
import { ButtonConfirmed } from '../../../components/Button'
import { TransactionErrorContent, ConfirmationModalContent } from '../../../components/TransactionConfirmationModal'
import { AutoColumn } from '../../../components/Column'
import CurrencyLogo from '../../../components/CurrencyLogo'

import { XTRI, PTRI } from '../../../constants/tokens'

type MigrationTransactionModalProps = {
  errorMessage: string | undefined
  onDismiss: () => void
  handleMigrate: () => void
  pendingTx: boolean
  xTriBalance: CurrencyAmount | undefined
  xTriBalanceInTRI: Fraction
}

function MigrationTransactionModal({
  errorMessage,
  onDismiss,
  handleMigrate,
  pendingTx,
  xTriBalance,
  xTriBalanceInTRI
}: MigrationTransactionModalProps) {
  const theme = useContext(ThemeContext)

  function confirmationHeader() {
    return (
      <AutoColumn gap={'md'} style={{ marginTop: '20px' }}>
        <TYPE.mediumHeader fontWeight={500}>Migrating</TYPE.mediumHeader>
        <RowBetween align="flex-end">
          <RowFixed gap={'0px'}>
            <CurrencyLogo currency={XTRI[ChainId.AURORA]} size={'24px'} style={{ marginRight: '12px' }} />
            <Text fontSize={24} fontWeight={500}>
              {xTriBalance?.toFixed(2)}
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
            <CurrencyLogo currency={PTRI[ChainId.AURORA]} size={'24px'} style={{ marginRight: '12px' }} />
            <Text fontSize={24} fontWeight={500} color={theme.primary1}>
              {xTriBalanceInTRI?.toFixed(2)}
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
        <ButtonConfirmed onClick={handleMigrate} disabled={pendingTx}>
          Confirm
        </ButtonConfirmed>
      )}
    />
  )
}

export default MigrationTransactionModal
