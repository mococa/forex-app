import "../App.css";
import Header from "../components/Header";
import {TradeProvider} from "../context/TradeContext"
import { useContext } from "react";
import TradeComp from "../components/TradeComp"
import { LinearProgress } from "@material-ui/core";
const Trade:React.FC<{}> = () =>{

  return (
    <>
    <Header/>
    <LinearProgress />
    <div className="App">
      <h1>Trade</h1>
      <TradeProvider>
        <TradeComp/>
      </TradeProvider>
      
    </div>
    </>
  );
}

export default Trade;
