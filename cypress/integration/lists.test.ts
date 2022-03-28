describe('Lists', () => {
  beforeEach(() => {
    cy.visit('/swap')
  })

  it('defaults to Aurora list', () => {
    cy.get('#swap-currency-output .open-currency-select-button').click()
    cy.get('#currency-search-selected-list-name').should('contain', 'Aurora')
  })

  it('change list', () => {
    cy.get('#swap-currency-output .open-currency-select-button').click()
    cy.get('#currency-search-change-list-button').click()
    cy.get('#toggle-expert-mode-button').first().within(() => {
      cy.get('span').contains('On').click()
    })
    cy.get('#list-add-input').type('https://tokenlist.aave.eth.link/')
    cy.get('button').contains('Add').click()
    cy.get('div').contains('Manage Lists').next().click()
    cy.get('#swap-currency-output .open-currency-select-button').click()
    cy.get('.token-item-ETH').siblings().should('have.length', 0)
  })
})
