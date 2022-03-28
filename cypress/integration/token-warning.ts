describe('Warning', () => {
  beforeEach(() => {
    cy.visit('/swap?outputCurrency=0x7821c773a12485b12a2b5b7bc451c3eb200986b1')
  })

  it('Check that warning is displayed', () => {
    cy.get('.token-warning-container').should('be.visible')
  })

  it('Check that warning hides after button dismissal', () => {
    cy.get('.token-dismiss-button').should('be.disabled')
    cy.get('.understand-checkbox').click()
    cy.get('.token-dismiss-button').should('not.be.disabled')
    cy.get('.token-dismiss-button').click()
    cy.get('.token-warning-container').should('not.exist')
  })
})
