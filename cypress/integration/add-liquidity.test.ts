describe('Add Liquidity', () => {
  it('loads the two correct tokens', () => {
    cy.visit('/add/0x1d1f82d8b8fc72f29a8c268285347563cb6cd8b3-0xC9BdeEd33CD01541e1eeD10f90519d2C06Fe3feB')
    cy.get('#add-liquidity-input-tokena .token-symbol-container').should('contain.text', 'MKR')
    cy.get('#add-liquidity-input-tokenb .token-symbol-container').should('contain.text', 'WETH')
  })

  it('does not crash if ETH is duplicated', () => {
    cy.visit('/add/0xC9BdeEd33CD01541e1eeD10f90519d2C06Fe3feB-0xC9BdeEd33CD01541e1eeD10f90519d2C06Fe3feB')
    cy.get('#add-liquidity-input-tokena .token-symbol-container').should('contain.text', 'WETH')
    cy.get('#add-liquidity-input-tokenb .token-symbol-container').should('not.contain.text', 'WETH')
  })

  it('token not in storage is loaded', () => {
    cy.visit('/add/0x7821c773a12485b12a2b5b7bc451c3eb200986b1-0x1d1f82d8b8fc72f29a8c268285347563cb6cd8b3')
    cy.get('#add-liquidity-input-tokena .token-symbol-container').should('contain.text', 'SUSHI')
    cy.get('#add-liquidity-input-tokenb .token-symbol-container').should('contain.text', 'MKR')
  })

  it('single token can be selected', () => {
    cy.visit('/add/0x7821c773a12485b12a2b5b7bc451c3eb200986b1')
    cy.get('#add-liquidity-input-tokena .token-symbol-container').should('contain.text', 'SUSHI')
    cy.visit('/add/0x1d1f82d8b8fc72f29a8c268285347563cb6cd8b3')
    cy.get('#add-liquidity-input-tokena .token-symbol-container').should('contain.text', 'MKR')
  })

  it('redirects /add/token-token to add/token/token', () => {
    cy.visit('/add/0x7821c773a12485b12a2b5b7bc451c3eb200986b1-0x1d1f82d8b8fc72f29a8c268285347563cb6cd8b3')
    cy.url().should(
      'contain',
      '/add/0x7821c773a12485b12a2b5b7bc451c3eb200986b1/0x1d1f82d8b8fc72f29a8c268285347563cb6cd8b3'
    )
  })

  it('redirects /add/WETH-token to /add/WETH-address/token', () => {
    cy.visit('/add/0xC9BdeEd33CD01541e1eeD10f90519d2C06Fe3feB-0x1d1f82d8b8fc72f29a8c268285347563cb6cd8b3')
    cy.url().should(
      'contain',
      '/add/0xC9BdeEd33CD01541e1eeD10f90519d2C06Fe3feB/0x1d1f82d8b8fc72f29a8c268285347563cb6cd8b3'
    )
  })

  it('redirects /add/token-WETH to /add/token/WETH-address', () => {
    cy.visit('/add/0x1d1f82d8b8fc72f29a8c268285347563cb6cd8b3-0xC9BdeEd33CD01541e1eeD10f90519d2C06Fe3feB')
    cy.url().should(
      'contain',
      '/add/0x1d1f82d8b8fc72f29a8c268285347563cb6cd8b3/0xC9BdeEd33CD01541e1eeD10f90519d2C06Fe3feB'
    )
  })

  it('loads the USDT_USDC stableswap pool by name', () => {
    cy.visit('/pool/stable/add/USDT_USDC')
    cy.url().should('contain', '/pool/stable/add/USDT_USDC')
    cy.get('#add-liquidity-input-tokena .token-symbol-container').should('contain.text', 'USDT')
    cy.get('#add-liquidity-input-tokenb .token-symbol-container').should('contain.text', 'USDC')
  })

  it('cannot load an invalid stableswap pool by name, redirects to swap page', () => {
    cy.visit('/pool/stable/add/X_Y')
    cy.url().should('contain', '/swap')
  })

  it('cannot add liquidity to the USDT_USDC stableswap pool due to insufficient balances', () => {
    cy.visit('/pool')
    cy.get('#stableswap-pool-nav-link')
      .should('contain.text', 'StableSwap AMM')
      .click()
    cy.get('#stableswap-add-liquidity-button')
      .should('contain.text', 'Add')
      .click()
    cy.wait(300)
      .url()
      .should('contain', '/pool/stable/add/USDT_USDC')
    cy.get('#add-liquidity-input-tokena .token-symbol-container').should('contain.text', 'USDT')
    cy.get('#add-liquidity-input-tokenb .token-symbol-container').should('contain.text', 'USDC')
    cy.get('#add-liquidity-supply-button').should('contain.text', 'Supply')
    cy.get('#add-liquidity-input-tokena .token-amount-input').type('1', { force: true, delay: 200 })
    cy.get('#add-liquidity-supply-button').should('contain.text', 'Insufficient USDT balance')
    cy.get('#add-liquidity-input-tokenb .token-amount-input').type('1', { force: true, delay: 200 })
    cy.get('#add-liquidity-supply-button').should('contain.text', 'Insufficient USDC balance')
  })

  // NOTE - skipped, requires token balances
  it.skip('can add liquidity to the USDT_USDC stableswap pool ', () => {
    cy.visit('/pool')
    cy.get('#stableswap-pool-nav-link')
      .should('contain.text', 'StableSwap AMM')
      .click()
    cy.get('#stableswap-add-liquidity-button')
      .should('contain.text', 'Add')
      .click()
    cy.wait(300)
      .url()
      .should('contain', '/pool/stable/add/USDT_USDC')
    cy.get('#add-liquidity-input-tokena .token-symbol-container').should('contain.text', 'USDT')
    cy.get('#add-liquidity-input-tokenb .token-symbol-container').should('contain.text', 'USDC')
    cy.get('#add-liquidity-input-tokena .token-amount-input').type('1', { force: true, delay: 200 })
    cy.get('#add-liquidity-input-tokenb .token-amount-input').type('1', { force: true, delay: 200 })
    cy.get('#add-liquidity-supply-button')
      .should('contain.text', 'Supply')
      .click()
  })
})
