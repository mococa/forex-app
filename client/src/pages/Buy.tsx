import "../App.css";
import Header from "../components/Header";
import { Button, Container, FormControl, FormControlLabel, FormLabel, Grid, Radio, RadioGroup } from "@material-ui/core";
import VerificationInput from "../components/VerificationInput";
import { useContext, useState } from "react";
import { IUser, UserContext } from "../context/UserContext";
import { useHistory  } from 'react-router-dom'
const Buy: React.FC<{}> = () => {
  
  const [name, setName] = useState("")
  const [password, setPassword] = useState("")
  const [coin, setCoin] = useState('USD')
  const [amount, setAmount] = useState('10')
  const history = useHistory();
  const {user, setUser} = useContext(UserContext)

  const handleChangeAmount = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAmount((event.target as HTMLInputElement).value);
  };
  const handleChangeCoin = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCoin((event.target as HTMLInputElement).value);
  };
  const inputs = [
    { component: <VerificationInput label="Full name" setValue={setName} />, value: name },
    { component: <VerificationInput type="password" label="Confirm your password" setValue={setPassword} />, value: name },
  ]
  async function buy() {
    if(name && password && user){
      const response = await fetch("http://localhost:3001/api/user/buy",
      { 
        method: 'POST', headers: { 'content-type': 'application/json;charset=UTF-8' },
        body: JSON.stringify({
          username: user.username,
          password,
          name,
          amount,
          coin
        })
      }); 
    const json = await response.json()


    if (json.error !== undefined) {
        alert(json.error)
    } else {
      localStorage.setItem('user', JSON.stringify(json))
      setUser(json as IUser)
      alert("Account recharged.")
      history.push("/wallet")
    }
    }else{
      alert("Please fill all required fields.")
    }
  }
  return (
    <>
      <Header />
      <h1 data-testid>Buy more</h1>
      <Container>
        <Grid container direction="row" spacing={4}>
          {inputs.map(x => <Grid item sm={6} md={6} xs={12}>{x.component}</Grid>)}
        </Grid>
        <Grid container direction="row" spacing={4} alignItems="flex-start">
          <Grid item sm={3} md={6} xs={6}>
            <FormControl component="fieldset">
              <FormLabel component="legend">Coin</FormLabel>
              <RadioGroup aria-label="coin" name="coin1" value={coin} onChange={handleChangeCoin}>
                <FormControlLabel value={'USD'} control={<Radio />} label="Dollar" />
                <FormControlLabel value={'GBP'} control={<Radio />} label="Pound" />
              </RadioGroup>
            </FormControl>
          </Grid>
          <Grid item sm={3} md={6} xs={6}>
            <FormControl component="fieldset">
              <FormLabel component="legend">Amount</FormLabel>
              <RadioGroup aria-label="amount" name="amount1" value={amount} onChange={handleChangeAmount}>
                <FormControlLabel value={'5'} control={<Radio />} label={coin + " 5,00"} />
                <FormControlLabel value={'10'} control={<Radio />} label={coin + " 10,00"} />
                <FormControlLabel value={'20'} control={<Radio />} label={coin + " 20,00"} />
                <FormControlLabel value={'30'} control={<Radio />} label={coin + " 30,00"} />
                <FormControlLabel value={'40'} control={<Radio />} label={coin + " 40,00"} />
                <FormControlLabel value={'50'} control={<Radio />} label={coin + " 50,00"} />
              </RadioGroup>
            </FormControl>
          </Grid>

          <Grid item sm={12} md={2} xs={12}>
            <Button
              fullWidth
              style={{
                padding: "5px 30px", backgroundColor: '#53b153',
                color: 'white', fontSize: '1rem', whiteSpace:'nowrap',
                boxSizing:'content-box'
              }}
              onClick={async () => await buy()}
            >{`Buy now for ${coin} ${(parseFloat(amount)*1.5).toFixed(2)}`}</Button>
          </Grid>
        </Grid>


      </Container>
    </>
  );
}

export default Buy;
