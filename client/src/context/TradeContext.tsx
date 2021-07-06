import "../App.css";
import {  useEffect, useReducer, useContext, createContext } from "react";
import { UserContext } from "../context/UserContext";
import {io, Socket} from 'socket.io-client';

type Props = {
    children?: JSX.Element | JSX.Element[],
};
export interface ITrade {
  symbol:string;
  ts:string;
  bid:number;
  ask:number;
  mid:number;
  time?:string;
}
export interface IMyTrade {
  value: number,
  from: string,
  to: string,
  when: number,
  buy: boolean,
  tradeAtTime:ITrade
}
interface tradeContext {
    trades?: ITrade[];
    invertedTrades?: ITrade[];
}
const initialContext: tradeContext = {

};

export const TradeContext = createContext<tradeContext>(initialContext);
export const TradeProvider = ({children}:Props):JSX.Element =>{
    const invertAskAndBid = (trade:ITrade) => ({...trade,bid:Math.pow(trade.bid,-1),ask:Math.pow(trade.ask,-1)}) as ITrade
    const {user} = useContext(UserContext)

    const [invertedTrades, setInvertedTrades] = useReducer((state: ITrade[], action: { type: string; trade?: ITrade; _trades?: ITrade[] }) => {
        if (action.type === 'NEW_INVERTED_VALUE') {
          action.trade && !state.includes({...action.trade, time:new Date(parseInt(action.trade.ts)).toLocaleTimeString('en-US', { timeZone: user?.timezone })}) &&
          state.push({...action.trade, time:new Date(parseInt(action.trade.ts)).toLocaleTimeString('en-US', { timeZone: user?.timezone })})
          const mySet = new Set(state.slice(-10).map(item => JSON.stringify(item)));
          state = Array.from(mySet).map((x:string)=>JSON.parse(x)) as ITrade[]
          return state
        }else
        if (action.type === 'SET_TRADES') {
          state = action._trades as ITrade[]
          return state
        }else{return state}
      }, [])
    const [trades, setTrades] = useReducer((state: ITrade[], action: { type: string; trade?: ITrade; _trades?: ITrade[] }) => {
        if (action.type === 'NEW_API_VALUE') {
          action.trade && !state.includes({...action.trade, time:new Date(parseInt(action.trade.ts)).toLocaleTimeString('en-US', { timeZone: user?.timezone })}) &&
          state.push({...action.trade, time:new Date(parseInt(action.trade.ts)).toLocaleTimeString('en-US', { timeZone: user?.timezone })})
          const mySet = new Set(state.slice(-10).map(item => JSON.stringify(item)));
          state = Array.from(mySet).map((x:string)=>JSON.parse(x))
          return state
        }else
        if (action.type === 'SET_TRADES') {
          state = action._trades as ITrade[]
          return state
        }else{return state}
      }, [])

      const ENDPOINT ="http://localhost:3001"
      useEffect(() => {
        const socket:Socket = io(ENDPOINT);
        socket.on("trading", (data) => {
        if(data.length > "User Key Used to many times".length){
           try{
              const json:ITrade = JSON.parse(data) as ITrade
                setTrades({ type: 'NEW_API_VALUE', trade:json})
                setInvertedTrades({ type: 'NEW_INVERTED_VALUE', trade:invertAskAndBid(json)})
           }catch(er){
              console.log(er)
           }
        }
       });
       return () => {
        socket.close()
     };
      }, [ENDPOINT])
    const val:tradeContext = {trades,invertedTrades};
  return (
    <TradeContext.Provider value={ val }>
      {children}
    </TradeContext.Provider>
  );
}

