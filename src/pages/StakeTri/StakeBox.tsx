import React, { useState } from 'react'
import { ChainId } from '@trisolaris/sdk'
import { useActiveWeb3React } from '../../hooks'

import StakeInputPanel from '../../components/StakeTri/StakeInputPanel'
import ApproveButton from '../../components/ApproveButton'

import { tryParseAmount } from '../../state/stableswap/hooks'
import { useTokenBalance } from '../../state/wallet/hooks'
import useCurrencyInputPanel from '../../components/CurrencyInputPanel/useCurrencyInputPanel'

import { PTRI, TRI } from '../../constants/tokens'
import BalanceButtonValueEnum from '../../components/BalanceButton/BalanceButtonValueEnum'

const INPUT_CHAR_LIMIT = 18

function StakeBox() {
  const { account } = useActiveWeb3React()

  const isStaking = true
  const triBalance = useTokenBalance(account ?? undefined, TRI[ChainId.AURORA])!
  const pTriBalance = useTokenBalance(account ?? undefined, PTRI[ChainId.AURORA])!

  const { getMaxInputAmount } = useCurrencyInputPanel()

  const balance = isStaking ? triBalance : pTriBalance

  const [input, _setInput] = useState<string>('')

  const parsedAmount = tryParseAmount(input, balance?.currency)

  function setInput(v: string) {
    // Allows user to paste in long balances
    const value = v.slice(0, INPUT_CHAR_LIMIT)
    _setInput(value)
  }

  const handleBalanceClick = (value: BalanceButtonValueEnum) => {
    const amount = getClickedAmount(value)
    _setInput(amount)
  }

  const { atMaxAmount: atMaxAmountInput, atHalfAmount: atHalfAmountInput, getClickedAmount } = getMaxInputAmount({
    amount: balance,
    parsedAmount: parsedAmount
  })

  return (
    <div>
      <StakeInputPanel
        value={input!}
        onUserInput={setInput}
        currency={isStaking ? TRI[ChainId.AURORA] : PTRI[ChainId.AURORA]}
        id="stake-currency-input"
        onMax={() => handleBalanceClick(BalanceButtonValueEnum.MAX)}
        onClickBalanceButton={handleBalanceClick}
        disableMaxButton={atMaxAmountInput}
        disableHalfButton={atHalfAmountInput}
      />
      <ApproveButton address={PTRI[ChainId.AURORA].address} amount={parsedAmount} />
    </div>
  )
}

export default StakeBox
