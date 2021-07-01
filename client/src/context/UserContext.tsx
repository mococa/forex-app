import "../App.css";
import React,{ useState, useEffect, createContext } from "react";
import { useLocation,useHistory  } from 'react-router-dom'
import { Location } from "history";

type Props = {
    children?: JSX.Element | JSX.Element[],
  };

export interface IUser{
    _id ?: string;
    balance ?: 0;
    timezone? : string;
    trades ?: [];
    username ?: string;
    firstName ?: string;
    createdAt ?: string;
    updatedAt? : string;
    __v? : number;
  }
interface context {
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
    const [user, setUser] = useState<IUser>();
    const location = useLocation<Location>();
    const history = useHistory();
    
    useEffect(() => {
        const localUser = localStorage.getItem('user')
        if(!localUser){
          if(location.pathname !== "/auth"){
            history.push("/auth");
          }
        }else{
          setUser(JSON.parse(localUser))
        }
    }, [history, location.pathname]);
    const val:context = {user,setUser};
  return (
    <UserContext.Provider value={ val }>
      {children}
    </UserContext.Provider>
  );
}

