import "../App.css";
import React,{ useState, useEffect, createContext } from "react";
import { useLocation,useHistory  } from 'react-router-dom'
import { Location } from "history";

type Props = {
    children?: JSX.Element | JSX.Element[],
};
export enum ICoins{
    'USD',
    'GBP'
}
export type ICoinsKeys = keyof typeof ICoins;
export type ICoinsKeyFields = {[key in ICoinsKeys]:boolean}
export interface IWallet{
  USD:number,
  GBP:number
}
export interface IMyTrades{
  buy: boolean;
  value: number, // Negative value if buying, positive if selling.
  from:string,
  to:string,
  when:number
}
export interface IPurchase{
  currency: ICoinsKeys,//'USD' | 'GBP',
  amount: number,
  when:number
}
export interface IUser{
    _id ?: string;
    wallet: IWallet;
    timezone? : string;
    trades: IMyTrades[];
    purchases:IPurchase[];
    username ?: string;
    firstName ?: string;
    createdAt ?: string;
    updatedAt? : string;
    __v? : number;
    verified?:boolean;
    email?:string;
    buy?:boolean
  }
export interface context {
    user?: IUser;
    setUser:(user:IUser) => void
}
const initialContext: context = {
  setUser: (): void => {
    throw new Error('setContext function must be overridden');
  },
};


export const UserContext = createContext<context>(initialContext);
export const UserProvider = ({children}:Props):JSX.Element =>{
    const [user, setUser] = useState<IUser>({trades:[],purchases:[], wallet:{USD:0,GBP:0}});
    const location = useLocation<Location>();
    const history = useHistory();
    
    useEffect(() => {
        const localUser = localStorage.getItem('user')
        if(!localUser){
          if(location.pathname !== "/auth" && location.pathname !== "/confirmed"){
            history.push("/auth");
          }
        }else{
          setUser(JSON.parse(localUser))
          if(location.pathname === "/auth" || location.pathname === "/confirmed"){
            history.push("/");
          }
        }
    }, [history, location.pathname]);
    const val:context = {user,setUser};
  return (
    <UserContext.Provider value={ val }>
      {children}
    </UserContext.Provider>
  );
}

