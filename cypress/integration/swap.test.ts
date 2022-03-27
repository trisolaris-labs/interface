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

  it('cannot default swap ETH for USDC due to insufficient balance', () => {
    cy.get('#swap-currency-output .open-currency-select-button').click()
    cy.get('#token-search-input').type('usdc')
    cy.get('.token-item-0xB12BFcA5A55806AaF64E99521918A4bf0fC40802').should('be.visible')
    cy.get('.token-item-0xB12BFcA5A55806AaF64E99521918A4bf0fC40802').click({ force: true })
    cy.get('#swap-currency-input .token-amount-input').should('be.visible')
    cy.get('#swap-currency-input .token-amount-input').type('0.001', { force: true, delay: 200 })
    cy.get('#swap-currency-output .token-amount-input').should('not.equal', '')
    cy.get('#swap-routed-via').should('contain', 'Default AMM')
    cy.get('#swap-button').should('contain', 'Insufficient ETH balance')
  })

  // NOTE - Depends on stableswap liquidity and quotes hence skipped
  it.skip('cannot default swap USDT for USDC due to insufficient balance', () => {
    cy.get('#swap-currency-input .open-currency-select-button').click()
    cy.get('#token-search-input').type('usdt')
    cy.get('.token-item-0x4988a896b1227218e4A686fdE5EabdcAbd91571f').should('be.visible')
    cy.get('.token-item-0x4988a896b1227218e4A686fdE5EabdcAbd91571f').click({ force: true })

    cy.get('#swap-currency-output .open-currency-select-button').click()
    cy.get('#token-search-input').type('usdc')
    cy.get('.token-item-0xB12BFcA5A55806AaF64E99521918A4bf0fC40802').should('be.visible')
    cy.get('.token-item-0xB12BFcA5A55806AaF64E99521918A4bf0fC40802').click({ force: true })

    cy.get('#swap-currency-input .token-amount-input').should('be.visible')
    cy.get('#swap-currency-input .token-amount-input').type('5000', { force: true, delay: 200 })
    cy.get('#swap-currency-output .token-amount-input').should('not.equal', '')
    cy.get('#swap-routed-via').should('contain', 'Default AMM')
    cy.get('#swap-button').should('contain', 'Insufficient USDT balance')
  })

  it('cannot stable swap USDT for USDC due to insufficient balance', () => {
    cy.get('#swap-currency-input .open-currency-select-button').click()
    cy.get('#token-search-input').type('usdt')
    cy.get('.token-item-0x4988a896b1227218e4A686fdE5EabdcAbd91571f').should('be.visible')
    cy.get('.token-item-0x4988a896b1227218e4A686fdE5EabdcAbd91571f').click({ force: true })

    cy.get('#swap-currency-output .open-currency-select-button').click()
    cy.get('#token-search-input').type('usdc')
    cy.get('.token-item-0xB12BFcA5A55806AaF64E99521918A4bf0fC40802').should('be.visible')
    cy.get('.token-item-0xB12BFcA5A55806AaF64E99521918A4bf0fC40802').click({ force: true })

    cy.get('#swap-currency-input .token-amount-input').should('be.visible')
    cy.get('#swap-currency-input .token-amount-input').type('0.05', { force: true, delay: 200 })
    cy.get('#swap-currency-output .token-amount-input').should('not.equal', '')
    cy.get('#swap-routed-via').should('contain', 'Stable AMM')
    cy.get('#swap-button').should('contain', 'Insufficient USDT balance')
  })

  it('cannot stable swap USDC for USDT due to insufficient balance', () => {
    cy.get('#swap-currency-input .open-currency-select-button').click()
    cy.get('#token-search-input').type('usdc')
    cy.get('.token-item-0xB12BFcA5A55806AaF64E99521918A4bf0fC40802').should('be.visible')
    cy.get('.token-item-0xB12BFcA5A55806AaF64E99521918A4bf0fC40802').click({ force: true })

    cy.get('#swap-currency-output .open-currency-select-button').click()
    cy.get('#token-search-input').type('usdt')
    cy.get('.token-item-0x4988a896b1227218e4A686fdE5EabdcAbd91571f').should('be.visible')
    cy.get('.token-item-0x4988a896b1227218e4A686fdE5EabdcAbd91571f').click({ force: true })

    cy.get('#swap-currency-input .token-amount-input').should('be.visible')
    cy.get('#swap-currency-input .token-amount-input').type('0.05', { force: true, delay: 200 })
    cy.get('#swap-currency-output .token-amount-input').should('not.equal', '')
    cy.get('#swap-routed-via').should('contain', 'Stable AMM')
    cy.get('#swap-button').should('contain', 'Insufficient USDC balance')
  })

  // NOTE - depends on private key balance
  it.skip('can default swap ETH for USDC', () => {
    cy.get('#swap-currency-output .open-currency-select-button').click()
    cy.get('#token-search-input').type('usdc')
    cy.get('.token-item-0xB12BFcA5A55806AaF64E99521918A4bf0fC40802').should('be.visible')
    cy.get('.token-item-0xB12BFcA5A55806AaF64E99521918A4bf0fC40802').click({ force: true })
    cy.get('#swap-currency-input .token-amount-input').should('be.visible')
    cy.get('#swap-currency-input .token-amount-input').type('0.001', { force: true, delay: 200 })
    cy.get('#swap-currency-output .token-amount-input').should('not.equal', '')
    cy.get('#swap-routed-via').should('contain', 'Default AMM')
    cy.get('#swap-button').click()
    cy.get('#confirm-swap-or-send').should('contain', 'Confirm Swap')
  })

  // NOTE - depends on private key balance
  it.skip('can stable swap USDT for USDC', () => {
    cy.get('#swap-currency-input .open-currency-select-button').click()
    cy.get('#token-search-input').type('usdt')
    cy.get('.token-item-0x4988a896b1227218e4A686fdE5EabdcAbd91571f').should('be.visible')
    cy.get('.token-item-0x4988a896b1227218e4A686fdE5EabdcAbd91571f').click({ force: true })

    cy.get('#swap-currency-output .open-currency-select-button').click()
    cy.get('#token-search-input').type('usdc')
    cy.get('.token-item-0xB12BFcA5A55806AaF64E99521918A4bf0fC40802').should('be.visible')
    cy.get('.token-item-0xB12BFcA5A55806AaF64E99521918A4bf0fC40802').click({ force: true })

    cy.get('#swap-currency-input .token-amount-input').should('be.visible')
    cy.get('#swap-currency-input .token-amount-input').type('0.05', { force: true, delay: 200 })
    cy.get('#swap-currency-output .token-amount-input').should('not.equal', '')
    cy.get('#swap-routed-via').should('contain', 'Stable AMM')

    cy.get('#swap-button').click()
    cy.get('#confirm-swap-or-send').should('contain', 'Confirm Swap')
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
