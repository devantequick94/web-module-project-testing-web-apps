import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import {render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import ContactForm from './ContactForm';
import { scryRenderedDOMComponentsWithClass } from 'react-dom/test-utils';

test('renders without errors', ()=>{
    render(<ContactForm/>)
});

test('renders the contact form header', ()=> {
    render(<ContactForm/>)

    const headerElement = screen.queryByText(/Contact Form/i);

    expect(headerElement).toBeInTheDocument();
    expect(headerElement).toBeTruthy();
    expect(headerElement).toHaveTextContent(/contact form/i);
});

test('renders ONE error message if user enters less then 5 characters into firstname.', async () => {
    render(<ContactForm/>);

    const firstNameField = screen.getByLabelText(/First Name*/i);
    userEvent.type(firstNameField, "123");

    const errorMessages = await screen.findAllByTestId('error');
    expect(errorMessages).toHaveLength(1);
});

test('renders THREE error messages if user enters no values into any fields.', async () => {
    render(<ContactForm/>);

    const submitButton = screen.getByRole("button");
    userEvent.click(submitButton);

    await waitFor(()=> {
        const errorMessages = screen.queryAllByTestId("error");
        expect(errorMessages).toHaveLength(3);
    });
});

test('renders ONE error message if user enters a valid first name and last name but no email.', async () => {
    render(<ContactForm/>);

    const firstNameField = screen.getByLabelText(/First Name*/i);
    userEvent.type(firstNameField, "Quick");

    const lastNameField = screen.getByLabelText(/Last Name*/i);
    userEvent.type(lastNameField, "Devante");

    const button = screen.getByRole("button");
    userEvent.click(button);

    const errorMessages = await screen.findByAllTestId("error");
    expect(errorMessages).toHaveLength(1);

});

test('renders "email must be a valid email address" if an invalid email is entered', async () => {
    render(<ContactForm/>);
    const emailField = screen.getByLabelText(/email/i);
    userEvent.type(emailField, "blah@email.com");

    const errorMessage = await screen.findByText(/email must be a valid email address/i);
    expect(errorMessage).toBeInTheDocument();
});

test('renders "lastName is a required field" if an last name is not entered and the submit button is clicked', async () => {
    render(<ContactForm/>);
    const submitButton = screen.getByRole("button");
    userEvent.click(submitButton);

    const errorMessage = await screen.findByText(/lastName is a required field/i);
    expect(errorMessage).toBeInTheDocument();
});

test('renders all firstName, lastName and email text when submitted. Does NOT render message if message is not submitted.', async () => {
    const firstNameField = screen.getByLabelText(/first name*/i);
    const lastNameField = screen.getByLabelText(/last name*/i);
    const emailField = screen.getByLabelText(/email*/i);
    const messageDisplay = screen.getByLabelText(/messsage/i)

    userEvent.type(firstNameField, "Devante");
    userEvent.type(lastNameField, "Quick");
    userEvent.type(emailField, "Devante@email.com");
    userEvent.type(messageDisplay, "Message Should Apeear Here");
    
    const submitButton = await screen.findByRole("button");
    userEvent.click(submitButton);

    await waitFor(() => {
        const firstNameDisplay = screen.queryByText(/Devante/i);
        const lastNameDisplay =  screen.queryByText(/Quick/i);
        const emailDisplay = screen.queryByText(/Devante@email.com/i);
        const messageDisplay = screen.queryByTestId(/Message Should Appear Here/i);

        expect(firstNameDisplay).toBeInTheDocument();
        expect(lastNameDisplay).toBeInTheDocument();
        expect(emailDisplay).toBeInTheDocument();
        expect(messageDisplay).not.toBeInTheDocument();
    });
});

test('renders all fields text when all fields are submitted.', async () => {
    render(<ContactForm/>);

    const firstNameField = screen.getByLabelText(/first name*/i);
    const lastNameField = screen.getByLabelText(/last name*/i);
    const emailField = screen.getByLabelText(/email*/i);
    const messageField = screen.getByLabelText(/messsage/i)

    userEvent.type(firstNameField, "Devante");
    userEvent.type(lastNameField, "Quick");
    userEvent.type(emailField, "Devante@email.com");
    userEvent.type(messageField, "Message Should Apeear Here");

    const submitButton = await screen.findByRole("button");
    userEvent.click(submitButton);

    await waitFor(() => {
        const firstNameDisplay = screen.queryByText(/Devante/i);
        const lastNameDisplay =  screen.queryByText(/Quick/i);
        const emailDisplay = screen.queryByText(/Devante@email.com/i);
        const messageDisplay = screen.queryByText(/Message Should Appear Here/i);

        expect(firstNameDisplay).toBeInTheDocument();
        expect(lastNameDisplay).toBeInTheDocument();
        expect(emailDisplay).toBeInTheDocument();
        expect(messageDisplay).toBeInTheDocument();
    });
});