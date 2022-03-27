describe('Remove Liquidity', () => {
  it('redirects', () => {
    cy.visit('/remove/0xC9BdeEd33CD01541e1eeD10f90519d2C06Fe3feB-0x1d1f82d8b8fc72f29a8c268285347563cb6cd8b3')
    cy.url().should(
      'contain',
      '/remove/0xC9BdeEd33CD01541e1eeD10f90519d2C06Fe3feB/0x1d1f82d8b8fc72f29a8c268285347563cb6cd8b3'
    )
  })

  it('eth remove', () => {
    cy.visit('/remove/ETH/0x1d1f82d8b8fc72f29a8c268285347563cb6cd8b3')
    cy.get('#remove-liquidity-tokena').should('contain.text', 'ETH')
    cy.get('#remove-liquidity-tokenb').should('contain.text', 'MKR')
  })

  it('eth remove swap order', () => {
    cy.visit('/remove/0x1d1f82d8b8fc72f29a8c268285347563cb6cd8b3/ETH')
    cy.get('#remove-liquidity-tokena').should('contain.text', 'MKR')
    cy.get('#remove-liquidity-tokenb').should('contain.text', 'ETH')
  })

  it('loads the two correct tokens', () => {
    cy.visit('/remove/0xC9BdeEd33CD01541e1eeD10f90519d2C06Fe3feB-0x1d1f82d8b8fc72f29a8c268285347563cb6cd8b3')
    cy.get('#remove-liquidity-tokena').should('contain.text', 'WETH')
    cy.get('#remove-liquidity-tokenb').should('contain.text', 'MKR')
  })

  it('does not crash if ETH is duplicated', () => {
    cy.visit('/remove/0xC9BdeEd33CD01541e1eeD10f90519d2C06Fe3feB-0xC9BdeEd33CD01541e1eeD10f90519d2C06Fe3feB')
    cy.get('#remove-liquidity-tokena').should('contain.text', 'WETH')
    cy.get('#remove-liquidity-tokenb').should('contain.text', 'WETH')
  })

  it('token not in storage is loaded', () => {
    cy.visit('/remove/0x7821c773a12485b12a2b5b7bc451c3eb200986b1-0x1d1f82d8b8fc72f29a8c268285347563cb6cd8b3')
    cy.get('#remove-liquidity-tokena').should('contain.text', 'SUSHI')
    cy.get('#remove-liquidity-tokenb').should('contain.text', 'MKR')
  })

  it('loads the USDT_USDC stableswap pool by name', () => {
    cy.visit('/pool/stable/remove/USDT_USDC')
    cy.url().should('contain', '/pool/stable/remove/USDT_USDC')
    cy.get('#remove-liquidity-input-tokena .token-symbol-container').should('contain.text', 'USDT')
    cy.get('#remove-liquidity-input-tokenb .token-symbol-container').should('contain.text', 'USDC')
  })

  it('cannot load an invalid stableswap pool by name, redirects to swap page', () => {
    cy.visit('/pool/stable/remove/X_Y')
    cy.url().should('contain', '/swap')
  })

  it('cannot remove liquidity to the USDT_USDC stableswap pool due to insufficient balances', () => {
    cy.visit('/pool')
    cy.get('#stableswap-pool-nav-link')
      .should('contain.text', 'StableSwap AMM')
      .click()
    cy.get('#stableswap-remove-liquidity-button')
      .should('contain.text', 'Remove')
      .should('have.attr', 'disabled')
  })

  // NOTE - skipped, requires actual added liquidity balances/lp tokens
  it.skip('can remove liquidity to the USDT_USDC stableswap pool ', () => {
    cy.visit('/pool/stable/remove/USDT_USDC')
    cy.url().should('contain', '/pool/stable/remove/USDT_USDC')
    // cy.visit('/pool')
    // cy.get('#stableswap-pool-nav-link')
    //   .should('contain.text', 'StableSwap AMM')
    //   .click()
    // cy.get('#stable-swap-remove-liquidity')
    //   .should('contain.text', 'remove')
    //   .click()
    cy.wait(300)
      .url()
      .should('contain', '/pool/stable/remove/USDT_USDC')
    cy.get('#remove-liquidity-input-tokena .token-symbol-container').should('contain.text', 'USDT')
    cy.get('#remove-liquidity-input-tokenb .token-symbol-container').should('contain.text', 'USDC')
    cy.get('#remove-liquidity-balance').should('not.contain.text', 'Balance: 0')
    cy.get('#stableswap-remove-liquidity .token-amount-input').type('1', { force: true, delay: 200 })
    cy.get('#stableswap-remove-liquidity')
      .then($rl => {
        if ($rl.find('#remove-liquidity-approve-button').length) {
          cy.get('#remove-liquidity-approve-button')
            .should('contain.text', 'Approve')
            .click()
            .wait(5000)
        }
      })
      .then(() => {
        cy.get('#remove-liquidity-remove-liquidity-button')
          .should('contain.text', 'Remove Liquidity')
          .click()
          .wait(5000)
      })
  })
})
