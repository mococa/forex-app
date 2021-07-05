import {render, screen} from "@testing-library/react"
import "@testing-library/jest-dom/extend-expect"
import Authenticate from "../Authenticate"
import { BrowserRouter as Router, Route } from "react-router-dom";
import { UserProvider } from "../../context/UserContext";


describe("Authenticate Page", ()=>{
    const {getByTestId} =render(<Router><UserProvider><Route component={Authenticate} /></UserProvider></Router>);
    test("Checking Authenticate content", ()=>{
        const linkElement = getByTestId("login-text")
        expect(linkElement).toBeInTheDocument();
        const linkElement2 = screen.getByText(/register/i);
        expect(linkElement2).toBeInTheDocument();
    })
})