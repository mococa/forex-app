import "@testing-library/jest-dom/extend-expect"
import "@testing-library/jest-dom"
import { createMount } from "@material-ui/core/test-utils";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

import { fireEvent, render, screen, waitFor, waitForElementToBeRemoved } from "@testing-library/react"
import Authentication from "../Authentication"
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { IUser, UserProvider } from "../../context/UserContext";
import { TextField } from "@material-ui/core";
import userEvent from "@testing-library/user-event";
import Home from "../Home";

async function register(): Promise<boolean> {
    const response = await fetch("http://localhost:3001/api/test/users/create", {
        method: 'POST', headers: { 'content-type': 'application/json;charset=UTF-8' },
        body: JSON.stringify({
            "testing": true,
            "username": "myusertest",
            "firstName": "my name here",
            "timezone": "America/Sao_Paulo",
            "email": "myemail@email.com",
            "password": "Password@123",
            "passwordConfirmation": "Password@123"
        })
    })
    const json = await response.json()
    if (json.error) {
        console.log(json)
        return false
    }
    await fetch("http://localhost:3001/api/verify/"+json._id+"?test=true")
    const _response = await fetch("http://localhost:3001/api/test/user?" + new URLSearchParams({ username: 'usertest', password: '123' }));
    const user: IUser = await _response.json()
    localStorage.setItem('user', JSON.stringify(user));
    return true
}
async function removeUser() {
    await fetch("http://localhost:3001/api/user/remove", {
        method: 'DELETE', headers: { 'content-type': 'application/json;charset=UTF-8' },
        body: JSON.stringify({
            "username": "myusertest",
            "password": "Password@123"
        })
    })
    localStorage.removeItem('user');
}

describe("Authentication Page", () => {
    beforeAll(async()=>{
        await removeUser()
    })
    it("should render Authentication content", () => {
        render(<Router><UserProvider><Route component={Authentication} /></UserProvider></Router>);
        
        const linkElement = screen.getAllByText(/login/i)[0];
        expect(linkElement).toBeInTheDocument();

        const linkElement2 = screen.getByText(/register/i);
        expect(linkElement2).toBeInTheDocument();
    })
    it("should only let user log in if they're not logged in", () => {
        render(<Router><UserProvider><Route component={Authentication} /><Route component={Home} /></UserProvider></Router>);
        const login = screen.getAllByText(/login/i)[0]
        expect(login).toBeInTheDocument()
    })
    it("should not let user log in if they're logged in", async () => {
        await register()
        render(<Router><UserProvider><Switch>
            <Route exact path="/" component={Home}/>
            <Route exact path="/auth" component={Authentication}/>
            </Switch>
            </UserProvider></Router>);
        const login = screen.queryAllByText(/login/i)[0]
        expect(login).toBeUndefined()
    })
    afterAll(async()=>{
        await removeUser()
    })
})
