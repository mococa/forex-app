import React from 'react';
import { Dialog, Button, Slide, Typography, Box } from '@material-ui/core';
import { TransitionProps } from '@material-ui/core/transitions';
import { Email } from '@material-ui/icons';

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & { children?: React.ReactElement<any, any> },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});
interface Props {
    openCheckEmail: boolean
    setOpenCheckEmail: React.Dispatch<React.SetStateAction<boolean>>
}
export const CheckEmail: React.FC<Props> = ({ openCheckEmail, setOpenCheckEmail }): JSX.Element => {

    const handleClose = () => {
        setOpenCheckEmail(false);
    };

    return (
        <>
            <Dialog
                open={openCheckEmail}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
                aria-labelledby="alert-dialog-slide-title"
                aria-describedby="alert-dialog-slide-description"
            >
                <div data-testid="check-email-content" style={{ display: 'flex', flexFlow: 'column', gap: '12px', placeItems: 'center', padding: '24px' }}>

                    <Email style={{ color: "#c55858", fontSize: "80" }} />
                    <Typography style={{ fontWeight: 600 }} variant="h5">
                        Check your email
                    </Typography>
                    <Box style={{color:'#5d5d5d'}}>
                        To confirm your email address, please click the link we just sent you.
                    </Box>
                </div>
                <Button variant="contained"
                        color="primary"
                        style={{margin:10}}
                        onClick={handleClose}
                        >Ok
                </Button>
            </Dialog>
        </>
    );
}
