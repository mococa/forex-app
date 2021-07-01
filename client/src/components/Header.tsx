import React, { useContext } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Popover
} from "@material-ui/core";
import { Person, AccountBalanceWallet } from "@material-ui/icons";
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
    gap: '0.5rem'

  }
}));
const Header: React.FC = () => {
  const classes = useStyles();
  const { user } = useContext(UserContext);
  const moneyfy = (cur: number = 0) => {
    return cur.toFixed(2).toLocaleString()
  }

  return (
    <>
      <AppBar position="fixed" className={classes.root}>
        <Toolbar>
          <Box className={classes.box}>
            <Typography variant="h5" component="a" href="/" style={{ color: 'white', textDecoration: 'none' }}>Forex Application</Typography>
          </Box>
          <Box className={classes.row}>
            {user && 
              <Hoverable text={`US$${moneyfy(user.balance.usd)}\n£${moneyfy(user?.balance.gbp)}`}>
              <Typography component="span"
                style={{ fontFamily: 'unset', display: 'flex', alignItems: 'center' }}>
                  <AccountBalanceWallet style={{marginRight:"5px"}} />
                  Wallet: US${ moneyfy(user.balance.usd)}
                
              </Typography>
            </Hoverable>
            }
            
            <IconButton aria-label="profile" href="/profile">
              <Person fontSize="inherit" style={{ color: "white" }} />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      <div className={classes.offset}></div>
    </>
  );
}

export default Header;
