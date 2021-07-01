import "../App.css";
import { Button, Box, Typography } from "@material-ui/core"
import { green, pink } from '@material-ui/core/colors';
import { createMuiTheme, makeStyles } from '@material-ui/core/styles';
import { Line, LineChart, XAxis, YAxis, CartesianGrid, BarChart, Bar, Area, Legend, Tooltip, ComposedChart, ResponsiveContainer } from "recharts";
import { TradeContext, ITrade } from "../context/TradeContext"
import { useState, useEffect, useReducer, useContext } from "react";
const useStyles = makeStyles((theme) => ({
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
  const { trades, invertedTrades } = useContext(TradeContext);
  const classes = useStyles();

  const [default_order, setOrder] = useState({ from: 'GBP', to: 'USD' })
  const [lastTrade, setLastTrade] = useState<ITrade>()
  //const [currentTr, setCurrentTr] = useState<ITrade[] | undefined>(undefined)
  const [currentTr, setCurrentTr] = useReducer((state: ITrade[] | undefined, action: { type: string; trades?: ITrade[] }) => {
    if (action.type === 'SET_CURRENT') {
      state = action.trades
      return state
    } else { return state }
  }, [])


  //const [currentTrade, setCurrentTrade] = useState<ITrade[]>(trades || [])
  useEffect(() => {
    if (trades && currentTr) setLastTrade(currentTr[currentTr.length - 1])
  }, [trades, currentTr])
  useEffect(() => {
    //setCurrentTr([])
    if (trades) default_order.from === "GBP" ? setCurrentTr({ type: 'SET_CURRENT', trades: trades }) : setCurrentTr({ type: 'SET_CURRENT', trades: invertedTrades })
  }, [default_order, invertedTrades, trades])
  return (
    <div>
      {currentTr && currentTr.length ? <>
        <Box className={classes.mBottom}>
          <Button title="Switch currencies" variant="outlined"
            onClick={() =>
              setOrder(default_order.from === "GBP" ?
                { from: 'USD', to: "GBP" } :
                { from: 'GBP', to: "USD" })}>{default_order.from} to {default_order.to}
          </Button>
        </Box>
        <Box>
          <ResponsiveContainer width="60%" height={300} className={classes.chart}>
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
            <h3>Buy now for {lastTrade && lastTrade['ask']}</h3>
            <h3>Sell now for {lastTrade && lastTrade['bid']}</h3>
          </div>
        </Box>
        <Box className={classes.buttons}>
          <Button variant="contained" color="secondary">Buy</Button>
          <Button variant="contained" className={classes.green}>Sell</Button>
        </Box>
      </> :
        <h2>Hold on tight while we're collecting some data</h2>
      }
    </div>
  );
}

export default TradeComp;
