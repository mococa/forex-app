import {render, screen} from "@testing-library/react"
import "@testing-library/jest-dom/extend-expect"
import EmailConfirmed from "../EmailConfirmed"
import { BrowserRouter as Router, Route } from "react-router-dom";
import { UserProvider } from "../../context/UserContext";


describe("EmailConfirmed Page", ()=>{
    const {getByTestId} =render(<Router><UserProvider><Route component={EmailConfirmed} /></UserProvider></Router>);
    test("Checking EmailConfirmed content", ()=>{
        const linkElement = getByTestId("congratulations-text")
        expect(linkElement).toBeInTheDocument();
    })
})