import "../App.css";
import React,{ useState, useEffect, createContext } from "react";

type Props = {
    children?: JSX.Element | JSX.Element[],
};
export interface ITheme {
    theme?:string
}
interface context {
    theme?: ITheme;
    setTheme:(theme:ITheme) => void;
}
const initialContext: context = {
  setTheme: (): void => {
    throw new Error('setContext function must be overridden');
  }
};


export const ThemeContext = createContext<context>(initialContext);
export const ThemeProvider = ({children}:Props):JSX.Element =>{
    const [theme, setTheme] = useState<ITheme>({theme:'light'} as ITheme);
    
    useEffect(() => {
        const localTheme = localStorage.getItem('theme')
        if(!localTheme){
          setTheme({theme:'light'})
        }else{
          setTheme(JSON.parse(localTheme))
        }
    }, []);
    const val:context = {theme,setTheme};
  return (
    <ThemeContext.Provider value={ val }>
      {children}
    </ThemeContext.Provider>
  );
}

