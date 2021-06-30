import React, { useContext } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
} from "@material-ui/core";
import { Person } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import { UserContext } from "../context/UserContext";


const useStyles = makeStyles((theme) => ({
  offset: theme.mixins.toolbar,
  root: { flexGrow: 1 },
  box: {
    flexGrow: 1,
  },
  row:{
    display:'flex',
    flexFlow:'row',
    alignItems: 'center',
    gap:'0.5rem'

  }
}));
const Header:React.FC = () =>{
  const classes = useStyles();
  const {user} = useContext(UserContext);
  const moneyfy = (cur:number=0) =>{
    return cur.toFixed(2).toLocaleString()
  }
  return (
    <>
      <AppBar position="fixed" className={classes.root}>
        <Toolbar>
          <Box className={classes.box}>
            <Typography variant="h5" component="a" href="/" style={{color:'white', textDecoration:'none'}}>Forex Application</Typography>
          </Box>
          <Box className={classes.row}>
            <Typography component="span">
              Balance: { moneyfy(user?.balance) }
              </Typography>
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
