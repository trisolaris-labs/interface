import { USDC, USDT, AURORA, WNEAR } from '../../src/constants/tokens'
import { WETH, ChainId } from '@trisolaris/sdk'

describe('Remove Liquidity', () => {
  it('redirects', () => {
    cy.visit(`/remove/${WETH[ChainId.AURORA].address}-${AURORA[ChainId.AURORA].address}`)
    cy.url().should('.contain', `/remove/${WETH[ChainId.AURORA].address}/${AURORA[ChainId.AURORA].address}`)
  })

  it('eth remove', () => {
    cy.visit(`/remove/ETH/${AURORA[ChainId.AURORA].address}`)
    cy.get('#remove-liquidity-tokena').should('contain.text', 'ETH')
    cy.get('#remove-liquidity-tokenb').should('contain.text', 'AURORA')
  })

  it('eth remove swap order', () => {
    cy.visit(`/remove/${AURORA[ChainId.AURORA].address}/ETH`)
    cy.get('#remove-liquidity-tokena').should('contain.text', 'AURORA')
    cy.get('#remove-liquidity-tokenb').should('contain.text', 'ETH')
  })

  it('loads the two correct tokens', () => {
    cy.visit(`/remove/${WETH[ChainId.AURORA].address}-${AURORA[ChainId.AURORA].address}`)
    cy.get('#remove-liquidity-tokena').should('contain.text', 'WETH')
    cy.get('#remove-liquidity-tokenb').should('contain.text', 'AURORA')
  })

  it('does not crash if ETH is duplicated', () => {
    cy.visit(`/remove/${WETH[ChainId.AURORA].address}-${WETH[ChainId.AURORA].address}`)
    cy.get('#remove-liquidity-tokena').should('contain.text', 'WETH')
    cy.get('#remove-liquidity-tokenb').should('contain.text', 'WETH')
  })

  it('token not in storage is loaded', () => {
    cy.visit(`/remove/${WNEAR[ChainId.AURORA].address}-${AURORA[ChainId.AURORA].address}`)
    cy.get('#remove-liquidity-tokena').should('contain.text', 'wNEAR')
    cy.get('#remove-liquidity-tokenb').should('contain.text', 'AURORA')
  })

  // NOTE - skipped, requires actual added liquidity balances/lp tokens
  it.skip('can remove liquidity from the ETH/USDC defaultswap pool ', () => {
    cy.visit(`/remove/${USDC[ChainId.AURORA].address}/ETH`)
    cy.get('.token-symbol-container')
      .first()
      .should('contain.text', 'USDC')
    cy.get('.token-symbol-container')
      .last()
      .should('contain.text', 'ETH')
    cy.get('#liquidity-amount .token-amount-input').type('0.00000000001', { force: true, delay: 200 })

    cy.get('#defaultswap-remove-liquidity')
      .then($rl => {
        if ($rl.find('#remove-liquidity-approve-button').length) {
          cy.get('#remove-liquidity-approve-button')
            .should('contain.text', 'Approve')
            .click()
            .wait(5000)
        }

        return cy.get('#defaultswap-remove-liquidity')
      })
      .then($rl => {
        cy.get('#remove-liquidity-remove-button')
          .should('contain.text', 'Remove')
          .click()

        if ($rl.find('#confirm-remove-liquidity-button').length) {
          cy.get('#confirm-remove-liquidity-button').click()
        }
      })
  })

  // Stableswap

  it('loads the USDC_USDT stableswap pool by name', () => {
    cy.visit('/pool/stable/remove/USDC_USDT')
    cy.url().should('contain', '/pool/stable/remove/USDC_USDT')
    cy.get('#remove-liquidity-input-tokena .token-symbol-container').should('contain.text', 'USDC')
    cy.get('#remove-liquidity-input-tokenb .token-symbol-container').should('contain.text', 'USDT')
  })

  it('cannot load an invalid stableswap pool by name, redirects to swap page', () => {
    cy.visit('/pool/stable/remove/X_Y')
    cy.url().should('contain', '/swap')
  })

  it('cannot remove liquidity to the USDC_USDT stableswap pool due to insufficient balances', () => {
    cy.visit('/pool')
    cy.get('#stableswap-pool-nav-link')
      .should('contain.text', 'StableSwap AMM')
      .click()
    cy.get('#stableswap-manage-button')
      .should('contain.text', 'Manage')
      .click()
    cy.get('#stableswap-remove-liquidity-button')
      .should('contain.text', 'Remove')
      .should('have.attr', 'disabled')
  })

  // NOTE - skipped, requires actual added liquidity balances/lp tokens
  it.skip('can remove liquidity to the USDC_USDT stableswap pool to all tokens', () => {
    cy.visit('/pool/stable/remove/USDC_USDT')
    cy.url().should('contain', '/pool/stable/remove/USDC_USDT')
    cy.get('#remove-liquidity-input-tokena .token-symbol-container').should('contain.text', 'USDC')
    cy.get('#remove-liquidity-input-tokenb .token-symbol-container').should('contain.text', 'USDT')
    cy.get('#remove-liquidity-balance').should('not.contain.text', 'Balance: 0.00000000')
    cy.get('#stableswap-remove-liquidity .token-amount-input').type('0.000001', { force: true, delay: 200 })

    cy.get('#stableswap-remove-liquidity')
      .wait(2000)
      .then(() => {
        if (cy.get('#remove-liquidity-approve-button').contains('Approve')) {
          if (!cy.get('#remove-liquidity-approve-button[disabled]')) {
            cy.get('#remove-liquidity-approve-button')
              .click()
              .wait(5000)
          }
        }

        return cy.get('#stableswap-remove-liquidity')
      })
      .then(() => {
        cy.get('#stableswap-remove-liquidity-button')
          .should('contain.text', 'Remove Liquidity')
          .click()

        cy.get('div')
          .contains('Confirm')
          .click()
          .wait(5000)

        cy.get('div').contains('Transaction Submitted')
      })
  })

  // NOTE - skipped, requires actual added liquidity balances/lp tokens
  it.skip('can remove liquidity to the USDC_USDT stableswap pool to one token A', () => {
    cy.visit('/pool/stable/remove/USDC_USDT')
    cy.url().should('contain', '/pool/stable/remove/USDC_USDT')
    cy.get('#remove-liquidity-input-tokena .token-symbol-container').should('contain.text', 'USDC')
    cy.get('#remove-liquidity-input-tokenb .token-symbol-container').should('contain.text', 'USDT')
    cy.get('#remove-liquidity-balance').should('not.contain.text', 'Balance: 0.00000000')
    cy.get('#stableswap-remove-liquidity .token-amount-input').type('0.000001', { force: true, delay: 200 })

    cy.get('button')
      .contains('All')
      .next()
      .click()

    cy.get('#stableswap-remove-liquidity')
      .wait(2000)
      .then(() => {
        if (cy.get('#remove-liquidity-approve-button').contains('Approve')) {
          if (!cy.get('#remove-liquidity-approve-button[disabled]')) {
            cy.get('#remove-liquidity-approve-button')
              .click()
              .wait(5000)
          }
        }

        return cy.get('#stableswap-remove-liquidity')
      })
      .then(() => {
        cy.get('#stableswap-remove-liquidity-button')
          .should('contain.text', 'Remove Liquidity')
          .click()

        cy.get('div')
          .contains('Confirm')
          .click()
          .wait(10000)

        cy.get('div').contains('Transaction Submitted')
      })
  })

  // NOTE - skipped, requires actual added liquidity balances/lp tokens
  it.skip('can remove liquidity to the USDC_USDT stableswap pool to one token B', () => {
    cy.visit('/pool/stable/remove/USDC_USDT')
    cy.url().should('contain', '/pool/stable/remove/USDC_USDT')
    cy.get('#remove-liquidity-input-tokena .token-symbol-container').should('contain.text', 'USDC')
    cy.get('#remove-liquidity-input-tokenb .token-symbol-container').should('contain.text', 'USDT')
    cy.get('#remove-liquidity-balance').should('not.contain.text', 'Balance: 0.00000000')
    cy.get('#stableswap-remove-liquidity .token-amount-input').type('0.000001', { force: true, delay: 200 })

    cy.get('button')
      .contains('All')
      .next()
      .next()
      .click()

    cy.get('#stableswap-remove-liquidity')
      .wait(2000)
      .then(() => {
        if (cy.get('#remove-liquidity-approve-button').contains('Approve')) {
          if (!cy.get('#remove-liquidity-approve-button[disabled]')) {
            cy.get('#remove-liquidity-approve-button')
              .click()
              .wait(5000)
          }
        }

        return cy.get('#stableswap-remove-liquidity')
      })
      .then(() => {
        cy.get('#stableswap-remove-liquidity-button')
          .should('contain.text', 'Remove Liquidity')
          .click()

        cy.get('div')
          .contains('Confirm')
          .click()
          .wait(10000)

        cy.get('div').contains('Transaction Submitted')
      })
  })
})
