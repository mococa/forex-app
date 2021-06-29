import logo from "./logo.svg";
import "./App.css";
import Header from "./components/Header";
import { useEffect, useState } from "react";
import { Backdrop, CircularProgress } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "black",
  },
}));
function App() {
  const classes = useStyles();

  const myId = "60da004815435c3560039458";
  const [user, setUser] = useState(null);
  const [timeObj, setTimeObj] = useState({});
  const [time, setTime] = useState({});
  useEffect(() => {
    async function fetch_data() {
      const response = await fetch(
        "http://localhost:3001/api/user?" +
          new URLSearchParams({
            id: myId,
          })
      );

      const _user = await response.json();
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

  return (
    <div>
      {!user ? (
        <Backdrop className={classes.backdrop} open={true}>
          <CircularProgress color="inherit" />
        </Backdrop>
      ) : (
        <>
          <Header />
          <h1>
            Welcome, {user.firstName} <br /> It's {time.dateTime}{" "}
          </h1>
        </>
      )}
    </div>
  );
}

export default App;
