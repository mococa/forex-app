import "../App.css";
import { Done } from "@material-ui/icons";
import { Box, Typography, Button } from "@material-ui/core";


const EmailConfirmed: React.FC<{}> = () => {
    return (
        <div className="App" style={{transform:'translateY(50%)'}}>
            <Typography variant="h6">
                <Done style={{ fontSize: '80', color: 'green' }} />
                <Typography variant="h3">Congratulations!</Typography>
                <Box style={{ margin: '20px' }}>
                    You email address has been verified.
                </Box>
            </Typography>
            <Button href="/auth" variant="contained" size="large" color="primary" disableElevation>
                Login
            </Button>
        </div>
    );
}

export default EmailConfirmed;
