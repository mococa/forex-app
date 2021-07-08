import "../App.css";
import { useMediaQuery, makeStyles, Box, Typography, Button } from "@material-ui/core";
import Header from "../components/Header";
import { useContext, useState, CSSProperties, useEffect } from "react";
import { ICoinsKeys, IUser, UserContext } from "../context/UserContext";
import { Line, CartesianGrid, ComposedChart, Tooltip, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { Activities } from "../components/Activities";
import { IMyTrade } from "../context/TradeContext";

const useStyles = makeStyles(() => ({
    chart: {
        margin: "10px 0 50px",
        padding: '8px'
    }
}))
interface Props{
    fetchUser?:boolean
}
interface IChart {
    money: number;
    time: number;
}
interface MyCustomCSS extends CSSProperties {
    '--selected-color': string;
}
const Wallet: React.FC<Props> = ({fetchUser}) => {
    const matches = useMediaQuery('(min-width:500px)');
    const classes = useStyles();
    const { user,setUser } = useContext(UserContext)
    const [currencyIndex, setCurrencyIndex] = useState(-1)
    const colors = ["#2ec27e", "#c061cb", "#f6d32d", "#ed333b"]
    const [goingCurrency, setGoingCurrency] = useState<IChart[]>([]) // Current currency on chart.

    async function login() {
        if(user && user._id){
            console.log(user._id)
            const response = await fetch("http://localhost:3001/api/test/user?" +
            new URLSearchParams({
                _id:user?._id as string
            }));
            const json = await response.json()
            console.log(json)
            if (json.error !== undefined) {
                alert(json.error)
                console.error(json.error)
            } else {
            // AUTHORIZE
                const loggedUser = json as IUser
                setUser(loggedUser)
                localStorage.setItem("user", JSON.stringify(loggedUser))
            }
        }
    }

    useEffect(() => {
       login()
      }, []);
      
    const MoneyCard = (currency: ICoinsKeys, value: number, index: number): JSX.Element => {
        const toggleClass = () => {
            if (currencyIndex === index) { // If clicking on selected card, then set none as selected.
                setCurrencyIndex(-1)
            } else {
                setCurrencyIndex(index) // If not, select the clicked card.
            }
            if (!user?.trades) return
            const walletHistory: IChart[] = [{ money: 10.00, time: new Date(user.createdAt as string || 0).getTime() }, // INITIAL VALUE (10 OF EACH CURRENCY WHEN WE CREATE AN ACCOUNT)
            ...user?.purchases
                .map(x=>x.currency===currency?({money:x.amount, time:x.when} as IChart):{money:0,time:0}),
            // PURCHASES IN FORMAT OF ICHART, AND WHEN THE PURCHASE CURRENCY IS NOT THE CURRENCY "X", PUT TIME 0
            ...user?.trades // ALL TRADES MADE BY THIS USER

                .map(trade => {                                 // LET US WORK WITH CURRENCY "X"

                    if (trade.buy && trade.from === currency) {    // when we sell an amount of Y to get 1 X
                        return ({ money: 1, time: trade.when })           // we should increase 1 X

                    } else if (trade.to === currency) {            // when we sell 1 Y for an amount of X 
                        return ({ money: trade.value, time: trade.when }) // we should increase this amount on X 

                    } else {                                       // when we sell 1 X to get an amount of Y
                        return ({ money: -1, time: trade.when })          // we should decrease 1 from X
                    }
                })
            ]
            .filter(x=>x.time>0)
            // ONLY TAKING DATA WHEN TIME IS BETTER THAN 0
            .sort((a:any, b:any) => a.time - b.time) as IChart[]
            // Making sure history is sorted from oldest to most recent

            // Iterating through walletHistory and summing all previous "money" property to current one
            // I.E: [ {money:1}, {money:2}, {money:3} ] => [ {money:1}, {money:3}, {money:6} ]
            const moneyData = walletHistory.map((x, i) => walletHistory.slice(0, i + 1).reduce((a, b) => ({ money: a.money + b.money, time: walletHistory[i].time })))

            //We put it on a chart, so we can see it better.
            setGoingCurrency(moneyData as IChart[])
        }


        return (
            <div role="wallet-card" className={"wallet-card" + (currencyIndex === index ? " selected" : "")} key={index} style={{ backgroundColor: colors[index], "--selected-color": colors[index] } as MyCustomCSS}
                onClick={toggleClass} title={currency + " " + value}>
                <span role="wallet-card-currency">{currency}</span>
                <span role="wallet-card-value">{value}</span>
            </div>

        )
    }
    return (
        <>
            <Header />
            <h1>My Wallet</h1>
            {user && user?.wallet ?
                <>
                    <div className={"wallet-cards"}>
                        {Object.keys(user.wallet).map((x, i) => {
                            const currency = x as ICoinsKeys
                            const amount: number = user.wallet[currency]
                            return MoneyCard(currency, amount, i)
                        })}
                        <div data-testid="wallet-card-activity" className={`wallet-activities-card ${currencyIndex === -1 && 'selected'}`} onClick={() => setCurrencyIndex(-1)}>
                            <span>Activities</span>
                        </div>
                    </div>
                    {currencyIndex < 0 && (user?.trades.length || user.purchases.length ?
                        <div data-testid="activities" style={{ margin: "20px 5%" }}><Activities purchases={user?.purchases} data={user?.trades as IMyTrade[]} /></div> :
                        <Typography className="App"><br /><span role="no-trade">You have no trades yet</span>.<br /> <a href="/trade">Trade now</a></Typography>)}
                    {currencyIndex >= 0 &&
                        <>
                            <Box style={{ margin: '25px 5%' }}>
                                <Typography>Need more {currencyIndex === 0 ? "US dollars" : "pounds"}?</Typography>
                                <Button href="/buy" style={{ backgroundColor: colors[currencyIndex], marginTop: '10px', color: 'white' }}
                                >Buy more here</Button>
                            </Box>
                            {user.trades.length || user.purchases.length ?
                                <ResponsiveContainer width={matches ? "60%" : "90%"} height={250} className={classes.chart}>
                                    <ComposedChart data={goingCurrency} >
                                        <XAxis tickMargin={10} height={28} dataKey="time" />
                                        <YAxis dataKey="money" />
                                        <Tooltip />
                                        <CartesianGrid stroke="#f5f5f5" strokeDasharray="3 3" />
                                        <Line name={currencyIndex === 0 ? "US$" : "£"} type="monotone" dataKey="money" strokeWidth={3} stroke={colors[currencyIndex]} animationDuration={500} />
                                    </ComposedChart >
                                </ResponsiveContainer>
                                : <b role="no-activity" style={{ margin: '20px 5%', display: 'flex' }}>No {currencyIndex === 0 ? "US$" : "£"} activity yet</b>}
                        </>
                    }
                    <Box>

                    </Box>
                </> : <h4 role="wallet-loading">Loading user</h4>}
        </>
    );
}
export default Wallet;
