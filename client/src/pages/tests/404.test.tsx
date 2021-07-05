import {render, screen} from "@testing-library/react"
import "@testing-library/jest-dom/extend-expect"
import _404 from "../404"
import { BrowserRouter as Router, Route } from "react-router-dom";
import { UserProvider } from "../../context/UserContext";


describe("404 Page", ()=>{
    render(<Router><UserProvider><Route component={_404} /></UserProvider></Router>);
    test("Checking 404 content", ()=>{
        const linkElement = screen.getByText(/404/i);
        expect(linkElement).toBeInTheDocument();
    })
})