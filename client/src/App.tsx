import "./App.css";
import Header from "./components/Header";
import { io, Socket } from "socket.io-client";
// CommonJS

import { useEffect, useState } from "react";
import {
  Backdrop,
  CircularProgress,
  Typography,
  TypographyProps,
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

// interface Props{
//   socket:Socket,
//   time:ITime
// }
const App:React.FC<{socket:Socket}> = () =>{
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
  const socket = io("http://localhost:3001", {
    query: { from: "usd", to: "gbp" },
    transports: ["websockets", "polling"],
  });
  //socket.on("trading", (data) => console.log(data));
  const classes = useStyles();
  const myId = "60da004815435c3560039458";
  const [user, setUser] = useState<IUser>();
  //const [timeObj, setTimeObj] = useState({});
  const [time, setTime] = useState<ITime>();
  useEffect(() => {
    async function fetch_data() {
      const response = await fetch(
        "http://localhost:3001/api/user?" +
          new URLSearchParams({
            id: myId,
          })
      );
      const _user = await response.json();
      console.log(_user);
      const response_time = await fetch(
        "http://localhost:3001/time?timezone=" + _user.timezone
      );
      const _time = await response_time.json();
      console.log(_time);
      setTime(_time);
      //setTime(new Date(_time.dateTime).toLocaleTimeString());
      setUser(_user);
    }
    fetch_data();
  }, []);
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
    <div>
      {!user ? (
        <Backdrop className={classes.backdrop} open={true}>
          <CircularProgress color="inherit" />
        </Backdrop>
      ) : (
        <>
          <Header balance={2} />
          <Container>
            <Box m={2}>
              <Typography component="h4">
                {greetings()}, {user.firstName}
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
    </div>
  );
}

export default App;
