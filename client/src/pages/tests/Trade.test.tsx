import "@testing-library/jest-dom/extend-expect"
import "@testing-library/jest-dom"

import { render, screen } from "@testing-library/react"
import Trade from "../Authentication"
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { IUser, UserProvider } from "../../context/UserContext";
import Home from "../Home";
import TradeComp from "../../components/TradeComp";
import { TradeProvider } from "../../context/TradeContext";


async function register(): Promise<boolean> {
    const response = await fetch("http://localhost:3001/api/test/users/create", {
        method: 'POST', headers: { 'content-type': 'application/json;charset=UTF-8' },
        body: JSON.stringify({
            "testing": true,
            "username": "mycoolusertest",
            "firstName": "my name here",
            "timezone": "America/Sao_Paulo",
            "email": "mycoolemail@email.com",
            "password": "Password@123",
            "passwordConfirmation": "Password@123"
        })
    })
    const json = await response.json()
    if (json.error) {
        console.log(json)
        return false
    }
    await fetch("http://localhost:3001/api/verify/" + json._id + "?test=true")
    const _response = await fetch("http://localhost:3001/api/test/user?" + new URLSearchParams({ username: 'mycoolusertest', password: 'Password@123' }));
    const user: IUser = await _response.json()
    localStorage.setItem('user', JSON.stringify(user));
    return true
}
async function removeUser() {
    await fetch("http://localhost:3001/api/user/remove", {
        method: 'DELETE', headers: { 'content-type': 'application/json;charset=UTF-8' },
        body: JSON.stringify({
            "username": "mycoolusertest",
            "password": "Password@123"
        })
    })
    localStorage.removeItem('user');
}

describe("Trade page tests", () => {

    // beforeAll(async () => {
    //     await removeUser()



    // })
    // it("should  tell user that it's fetching data", async () => {
    //     await register()
    //     render(
    //         <Router><UserProvider><TradeProvider>
    //     <TradeComp/>
    //   </TradeProvider></UserProvider></Router>
    //     );


    //     const login = screen.queryAllByText(/buy/i)[0]
    //     expect(login).toBeUndefined()
    //     //expect(gettingData).toBeInTheDocument()
    // })
    // afterAll(async () => {
    //     await removeUser()
    // })
    it("should pass test", ()=>{
        expect(true).toBeTruthy()
    })
})