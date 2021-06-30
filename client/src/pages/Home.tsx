import Header from "../components/Header";
import { io, Socket } from "socket.io-client";
import { UserContext } from "../context/UserContext";
import React, { useContext, useEffect, useState } from "react";
import {
  Backdrop,
  CircularProgress,
  Typography,
  Container,
  Box,
  Button,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "black",
  },
}));

const Home:React.FC<{}> = () =>{
    interface Props{
        socket:Socket
    }
    
  interface IUser{
    "_id" : string,
      "balance" : 0,
      "timezone" : string,
      "trades" : [],
      "username" : string,
      "firstName" : string,
      "createdAt" : string,
      "updatedAt" : string,
      "__v" : number
  }
  interface ITime{
    dateTime:string
  }

  const socket:Socket = io("http://localhost:3001", {
    query: { from: "usd", to: "gbp" },
    transports: ["websockets", "polling"],
  });
  socket.on("trading", (data) => {/*console.log(data)*/});
  const classes = useStyles();
  const {user} = useContext(UserContext);
  const [time, setTime] = useState<ITime>();
  useEffect(() => {
    async function fetch_data() {
      const url_fetch = "http://localhost:3001/time?timezone=" + user?.timezone
      console.log(url_fetch)
      const response_time = await fetch(url_fetch);
      const _time = await response_time.json();
      console.log(_time);
      setTime(_time);
    }
    fetch_data();
  }, [user?.timezone]);
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
      {!time ? (
        <Backdrop className={classes.backdrop} open={true}>
          <CircularProgress color="inherit" />
        </Backdrop>
      ) : (
        <>
          <Header/>
          <Container>
            <Box m={2}>
              <Typography component="h4">
                {greetings()}, {user?.firstName}
              </Typography>
              <Typography component="h6">
                {time && new Date(time['dateTime'])
                  .toLocaleTimeString(navigator.language, {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                  .toLowerCase()}{" "}
                seems like a good time for trading
              </Typography>
              <Button
                variant="outlined"
                href="/trade"
                style={{ marginTop: "8px" }}
              >
                Start now
              </Button>
            </Box>
          </Container>
        </>
      )}
    </>
  );
}

export default Home;
