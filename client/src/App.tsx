import "./App.css";
import {Route, BrowserRouter as Router, Switch} from "react-router-dom";
import Home from './pages/Home'
import Profile from './pages/Profile'
import Authentication from './pages/Authentication'
import Trade from './pages/Trade'
import _404 from './pages/404'
import { UserProvider } from "./context/UserContext"
import EmailConfirmed from "./pages/EmailConfirmed";
import Wallet from "./pages/Wallet";
import Buy from "./pages/Buy";
const App:React.FC<{}> = () =>{
  
  return (
    <div>
      <Router><UserProvider><Switch>
        <Route exact path="/" component={Home}/>
        <Route exact path="/profile" component={Profile}/>
        <Route exact path="/auth" component={Authentication}/>
        <Route exact path="/trade" component={Trade}/>
        <Route exact path="/wallet" component={Wallet}/>
        <Route exact path="/confirmed" component={EmailConfirmed}/>
        <Route exact path="/buy" component={Buy}/>
        <Route path="*" component={_404}/>
      </Switch></UserProvider></Router>
    </div>
  );
}

export default App;
