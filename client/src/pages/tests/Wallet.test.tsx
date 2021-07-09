import { render, screen, act, waitForElementToBeRemoved } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import "@testing-library/jest-dom/extend-expect"
import Wallet from "../Wallet"
import { BrowserRouter as Router, Route } from "react-router-dom";
import { IUser, UserContext, UserProvider } from "../../context/UserContext";
import { useContext } from "react";

async function createUser(): Promise<boolean> {
    const response = await fetch("http://localhost:3001/api/test/users/create", {
        method: 'POST', headers: { 'content-type': 'application/json;charset=UTF-8' },
        body: JSON.stringify({
            "testing": true,
            "username": "usertest",
            "firstName": "my name here",
            "timezone": "America/Sao_Paulo",
            "email": "myemail",
            "password": "123",
            "passwordConfirmation": "123"
        })
    })
    const json = await response.json()
    //VERIFY
    await fetch("http://localhost:3001/api/verify/"+json._id+"?test=true")
    if (json.error) {
        console.log(json)
        return false
    }
    const _response = await fetch("http://localhost:3001/api/test/user?" + new URLSearchParams({ username: 'usertest', password: '123' }));
    const user: IUser = await _response.json()
    localStorage.setItem('user', JSON.stringify(user));
    return true
}
async function removeUser() {
    await fetch("http://localhost:3001/api/user/remove", {
        method: 'DELETE', headers: { 'content-type': 'application/json;charset=UTF-8' },
        body: JSON.stringify({
            "username": "usertest",
            "password": "123"
        })
    })
    localStorage.removeItem('user');
}
async function pushTrade() {
    const stringUser = localStorage.getItem('user') || '{}'
    const user = JSON.parse(stringUser)
    const id = user._id as string;
    const response = await fetch("http://localhost:3001/api/trade", {
        method: 'POST', headers: { 'content-type': 'application/json;charset=UTF-8' },
        body: JSON.stringify({
            trade: {
                value: -1.38,
                from: "USD",
                to: "GBP"
            },
            _id: id,
            buy:true
        })
    })
    const _user = await response.json()
    
    localStorage.setItem('user', JSON.stringify(_user))
}
async function purchase() {
    await fetch("http://localhost:3001/api/user/buy", {
        method: 'POST', headers: { 'content-type': 'application/json;charset=UTF-8' },
        body: JSON.stringify({
            username: "usertest",
            password: "123",
            name: "usertestname",
            amount: "5",
            coin: "USD"
        })
    })
}


describe("Wallet Page", () => {
    beforeAll(async () => {
        await removeUser()
    })
    it("shoulld check if user was created", async () => {
        const user = await createUser()
        expect(user).toBeTruthy()
    })

    it("should check if there's the initial 10$ in user wallet", () => {
        render(<Router><UserProvider><Route component={Wallet} /></UserProvider></Router>);
        expect(screen.getAllByRole("wallet-card-currency").length == 2)
        screen.getAllByRole("wallet-card-value").forEach(element => {
            expect(element.textContent === "10")
        });
    })
    it("should expect user not to have any past trades", () => {
        render(<Router><UserProvider><Route component={Wallet} /></UserProvider></Router>);
        expect(screen.getByRole("no-trade")).toBeInTheDocument()
    })
    it("should show a \"Buy more\" button", async () => {

        render(<Router><UserProvider><Route component={Wallet} /></UserProvider></Router>);
        screen.getAllByRole("wallet-card").forEach(element => {
            userEvent.click(element)
            expect(screen.getByText("Buy more here")).toBeInTheDocument()
        });
    })
    it("should change wallet content after a trade", async () => {
        await pushTrade()
        render(<Router><UserProvider><Route component={Wallet} /></UserProvider></Router>);
        
        expect(screen.getAllByRole("wallet-card-value").length > 0).toBeTruthy()
        expect(screen.getByTestId("activities")).toBeInTheDocument()
        screen.getAllByRole("wallet-card-value").forEach(element => {
            expect(element.textContent !== "10")
        });
    })
    it("should change wallet content after a purchase", async () => {
        await purchase();
        render(<Router><UserProvider><Route component={Wallet} /></UserProvider></Router>);
        const walletCardValues = screen.getAllByRole("wallet-card-value")
        expect(walletCardValues.some(x => x.textContent === "16"))
    })
    afterAll(async()=>{
        await removeUser()
    })

})
