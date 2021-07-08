import "../App.css";
import { useState, useContext, useEffect } from "react";
import { UserContext } from "../context/UserContext";
import Header from '../components/Header'
import { TextField, Typography, Button, Box, Select, InputLabel, MenuItem } from "@material-ui/core"
import { useHistory } from "react-router";

const Profile: React.FC<{}> = () => {
  const history = useHistory()
  const { user, setUser } = useContext(UserContext)
  const [timeZone, setTimeZone] = useState<string>('')
  const [firstName, setFirstName] = useState('')
  const [loaded, setLoaded] = useState(false)
  useEffect(() => {
    return () => {
      if (!loaded) {
        setTimeZone(user?.timezone || "")
        setFirstName(user?.firstName || "")
        setLoaded(true)
      }

    }
  }, [user, loaded])
  async function update() {
    const response = await fetch("http://localhost:3001/api/user/update",
      {
        method: 'PUT', headers: { 'content-type': 'application/json;charset=UTF-8' },
        body: JSON.stringify({
          _id: user?._id,
          firstName: firstName,
          timezone: timeZone
        })
      });
    const json = await response.json()
    if (json.error !== undefined) {
      alert(json.error)
    } else {
      alert("Changes made")
      const newuser = Object.assign(user, { _id: user?._id, firstName: firstName, timezone: timeZone })
      setUser(newuser)
      localStorage.setItem('user', JSON.stringify(newuser))
    }
  }
  return (
    <>
      <Header />
      <div className="App">
        <Box m={4}>
          <Typography variant="h4" data-testid="profile-text">Profile</Typography>
          <Typography data-testid="profile-username" component="span">{user?.username}</Typography>
          <Box m={2}>
            <TextField data-testid="profile-firstName-value" id="outlined-basic" label="First Name" variant="outlined" onChange={(e: React.ChangeEvent<{ name?: string; value: string }>) => setFirstName(e.target.value)} value={firstName} />
            <InputLabel id="demo-simple-select-label" style={{ marginTop: '40px' }}
            >Timezone</InputLabel>
            <Select style={{ minWidth: '200px', marginTop: '10px' }}
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={timeZone}
              onChange={(e: React.ChangeEvent<{ name?: string; value: unknown }>) => setTimeZone(e.target.value as string)}
            >
              <MenuItem value={"Europe/London"}>London</MenuItem>
              <MenuItem value={"America/Sao_Paulo"}>São Paulo</MenuItem>
              <MenuItem value={"America/New_York"}>New York</MenuItem>
              <MenuItem value={"Europe/Paris"}>Paris</MenuItem>
              <MenuItem value={"Asia/Seoul"}>Seoul</MenuItem>
              <MenuItem value={"Asia/Tokyo"}>Tokyo</MenuItem>
              <MenuItem value={"Africa/Johannesburg"}>Johannesburg</MenuItem>
              <MenuItem value={"Europe/Moscow"}>Moscow</MenuItem>

            </Select>

          </Box>
          <Button variant="contained" color="primary"
            style={{ marginTop: '20px', minWidth: '200px' }}
            onClick={async () => await update()}>Update</Button>
          <Box>
            <Button variant="contained"
              href="/wallet"
              style={{ marginTop: '20px', minWidth: '200px' }}
              >{"PREVIOUS ACTIVITIES"}</Button>
          </Box>
          <Box>
            <Button style={{ marginTop: '20px', minWidth: '120px' }} onClick={()=>history.goBack()}>Go back</Button>
          </Box>
          <Box>
            <Button variant="contained"
              color="secondary"
              style={{ marginTop: '20px', minWidth: '120px' }}
              href="/"
              onClick={() => { setUser({ purchases:[],trades: [], wallet: { USD: 0, GBP: 0 } }); localStorage.clear() }}>Logout</Button>
          </Box>

        </Box>
      </div>
    </>
  );
}

export default Profile;
