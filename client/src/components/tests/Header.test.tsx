import Header from "../Header";
import { Hoverable } from "../Hoverable";
import {render, screen} from "@testing-library/react"
import { Popover } from "@material-ui/core";
import { createMount } from '@material-ui/core/test-utils';
import "@testing-library/jest-dom/extend-expect"



describe("Header component", ()=>{
    render(<Header />);
    test("Check title", ()=>{
        const linkElement = screen.getByText(/Forex/i);
        expect(linkElement).toBeInTheDocument();
    })
})