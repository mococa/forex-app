import "../App.css";
import { useState, useContext } from "react";
import { Button, TextField, Typography, Box, Select,InputLabel,MenuItem, IconButton } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Brightness4Icon from '@material-ui/icons/Brightness4';
import { UserContext, IUser } from "../context/UserContext";
import {useHistory  } from 'react-router-dom'

const useStyles = makeStyles((theme) => ({
  box: {
    display:'flex',
    flexFlow:'column',
    placeContent:'center',
    [theme.breakpoints.up('md')]: {
        flexFlow: 'row',
      },

  },
  col:{
      display:'flex',
      flexFlow:'column',
      gap:10,
      padding:20,
      
      
  }
}));


const Authencticate:React.FC<{}> = () =>{
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [registerUsername, setRegisterUsername] = useState("");
    const [password, setPassword] = useState("")
    const [registerPassword, setRegisterPassword] = useState("")
    const [registerPassword2, setRegisterPassword2] = useState("")
    const [firstName, setFirstName] = useState("");
    const [timeZone, setTimeZone] = useState("Europe/London");
    const {setUser} = useContext(UserContext);

    const history = useHistory();
    async function login(){
        const response = await fetch("http://localhost:3001/api/user?"+
        new URLSearchParams({
          username: username,
          password:password
        }));
        const json = await response.json()
        console.log(json)
        if(json.error !== undefined){
            alert(json.error)
        }else{
          // AUTHORIZE
          const loggedUser = json as IUser
          setUser(loggedUser)
          localStorage.setItem("user", JSON.stringify(loggedUser))
          history.push("/");
        }
    }
    function verifyPass(){
      return registerPassword === registerPassword2
    }
    async function register(){
      if(!verifyPass()) return alert("The password confirmation does not match")
      const response = await fetch("http://localhost:3001/api/users/create", 
        {  method: 'POST', headers: { 'content-type': 'application/json;charset=UTF-8' },
        body:JSON.stringify({
        username: registerUsername,
        email:email,
        password:registerPassword,
        passwordConfirmation:registerPassword2,
        firstName:firstName,
        timezone:timeZone
      })});
      const json = await response.json()
      console.log(json)
      if(json.error !== undefined){
          json.error.forEach(function(value:string){
            alert(value)
          })
      }else{
        // AUTHORIZE
        const loggedUser = json as IUser
        setUser(loggedUser)
        localStorage.setItem("user", JSON.stringify(loggedUser))
        history.push("/");
        
      }
  }
const classes = useStyles()
  return (
    <>
    <IconButton>
        <Brightness4Icon/>
    </IconButton>
      <Box className={classes.box}>
          <Box className={classes.col}>
            <Typography variant="h4">Login</Typography>
            <TextField id="outlined-basic" label="Username" variant="outlined"
             onChange={(e:React.ChangeEvent<{ name?: string; value: unknown }>)=>setUsername(e.target.value as string)} value={username}/>
             <TextField type="password" id="outlined-basic" label="Password" variant="outlined"
             onChange={(e:React.ChangeEvent<{ name?: string; value: unknown }>)=>setPassword(e.target.value as string)} value={password}/>
            <Button variant="contained" color="primary" 
                    style={{minWidth:'200px'}}
                    onClick={async()=>await login()}
                    >Login</Button>
            <Box></Box>
          </Box>
          <Box className={classes.col}>
            <Typography variant="h4">Register</Typography>
            <TextField id="outlined-basic" 
            label="Username" variant="outlined"
            value={registerUsername}
            onChange={(e:React.ChangeEvent<{ name?: string; value: unknown }>)=>setRegisterUsername(e.target.value as string)}/>
            <TextField id="outlined-basic" label="First Name" variant="outlined" 
            onChange={(e:React.ChangeEvent<{ name?: string; value: unknown }>)=>setFirstName(e.target.value as string)}/>
            <TextField id="outlined-basic" label="Email" variant="outlined" 
            onChange={(e:React.ChangeEvent<{ name?: string; value: unknown }>)=>setEmail(e.target.value as string)}/>
            <TextField id="outlined-basic"
            label="Password" type="password"
            variant="outlined" value={registerPassword2}
            onChange={(e:React.ChangeEvent<{ name?: string; value: unknown }>)=>setRegisterPassword2(e.target.value as string)}/>
            <TextField id="outlined-basic"
            label="Confirm Password" type="password"
            variant="outlined" value={registerPassword}
            onChange={(e:React.ChangeEvent<{ name?: string; value: unknown }>)=>setRegisterPassword(e.target.value as string)}/>
            <InputLabel id="demo-simple-select-label" 
                >Timezone</InputLabel>
                <Select style={{minWidth: '200px'}}
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={timeZone}
                    onChange={(e:React.ChangeEvent<{ name?: string; value: unknown }>)=>setTimeZone(e.target.value as string)}
                >
                    <MenuItem value={"Europe/London"}>London</MenuItem>
                    <MenuItem value={"America/Sao_Paulo"}>São Paulo</MenuItem>
                    <MenuItem value={"America/New_York"}>New York</MenuItem>
                    <MenuItem value={"Europe/Paris"}>Paris</MenuItem>
                </Select>
                <Button variant="contained" color="secondary" 
                    style={{minWidth:'200px'}}
                    onClick={async()=> await register()}
                    >Sign Up</Button>
          </Box>
        
      </Box>
    </>
  );
}

export default Authencticate;
