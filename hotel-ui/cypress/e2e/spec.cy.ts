describe('template spec', () => {
  it('passes', () => {
    cy.visit('https://example.cypress.io')
  })
});

describe('Find HTML element', () => {
  it('finds the content "type', ()=>{
    cy.visit('https://example.cypress.io')

    cy.contains('type').click()

    cy.url().should('include', '/commands/actions')

cy.get('.action-email').type('earljoe06@gmail.com', { delay: 100 })

    cy.get('.action-email').should('have.value', 'earljoe06@gmail.com')
  })
})