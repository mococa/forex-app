import "../App.css";
import {
  Button, Box, Dialog, DialogActions,
  DialogContent, DialogContentText, DialogTitle, useMediaQuery
} from "@material-ui/core"
import { green, pink } from '@material-ui/core/colors';
import { makeStyles } from '@material-ui/core/styles';
import { XAxis, YAxis, CartesianGrid, Bar, Tooltip, ComposedChart, ResponsiveContainer } from "recharts";
import { TradeContext, ITrade } from "../context/TradeContext"
import { UserContext, IUser, } from "../context/UserContext";
import { useState, useEffect, useReducer, useContext } from "react";

const useStyles = makeStyles(() => ({
  green: {
    backgroundColor: green[500],
    color: 'white',
    '&:hover': {
      backgroundColor: green[700]
    }
  },
  buttons: {
    display: 'flex',
    flexFlow: 'row',
    gap: '1rem',
    placeContent: 'center',
    marginBottom: '20px'
  },
  chart: {
    margin: "0 auto",
    padding: '8px'
  },
  mBottom: {
    marginBottom: '8px'
  }
}))

const TradeComp: React.FC<{}> = () => {
  const matches = useMediaQuery('(min-width:500px)');
  interface ICurrencies {
    from: string,
    to: string
  }
  const { trades, invertedTrades } = useContext(TradeContext);
  const classes = useStyles();
  const { user, setUser } = useContext(UserContext)
  // CLICKED ON BUY OR SELL
  const [traded, setTraded] = useState({ traded: false, buy: false, _for: 0 });
  // DEFAULT TRADE ORDER
  const [default_order, setOrder] = useState<ICurrencies>({ from: 'GBP', to: 'USD' })
  const [lastTrade, setLastTrade] = useState<ITrade>()
  // CURRENT TRADE
  const [currentTr, setCurrentTr] = useReducer((state: ITrade[] | undefined, action: { type: string; trades?: ITrade[] }) => {
    if (action.type === 'SET_CURRENT') {
      state = action.trades
      return state
    } else { return state }
  }, [])
  async function makeTrade(buy: boolean) {
    if (lastTrade && user) {
      setTraded({ traded: true, buy: buy, _for: buy ? lastTrade.ask : lastTrade?.bid })
      const tradePayload = {
        value: buy ? lastTrade.ask * -1 : lastTrade?.bid, // Negative value if buying, positive if selling.
        from: default_order.from,
        to: default_order.to,
        tradeAtTime: lastTrade
      }
      const response = await fetch("http://localhost:3001/api/trade", {
        method: 'POST', headers: { 'content-type': 'application/json;charset=UTF-8' },
        body: JSON.stringify({
          trade: tradePayload,
          _id: user._id,
          buy
        })
      });
      const json = await response.json()
      if (json.error !== undefined) {
        alert(json.error)
      } else {
        localStorage.setItem('user', JSON.stringify(json))
        setUser(json as IUser)
      }
    }
  }
  useEffect(() => {
    if (trades && currentTr) setLastTrade(currentTr[currentTr.length - 1])
  }, [trades, currentTr])
  useEffect(() => {
    if (trades) default_order.from === "GBP" ? setCurrentTr({ type: 'SET_CURRENT', trades: trades }) : setCurrentTr({ type: 'SET_CURRENT', trades: invertedTrades })
  }, [default_order, invertedTrades, trades])
  return (
    <div>
      {currentTr && currentTr.length && lastTrade ? <>
        {traded && showTradeDialog()}
        <Box className={classes.mBottom}>
          <Button title="Switch currencies" variant="outlined"
            onClick={() =>
              setOrder(default_order.from === "GBP" ?
                { from: 'USD', to: "GBP" } :
                { from: 'GBP', to: "USD" })}>{default_order.from} to {default_order.to}
          </Button>
        </Box>
        <Box>
          <ResponsiveContainer width={matches ? "60%" : "90%"} height={250} className={classes.chart}>
            <ComposedChart data={currentTr} >
              <XAxis tickMargin={10} height={28} dataKey="time" />
              <YAxis tickCount={2} domain={['auto', 'auto']} />
              <Tooltip />
              <CartesianGrid stroke="#f5f5f5" strokeDasharray="3 3" />
              <Bar name="Buying price" fillOpacity={0.4} fill={pink[400]} type="monotone" dataKey="ask" strokeWidth={3} stroke={pink[400]} animationDuration={500} />
              <Bar name="Selling price" fillOpacity={0.4} fill={green[500]} type="monotone" dataKey="bid" strokeWidth={3} stroke={green[500]} animationDuration={500} />
            </ComposedChart >
          </ResponsiveContainer>
        </Box>
        <Box className={classes.mBottom}>
          <div>
            <h3>Buy now for {lastTrade && lastTrade['ask']} {default_order.to}</h3>
            <h3>Sell now for {lastTrade && lastTrade['bid']} {default_order.to}</h3>
          </div>
        </Box>
        <Box className={classes.buttons}>
          <Button variant="contained" color="secondary"
            onClick={() => makeTrade(true)}>Buy</Button>
          <Button variant="contained" className={classes.green}
            onClick={() => makeTrade(false)}>Sell</Button>
        </Box>
      </> :
        <h2>Hold on tight while we're collecting some data</h2>
      }
    </div>
  );
  function showTradeDialog(): JSX.Element {
    return <Dialog
      open={traded.traded}
      onClose={() => setTraded({ ...traded, traded: false })}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">Good {traded.buy ? "one" : "sell"}!</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          You just {traded.buy ? "bought" : "sold"} 1 {default_order.from} for {traded._for} {default_order.to}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setTraded({ ...traded, traded: false })} color="primary">
          Ok
        </Button>

      </DialogActions>
    </Dialog>
  }
}

export default TradeComp;
