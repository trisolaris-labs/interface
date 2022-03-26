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
})
