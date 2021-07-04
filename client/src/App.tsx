import "./App.css";
import {Route, BrowserRouter as Router, Switch} from "react-router-dom";
import Home from './pages/Home'
import Profile from './pages/Profile'
import Authenticate from './pages/Authenticate'
import Trade from './pages/Trade'
import _404 from './pages/404'
import { UserProvider } from "./context/UserContext"
const App:React.FC<{}> = () =>{
  
  return (
    <div>
      <Router><UserProvider><Switch>
        <Route exact path="/" component={Home}/>
        <Route exact path="/profile" component={Profile}/>
        <Route exact path="/auth" component={Authenticate}/>
        <Route exact path="/trade" component={Trade}/>
        <Route path="*" component={_404}/>
      </Switch></UserProvider></Router>
    </div>
  );
}

export default App;
