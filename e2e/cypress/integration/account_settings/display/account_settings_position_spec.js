// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

// ***************************************************************
// - [#] indicates a test step (e.g. # Go to a page)
// - [*] indicates an assertion (e.g. * Check the title)
// - Use element ID when selecting an element. Create one if none.
// ***************************************************************

// Group: @account_setting
import * as TIMEOUTS from '../../../fixtures/timeouts';

describe('Account Settings > General > Position', () => {
    let testTeam;
    let testUser;
    const position = 'Master hacker';

    beforeEach(() => {
        cy.apiAdminLogin();
        cy.apiInitSetup().then(({team, user}) => {
            testTeam = team;
            testUser = user;

            cy.apiLogin(testUser);

            // # Visit town square
            cy.visit(`/${testTeam.name}/channels/town-square`);
        });
    });

    it('MM-T2063 Position', () => {
        // # Open the hamburger menu
        cy.findByLabelText('main menu').should('be.visible').click();

        // # Click on Account settings menu item
        cy.findByText('Account Settings').should('be.visible').click();

        // # Fill-in the position field
        cy.findByText('Position').should('be.visible').click();
        cy.get('#position').type(position);
        cy.get('#saveSetting').click();

        // # Exit the modal
        cy.get('body').type('{esc}', {force: true});

        // # Post message in the main channel
        cy.postMessage('hello from master hacker');

        // # Click on the profile image
        cy.get('.profile-icon > img').as('profileIconForPopover').click();

        // # Verify that the popover is visible
        cy.get('#user-profile-popover').should('be.visible').within(() => {
            // * and contains the entered position
            cy.findByText('Master hacker').should('be.visible');
        });
    });

    it('MM-T2064 Position / 128 characters', () => {
        const longPosition = 'Master Hacker II'.repeat(8);

        // # Open the hamburger menu
        cy.findByLabelText('main menu').should('be.visible').click();

        // # Click on Account settings menu item
        cy.findByText('Account Settings').should('be.visible').click();

        // # Fill-in the position field with a value of 128 characters
        cy.findByText('Position').should('be.visible').click();
        cy.get('#position').type(longPosition);
        cy.get('#saveSetting').click();

        cy.get('#position').invoke('val').then((val) => {
            // # Verify that the input value is 128 characters
            expect(val.length).to.equal(128);
        });

        // # Try to edit the field with maximum characters
        cy.findByText('Position').click();
        cy.wait(TIMEOUTS.ONE_SEC);

        cy.get('#position').focus().type('random');
        cy.get('#position').invoke('val').then((val) => {
            // # Verify that the position hasn't changed
            expect(val).to.equal(longPosition);
        });

        // # Save position
        cy.get('#saveSetting').click();

        // # Exit the modal
        cy.get('body').type('{esc}', {force: true});
    });
});