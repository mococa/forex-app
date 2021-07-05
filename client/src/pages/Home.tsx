import Header from "../components/Header";

import { UserContext } from "../context/UserContext";
import React, { useContext, useEffect, useState } from "react";
import {
  Backdrop,
  CircularProgress,
  Typography,
  Container,
  Box,
  Button,
  useMediaQuery
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "black",
  },
}));

const Home:React.FC<{}> = () =>{
  //const buttonStyle={"marginTop":"250px","textAlign":"center","left":"calc(50% - 36px - 60px)","borderRadius":"18px","fontWeight":900,"padding":"5px 60px"}
  const matches = useMediaQuery('(min-width:500px)');
  interface ITime{
    dateTime:string
  }

  const classes = useStyles();
  const {user} = useContext(UserContext);
  const [time, setTime] = useState<ITime>();
  useEffect(() => {
    async function fetch_data() {
      if(user && '_id' in user) {
        const url_fetch = "http://192.168.0.2:3001/time?timezone=" + user.timezone
        console.log(url_fetch)
        const response_time = await fetch(url_fetch);
        const _time = await response_time.json();
      
        const lsRAW:string|null = localStorage.getItem('user') as string|null
        const lsUser = lsRAW ?  JSON.parse(lsRAW) : {}
        if(_time === "Invalid Timezone" && lsUser.timezone){
          console.error("No timezone from server, even though user has one.")
          console.info("Setting timezone for user machine")
          setTime({dateTime:Intl.DateTimeFormat().resolvedOptions().timeZone});
        }else{
          setTime(_time);
        }
      }
    }
    fetch_data();
  }, [user]);
  function greetings() {
    if(time === undefined) return ""
    const now = parseInt(
      new Date(time['dateTime'])
        .toLocaleTimeString("pt-BR")
        .split(":")
        .slice(0, 2)
        .join("")
    );
    if (now > 300 && now < 1159) return "Good morning";
    else if (now > 1159 && now < 1759) return "Good afternoon";
    else return "Good evening";
  }

  return (
    <>
      {!time ?
        <Backdrop className={classes.backdrop} open={true}>
          <CircularProgress color="inherit" />
        </Backdrop>
       : 
        <>
          <Header/>
          <Container>
            <Box m={2}>
              <Typography data-testid="home-greetings" variant={matches ? "h3" : "h4"} align="center" style={{margin: '60px 0 10px'}}>
                {`👋 ${greetings()} ${matches?", ":"\n"} ${user?.firstName}!`}
              </Typography>
              <Typography variant="h6" align="center">
                {time && new Date(time['dateTime'])
                  .toLocaleTimeString(navigator.language, {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                  .toLowerCase()}{" "}
                seems like a good time for trading
              </Typography>
              <Button
                style={{margin:'250px 0 20px',
                        padding:"5px 30px", left:"calc(50% - 30px - 40px)",
                        backgroundColor:'#53b153', color:'white', fontSize:'1rem'}}
                variant="outlined"
                href="/trade"
                
              >
                Start now
              </Button>
            </Box>
          </Container>
        </>
      }
    </>
  );
}

export default Home;
