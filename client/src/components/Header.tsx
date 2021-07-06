import React, { useContext } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
} from "@material-ui/core";
import { Person, AccountBalanceWallet, TrendingUp } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import { UserContext } from "../context/UserContext";
import { Hoverable } from "./Hoverable";


const useStyles = makeStyles((theme) => ({
  offset: theme.mixins.toolbar,
  root: { flexGrow: 1 },
  popover: { pointerEvents: 'none' },
  paper: {
    padding: theme.spacing(1),
  },
  box: {
    flexGrow: 1,
  },
  row: {
    display: 'flex',
    flexFlow: 'row',
    alignItems: 'center',
    gap: '1rem'

  }
}));
const Header: React.FC = () => {
  const classes = useStyles();
  const { user } = useContext(UserContext);
  const moneyfy = (cur: number = 0) => cur.toFixed(2).toLocaleString()

  return (
    <>
      <AppBar position="fixed" className={classes.root}>
        <Toolbar>
          <Box className={classes.box}>
            <Typography variant="h5" 
              component="a" 
              data-testid="header-title"
              href="/" style={{ color: 'white', textDecoration: 'none' }}
              >Forex
            </Typography>
          </Box>
          <Box className={classes.row}>
              <Hoverable href="/trade" text="Trade" anchorOrigin={{vertical:35, horizontal:'left'}}>
                <Box style={{ fontFamily: 'unset', display: 'flex', alignItems: 'center' }}>
                  <TrendingUp style={{marginRight:"5px"}} />
                  <span>Trade</span>
                </Box>
              </Hoverable>
            {user && 
              <Hoverable
                anchorOrigin={{vertical:35, horizontal:'left'}}
                href="/wallet"
                textHeader={<b style={{paddingRight:'24px'}}
                >My Wallet:</b>} text={`US$${moneyfy(user.wallet.USD)}\n£${moneyfy(user?.wallet.GBP)}`}>
                  <Box style={{ fontFamily: 'unset', display: 'flex', alignItems: 'center' }}>
                    <AccountBalanceWallet style={{marginRight:"5px"}} />
                    <span>US${ moneyfy(user.wallet.USD)}</span> 
                  </Box>
              </Hoverable>
            }
            <Box>
              <IconButton aria-label="profile" href="/profile">
                <Person fontSize="inherit" style={{ color: "white" }} />
              </IconButton>
            </Box>
            
          </Box>
        </Toolbar>
      </AppBar>
      <div className={classes.offset}></div>
    </>
  );
}

export default Header;
