import React from "react";
import { AppBar, Toolbar, Typography, Box } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  offset: theme.mixins.toolbar,
  root: { flexGrow: 1 },
  box: {
    textAlign: "center",
    flexGrow: 1,
  },
}));
function Header() {
  const classes = useStyles();
  return (
    <>
      <AppBar position="fixed" className={classes.root}>
        <Toolbar>
          <Box className={classes.box}>
            <Typography variant="h5">Forex Application</Typography>
          </Box>
        </Toolbar>
      </AppBar>
      <div className={classes.offset}></div>
    </>
  );
}

export default Header;
