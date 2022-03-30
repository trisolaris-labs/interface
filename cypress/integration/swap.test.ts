import { ChainId } from '@trisolaris/sdk'
import { USDC, USDT } from '../../src/constants/tokens'

describe('Swap', () => {
  beforeEach(() => {
    cy.visit('/swap')
  })
  it('can enter an amount into input', () => {
    cy.get('#swap-currency-input .token-amount-input')
      .type('0.001', { delay: 200 })
      .should('have.value', '0.001')
  })

  it('zero swap amount', () => {
    cy.get('#swap-currency-input .token-amount-input')
      .type('0.0', { delay: 200 })
      .should('have.value', '0.0')
  })

  it('invalid swap amount', () => {
    cy.get('#swap-currency-input .token-amount-input')
      .type('\\', { delay: 200 })
      .should('have.value', '')
  })

  it('can enter an amount into output', () => {
    cy.get('#swap-currency-output .token-amount-input')
      .type('0.001', { delay: 200 })
      .should('have.value', '0.001')
  })

  it('zero output amount', () => {
    cy.get('#swap-currency-output .token-amount-input')
      .type('0.0', { delay: 200 })
      .should('have.value', '0.0')
  })

  it('cannot defaultswap ETH for USDC due to insufficient balance', () => {
    cy.get('#swap-currency-output .open-currency-select-button').click()
    cy.get('#token-search-input').type('usdc')
    cy.get(`.token-item-${USDC[ChainId.AURORA].address}`).should('be.visible')
    cy.get(`.token-item-${USDC[ChainId.AURORA].address}`).click({ force: true })
    cy.get('#swap-currency-input .token-amount-input').should('be.visible')
    cy.get('#swap-currency-input .token-amount-input').type('5', { force: true, delay: 200 })
    cy.get('#swap-currency-output .token-amount-input').should('not.equal', '')
    cy.get('#swap-routed-via').should('contain', 'Standard AMM')
    cy.get('#swap-button').should('contain', 'Insufficient ETH balance')
  })

  // NOTE - Depends on stableswap liquidity and quotes hence skipped
  it.skip('cannot defaultswap USDT for USDC due to insufficient balance', () => {
    cy.get('#swap-currency-input .open-currency-select-button').click()
    cy.get('#token-search-input').type('usdt')
    cy.get(`.token-item-${USDT[ChainId.AURORA].address}`).should('be.visible')
    cy.get(`.token-item-${USDT[ChainId.AURORA].address}`).click({ force: true })

    cy.get('#swap-currency-output .open-currency-select-button').click()
    cy.get('#token-search-input').type('usdc')
    cy.get(`.token-item-${USDC[ChainId.AURORA].address}`).should('be.visible')
    cy.get(`.token-item-${USDC[ChainId.AURORA].address}`).click({ force: true })

    cy.get('#swap-currency-input .token-amount-input').should('be.visible')
    cy.get('#swap-currency-input .token-amount-input').type('5000', { force: true, delay: 200 })
    cy.get('#swap-currency-output .token-amount-input').should('not.equal', '')
    cy.get('#swap-routed-via').should('contain', 'Standard AMM')
    cy.get('#swap-button').should('contain', 'Insufficient USDT balance')
  })

  it('cannot stable swap USDT for USDC due to insufficient balance', () => {
    cy.get('#swap-currency-input .open-currency-select-button').click()
    cy.get('#token-search-input').type('usdt')
    cy.get(`.token-item-${USDT[ChainId.AURORA].address}`).should('be.visible')
    cy.get(`.token-item-${USDT[ChainId.AURORA].address}`).click({ force: true })

    cy.get('#swap-currency-output .open-currency-select-button').click()
    cy.get('#token-search-input').type('usdc')
    cy.get(`.token-item-${USDC[ChainId.AURORA].address}`).should('be.visible')
    cy.get(`.token-item-${USDC[ChainId.AURORA].address}`).click({ force: true })

    cy.get('#swap-currency-input .token-amount-input').should('be.visible')
    cy.get('#swap-currency-input .token-amount-input').type('5', { force: true, delay: 200 })
    cy.get('#swap-currency-output .token-amount-input').should('not.equal', '')
    cy.get('#swap-routed-via').should('contain', 'Stable AMM')
    cy.get('#swap-button').should('contain', 'Insufficient USDT balance')
  })

  it('cannot stable swap USDC for USDT due to insufficient balance', () => {
    cy.get('#swap-currency-input .open-currency-select-button').click()
    cy.get('#token-search-input').type('usdc')
    cy.get(`.token-item-${USDC[ChainId.AURORA].address}`).should('be.visible')
    cy.get(`.token-item-${USDC[ChainId.AURORA].address}`).click({ force: true })

    cy.get('#swap-currency-output .open-currency-select-button').click()
    cy.get('#token-search-input').type('usdt')
    cy.get(`.token-item-${USDT[ChainId.AURORA].address}`).should('be.visible')
    cy.get(`.token-item-${USDT[ChainId.AURORA].address}`).click({ force: true })

    cy.get('#swap-currency-input .token-amount-input').should('be.visible')
    cy.get('#swap-currency-input .token-amount-input').type('5', { force: true, delay: 200 })
    cy.get('#swap-currency-output .token-amount-input').should('not.equal', '')
    cy.get('#swap-routed-via').should('contain', 'Stable AMM')
    cy.get('#swap-button').should('contain', 'Insufficient USDC balance')
  })

  // NOTE - depends on private key balance
  it.skip('can defaultswap ETH for USDC', () => {
    cy.get('#swap-currency-output .open-currency-select-button').click()
    cy.get('#token-search-input').type('usdc')
    cy.get(`.token-item-${USDC[ChainId.AURORA].address}`).should('be.visible')
    cy.get(`.token-item-${USDC[ChainId.AURORA].address}`).click({ force: true })
    cy.get('#swap-currency-input .token-amount-input').should('be.visible')
    cy.get('#swap-currency-input .token-amount-input').type('0.000001', { force: true, delay: 200 })
    cy.get('#swap-currency-output .token-amount-input').should('not.equal', '')
    cy.get('#swap-routed-via').should('contain', 'Standard AMM')
    cy.get('#swap-page')
      .wait(2000)
      .then($rl => {
        if ($rl.find('#swap-button').attr('disabled') === 'disabled') {
          const approveButton = cy.get('button').contains('Approve')

          approveButton.click().wait(5000)
        }

        return cy.get('#swap-page')
      })
      .then(() => {
        cy.get('#swap-button').should('not.have.attr', 'disabled')
        cy.get('#swap-button')
          .click()
          .wait(500)
        cy.get('#confirm-swap-or-send')
          .should('contain', 'Confirm Swap')
          .click()
          .wait(5000)
        cy.get('div').contains('Transaction Submitted')
      })
  })

  // NOTE - depends on private key balance
  it.skip('can stable swap USDC for USDT', () => {
    cy.get('#swap-currency-input .open-currency-select-button').click()
    cy.get('#token-search-input').type('usdc')
    cy.get(`.token-item-${USDC[ChainId.AURORA].address}`).should('be.visible')
    cy.get(`.token-item-${USDC[ChainId.AURORA].address}`).click({ force: true })

    cy.get('#swap-currency-output .open-currency-select-button').click()
    cy.get('#token-search-input').type('usdt')
    cy.get(`.token-item-${USDT[ChainId.AURORA].address}`).should('be.visible')
    cy.get(`.token-item-${USDT[ChainId.AURORA].address}`).click({ force: true })

    cy.get('#swap-currency-input .token-amount-input').should('be.visible')
    cy.get('#swap-currency-input .token-amount-input').type('0.01', { force: true, delay: 200 })
    cy.get('#swap-currency-output .token-amount-input').should('not.equal', '')
    cy.get('#swap-routed-via').should('contain', 'Stable AMM')

    cy.get('#swap-page')
      .then($rl => {
        if ($rl.find('#swap-button').attr('disabled') === 'disabled') {
          const approveButton = cy.get('#swap-button').prev()

          approveButton
            .should('contain.text', 'Approve')
            .click()
            .wait(5000)
        }
        return cy.get('#swap-page')
      })
      .then(() => {
        cy.get('#add-Liquidity-supply-button')
          .should('contain.text', 'Insufficient USDC balance')
          .should('have.attr', 'disabled')
      })

    cy.get('#swap-button').click()
    cy.get('#confirm-swap-or-send').should('contain', 'Confirm Swap')
  })

  // NOTE - depends on private key balance
  it.skip('can swap USDC for USDT via default OR stable amm', () => {
    cy.get('#swap-currency-input .open-currency-select-button').click()
    cy.get('#token-search-input').type('usdc', { force: true, delay: 200 })
    cy.get(`.token-item-${USDC[ChainId.AURORA].address}`).should('be.visible')
    cy.get(`.token-item-${USDC[ChainId.AURORA].address}`).click({ force: true })

    cy.get('#swap-currency-output .open-currency-select-button').click()
    cy.get('#token-search-input').type('usdt', { force: true, delay: 200 })
    cy.get(`.token-item-${USDT[ChainId.AURORA].address}`).should('be.visible')
    cy.get(`.token-item-${USDT[ChainId.AURORA].address}`).click({ force: true })

    cy.get('#swap-currency-input .token-amount-input').should('be.visible')
    cy.get('#swap-currency-input .token-amount-input').type('0.01', { force: true, delay: 200 })
    cy.get('#swap-currency-output .token-amount-input').should('not.equal', '')
    // cy.get('#swap-routed-via').should('contain', 'Stable AMM')

    cy.get('#swap-page')
      .wait(2000)
      .then($rl => {
        if ($rl.find('#swap-button').attr('disabled') === 'disabled') {
          const approveButton = cy.get('button').contains('Approve USDC')

          approveButton.click().wait(5000)
        }

        return cy.get('#swap-page')
      })
      .then(() => {
        cy.get('#swap-button').should('not.have.attr', 'disabled')
        cy.get('#swap-button')
          .click()
          .wait(500)
        cy.get('#confirm-swap-or-send')
          .should('contain', 'Confirm Swap')
          .click()
          .wait(3000)
        cy.get('div').contains('Transaction Submitted')
      })
  })

  it('add a recipient does not exist unless in expert mode', () => {
    cy.get('#add-recipient-button').should('not.exist')
  })

  describe('expert mode', () => {
    beforeEach(() => {
      cy.window().then(win => {
        cy.stub(win, 'prompt').returns('confirm')
      })
      cy.get('#open-settings-dialog-button').click()
      cy.get('#toggle-expert-mode-button').click()
      cy.get('#confirm-expert-mode').click()
    })

    it('add a recipient is visible', () => {
      cy.get('#add-recipient-button').should('be.visible')
    })

    it('add a recipient', () => {
      cy.get('#add-recipient-button').click()
      cy.get('#recipient').should('exist')
    })

    it('remove recipient', () => {
      cy.get('#add-recipient-button').click()
      cy.get('#remove-recipient-button').click()
      cy.get('#recipient').should('not.exist')
    })
  })
})
