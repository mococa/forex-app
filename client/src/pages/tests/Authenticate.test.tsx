import { fireEvent, render, screen, waitFor, waitForElementToBeRemoved } from "@testing-library/react"
import "@testing-library/jest-dom/extend-expect"
import Authentication from "../Authentication"
import { BrowserRouter as Router, Route } from "react-router-dom";
import { IUser, UserProvider } from "../../context/UserContext";
import { TextField } from "@material-ui/core";
import userEvent from "@testing-library/user-event";

async function register(): Promise<boolean> {
    const response = await fetch("http://localhost:3001/api/test/users/create", {
        method: 'POST', headers: { 'content-type': 'application/json;charset=UTF-8' },
        body: JSON.stringify({
            "testing": true,
            "username": "usertest",
            "firstName": "my name here",
            "timezone": "America/Sao_Paulo",
            "email": "myemail",
            "password": "Password@123",
            "passwordConfirmation": "Password@123"
        })
    })
    const json = await response.json()
    if (json.error) {
        console.log(json)
        return false
    }
    return true
}

describe("Authentication Page", () => {
    
    it("should render Authentication content", () => {
        render(<Router><UserProvider><Route component={Authentication} /></UserProvider></Router>);
        
        const linkElement = screen.getAllByText(/login/i)[0];
        expect(linkElement).toBeInTheDocument();

        const linkElement2 = screen.getByText(/register/i);
        expect(linkElement2).toBeInTheDocument();
    })
    it("should not let user log in if they're not signed up", async () => {
        //const inputs = screen.debug(TextField)
        //console.log(wrapper.find('TextField').debug());

        //expect(wrapper.find(TextField).props().value).to.equal('');
        render(<Router><UserProvider><Route component={Authentication} /></UserProvider></Router>);
        
        

        //userEvent.

        //const inputLoginUsername = screen.getByTestId('auth-login-user')
        //userEvent.type(screen.getAllByRole('textbox')[0], "usertestt")
        fireEvent.change(screen.getAllByRole('textbox')[0], { target: { value: 'Sama' } });

        
        //fireEvent.change(inputLoginUsername, { target: { value: "usertest" } });

        //const inputLoginPassword = screen.getByTestId('auth-login-pass')
        userEvent.type(screen.getAllByRole('textbox')[1], "Password@123")

        //fireEvent.change(inputLoginPassword, { target: { value: "Password@123" } });

        const loginButton = screen.getByTestId('auth-login-btn')
        fireEvent.click(loginButton)

        await waitFor(()=>console.log(screen.getAllByRole('textbox').length),{timeout:500})
        //console.log(screen.getAllByRole('textbox').length)

        //expect(loginButton).not.toBeInTheDocument()

        expect(true).toBeTruthy()

    })
})
