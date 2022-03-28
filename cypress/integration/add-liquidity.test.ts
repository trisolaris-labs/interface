import { WETH, ChainId } from '@trisolaris/sdk'
import { AURORA, USDC, USDT, WNEAR } from '../../src/constants/tokens'

describe('Add Liquidity', () => {
  it('loads the two correct tokens', () => {
    cy.visit(`/add/${AURORA[ChainId.AURORA].address}-${WETH[ChainId.AURORA].address}`)
    cy.get('#add-liquidity-input-tokena .token-symbol-container').should('contain.text', 'AURORA')
    cy.get('#add-liquidity-input-tokenb .token-symbol-container').should('contain.text', 'WETH')
  })

  it('does not crash if ETH is duplicated', () => {
    cy.visit(`/add/${WETH[ChainId.AURORA].address}-${WETH[ChainId.AURORA].address}`)
    cy.get('#add-liquidity-input-tokena .token-symbol-container').should('contain.text', 'WETH')
    cy.get('#add-liquidity-input-tokenb .token-symbol-container').should('not.contain.text', 'WETH')
  })

  it('token not in storage is loaded', () => {
    cy.visit(`/add/${WNEAR[ChainId.AURORA].address}-${AURORA[ChainId.AURORA].address}`)
    cy.get('#add-liquidity-input-tokena .token-symbol-container').should('contain.text', 'wNEAR')
    cy.get('#add-liquidity-input-tokenb .token-symbol-container').should('contain.text', 'AURORA')
  })

  it('single token can be selected', () => {
    cy.visit(`/add/${WNEAR[ChainId.AURORA].address}`)
    cy.get('#add-liquidity-input-tokena .token-symbol-container').should('contain.text', 'wNEAR')
    cy.visit(`/add/${AURORA[ChainId.AURORA].address}`)
    cy.get('#add-liquidity-input-tokena .token-symbol-container').should('contain.text', 'AURORA')
  })

  it('redirects /add/token-token to add/token/token', () => {
    cy.visit(`/add/${WNEAR[ChainId.AURORA].address}-${AURORA[ChainId.AURORA].address}`)
    cy.url().should('contain', `/add/${WNEAR[ChainId.AURORA].address}/${AURORA[ChainId.AURORA].address}`)
  })

  it('redirects /add/WETH-token to /add/WETH-address/token', () => {
    cy.visit(`/add/${WETH[ChainId.AURORA].address}-${AURORA[ChainId.AURORA].address}`)
    cy.url().should('contain', `/add/${WETH[ChainId.AURORA].address}/${AURORA[ChainId.AURORA].address}`)
  })

  it('redirects /add/token-WETH to /add/token/WETH-address', () => {
    cy.visit(`/add/${AURORA[ChainId.AURORA].address}-${WETH[ChainId.AURORA].address}`)
    cy.url().should('contain', `/add/${AURORA[ChainId.AURORA].address}/${WETH[ChainId.AURORA].address}`)
  })

  // NOTE - skipped, requires token balances
  it.skip('can add liquidity to the ETH/USDC defaultswap pool ', () => {
    cy.visit('/pool')
    cy.get('#join-pool-button')
      .should('contain.text', 'Add liquidity')
      .click()
    cy.wait(300)
      .url()
      .should('contain', '/add/ETH')
    cy.get('#add-liquidity-input-tokena .token-symbol-container').should('contain.text', 'ETH')
    cy.get('#add-liquidity-input-tokenb .open-currency-select-button').click()
    cy.get('#token-search-input').type('usdc', { force: true, delay: 200 })
    cy.get(`.token-item-${USDC[ChainId.AURORA].address}`).click()
    cy.get('#add-liquidity-input-tokena .token-amount-input').type('0.00001', { force: true, delay: 200 })
    cy.get('#defaultswap-add-liquidity')
      .then($rl => {
        if ($rl.find('#add-liquidity-approve-button-a').length) {
          cy.get('#add-liquidity-approve-button-a')
            .should('contain.text', 'Approve')
            .click()
            .wait(5000)
        }
        return cy.get('#defaultswap-add-liquidity')
      })
      .then($rl => {
        if ($rl.find('#add-liquidity-approve-button-b').length) {
          cy.get('#add-liquidity-approve-button-b')
            .should('contain.text', 'Approve')
            .click()
            .wait(5000)
        }
        return cy.get('#defaultswap-add-liquidity')
      })
      .then($rl => {
        cy.get('#add-liquidity-supply-button')
          .should('contain.text', 'Supply')
          .click()

        if ($rl.find('#confirm-add-liquidity-button').length) {
          cy.get('#confirm-add-liquidity-button').click()
        }
      })
  })

  // STABLESWAP

  it('loads the USDC_USDT stableswap pool by name', () => {
    cy.visit('/pool/stable/add/USDC_USDT')
    cy.url().should('contain', '/pool/stable/add/USDC_USDT')
  })

  it('cannot load an invalid stableswap pool by name, redirects to swap page', () => {
    cy.visit('/pool/stable/add/X_Y')
    cy.url().should('contain', '/pool/stable')
  })

  it('cannot add liquidity to the USDC_USDT stableswap pool due to insufficient balances', () => {
    cy.visit('/pool/stable/add/USDC_USDT')
    cy.wait(300)
      .url()
      .should('contain', '/pool/stable/add/USDC_USDT')
    cy.get('#add-liquidity-input-tokena .token-symbol-container').should('contain.text', 'USDC')
    cy.get('#add-liquidity-input-tokenb .token-symbol-container').should('contain.text', 'USDT')
    cy.get('#add-liquidity-supply-button').should('contain.text', 'Supply')
    cy.get('#add-liquidity-input-tokena .token-amount-input').type('1', { force: true, delay: 200 })
    cy.get('#add-liquidity-supply-button').should('contain.text', 'Insufficient USDC balance')
    cy.get('#add-liquidity-input-tokenb .token-amount-input').type('1', { force: true, delay: 200 })
    cy.get('#add-liquidity-supply-button').should('contain.text', 'Insufficient USDT balance')
  })

  // NOTE - skipped, requires token balances
  it.skip('can add liquidity to the USDC_USDT stableswap pool ', () => {
    cy.visit('/pool')
    cy.get('#stableswap-pool-nav-link')
      .should('contain.text', 'StableSwap AMM')
      .click()
    cy.get('#stableswap-manage-button')
      .should('contain.text', 'Manage')
      .click()
    cy.get('#stableswap-add-liquidity-button')
      .should('contain.text', 'Add')
      .click()
    cy.wait(300)
      .url()
      .should('contain', '/pool/stable/add/USDC_USDT')
    cy.get('#add-liquidity-input-tokena .token-symbol-container').should('contain.text', 'USDC')
    cy.get('#add-liquidity-input-tokenb .token-symbol-container').should('contain.text', 'USDT')
    cy.get('#add-liquidity-input-tokena .token-amount-input').type('1', { force: true, delay: 200 })
    cy.get('#add-liquidity-input-tokenb .token-amount-input').type('1', { force: true, delay: 200 })

    cy.get('#stableswap-add-liquidity')
      .then($rl => {
        if ($rl.find('#add-liquidity-approve-button-a').length) {
          cy.get('#add-liquidity-approve-button-a')
            .should('contain.text', 'Approve')
            .click()
            .wait(5000)
        }
        return cy.get('#stableswap-add-liquidity')
      })
      .then($rl => {
        if ($rl.find('#add-liquidity-approve-button-b').length) {
          cy.get('#add-liquidity-approve-button-b')
            .should('contain.text', 'Approve')
            .click()
            .wait(5000)
        }
        return cy.get('#stableswap-add-liquidity')
      })
      .then($rl => {
        cy.get('#add-liquidity-supply-button')
          .should('contain.text', 'Supply')
          .click()

        if ($rl.find('#confirm-add-liquidity-button').length) {
          cy.get('#confirm-add-liquidity-button').click()
        }
      })

    cy.get('#add-liquidity-supply-button')
      .should('contain.text', 'Supply')
      .click()
  })
})
