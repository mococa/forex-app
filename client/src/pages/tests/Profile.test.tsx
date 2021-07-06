import {render} from "@testing-library/react"
import "@testing-library/jest-dom/extend-expect"
import Profile from "../Profile"
import { BrowserRouter as Router, Route } from "react-router-dom";
import { IUser, UserProvider } from "../../context/UserContext";



describe("Profile Page", ()=>{
    beforeAll(()=>{
        const userInit:IUser = {wallet:{USD:10,GBP:10},timezone:"America/Sao_Paulo",verified:true,_id:"60e126c017581c4aff08605e",username:"testusername",email:"test@gmail.com",firstName:"Test",trades:[]}
        localStorage.setItem('user', JSON.stringify(userInit))
    })
    test("Checking Profile content", ()=>{
    
    const {getByTestId} =render(
        <Router>
            <UserProvider>
                <Route component={Profile} />
            </UserProvider>
        </Router>);
    const linkElement = getByTestId("profile-text")
    expect(linkElement).toBeInTheDocument();
    const linkElement2 = getByTestId("profile-username")
    expect(linkElement2).toBeInTheDocument();
    expect(linkElement2).toHaveTextContent("testusername")
    const linkElement3 = getByTestId("profile-firstName-value")
    expect(linkElement3).toBeInTheDocument();
    
    
    })
})