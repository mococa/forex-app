import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
} from "@material-ui/core";
import { Person } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";


const useStyles = makeStyles((theme) => ({
  offset: theme.mixins.toolbar,
  root: { flexGrow: 1 },
  box: {
    textAlign: "center",
    flexGrow: 1,
  },
}));
interface Props {
  balance:number,
}
const Header:React.FC<{balance:number}> = ({balance}) =>{
  const classes = useStyles();
  const moneyfy = (cur:number=0) =>{
    return cur.toFixed(2).toLocaleString()
  }
  return (
    <>
      <AppBar position="fixed" className={classes.root}>
        <Toolbar>
          <Box className={classes.box}>
            <Typography variant="h5">Forex Application</Typography>
          </Box>
          <Box>
            <Typography component="span">
              Balance: { moneyfy(balance) }
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
