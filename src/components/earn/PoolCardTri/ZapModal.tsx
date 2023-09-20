import React, { useEffect, useState } from 'react'
import { WidoWidget, darkTheme } from 'wido-widget'
import { getSupportedTokens, quote, Token as WidoToken } from 'wido'

import Modal from '../../Modal'
import { useActiveWeb3React } from '../../../hooks'
import { useWalletModalToggle } from '../../../state/application/hooks'
import { ChainId } from '@trisolaris/sdk'
import { DAO_ADDRESS } from '../../../constants'
import { NETWORK_CHAIN_ID } from '../../../connectors'

type ZapModalProps = {
  isOpen: boolean
  onDismiss: () => void
  zapTokenAddress: string
}

export default function ZapModal({ isOpen, onDismiss, zapTokenAddress }: ZapModalProps) {
  const { account, chainId, provider } = useActiveWeb3React()
  const toggleWalletModal = useWalletModalToggle()

  const [fromTokens, setFromTokens] = useState<WidoToken[]>([])

  useEffect(() => {
    getSupportedTokens({
      chainId: [ChainId.AURORA]
    })
      .then(tokens => {
        setFromTokens(tokens)
        // Add in case we want users to select any token in the modal
        // setToTokens(tokens.filter(token => token.protocol === 'trisolaris'))
      })
      .catch(error => console.error(error))
  }, [isOpen])

  const zapToken = { chainId: ChainId.AURORA, address: zapTokenAddress }

  return !account || chainId !== NETWORK_CHAIN_ID ? null : (
    <Modal
      isOpen={isOpen}
      onDismiss={onDismiss}
      // maxHeight={90}
    >
      <WidoWidget
        onConnectWalletClick={toggleWalletModal}
        ethProvider={provider}
        fromTokens={fromTokens}
        toTokens={[zapToken]}
        theme={darkTheme}
        partner={DAO_ADDRESS}
        quoteApi={async request => {
          // To enable staking step, an override is set.
          // `$trisolaris_auto_stake` must be set to 1.
          //
          // If the var is not set, or has a different value than 1,
          //  the staking step won't be added.
          //
          // This variable will have no effect on tokens that are not
          // Trisolaris LP tokens with a valid enabled farm.
          request.varsOverride = {
            $trisolaris_auto_stake: '1'
          }
          return quote(request)
        }}
      />
    </Modal>
  )
}
