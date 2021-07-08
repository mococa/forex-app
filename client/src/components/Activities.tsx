import React, { useContext } from "react";
import { IPurchase, UserContext } from "../context/UserContext";
import { makeStyles } from '@material-ui/core/styles';
import {
    Typography,
    Box, Collapse,
    IconButton, Table,
    TableBody,
    TableCell, TableContainer,
    TableHead, TableRow,
    Paper
} from "@material-ui/core";
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import { IMyTrade, ITrade } from "../context/TradeContext";
import { IMyTrades } from "../context/UserContext";

const useRowStyles = makeStyles({
    root: {
        '& > *': {
            borderBottom: 'unset',
        },
    },
});

interface Props {
    data?: IMyTrade[],
    purchases?: IPurchase[]
}
function createData(
    value: number,
    from: string,
    to: string,
    when: number,
    buy: boolean,
    tradeAtTime: ITrade,

) {
    return {
        value, from, to, when, buy, tradeAtTime
    } as IMyTrade;
}
function createPurchase(currency: string, when: number, amount: number) {
    return { currency, when, amount } as IPurchase
}
function instanceOfPurchase(object: any): object is IPurchase {
    return 'currency' in object;
}
function Row(props: { row?: ReturnType<typeof createData>, rowPurchase?: ReturnType<typeof createPurchase> }) {
    const { row, rowPurchase } = props;
    const [open, setOpen] = React.useState(false);
    const classes = useRowStyles();
    const { user } = useContext(UserContext)

    const time = new Date(row?.when || rowPurchase?.when || 0)
        .toLocaleTimeString(navigator.language, {
            hour: "2-digit",
            minute: "2-digit",
            timeZone: user?.timezone
        })
    const date = new Date(row?.when || rowPurchase?.when || 0)
        .toLocaleString(navigator.language, {
            timeZone: user?.timezone,
            month: '2-digit',
            day: '2-digit',
            year: 'numeric'
        })

    return (
        <>
            < TableRow className={classes.root} >
                <TableCell>
                    <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>{open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}</IconButton>
                </TableCell>
                <TableCell component="th" scope="row">{!row ? "Recharge" : (row.buy ? "Buy" : "Sell")}</TableCell>
                <TableCell align="right">{!row ? rowPurchase?.currency : (row.buy ? row.to.slice(0, 3) : row.from.slice(0, 3))}</TableCell>
                <TableCell align="right">{!row ? rowPurchase?.amount : (Math.abs(row.value))}</TableCell>
                <TableCell align="right">{date}</TableCell>
                <TableCell align="right">{time}</TableCell>
            </TableRow >
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box margin={1}>
                            <Typography variant="h6" gutterBottom component="div">Summary</Typography>
                            <Table size="small" aria-label="summary">
                                <TableBody>
                                    <Typography component="span">
                                        <>On <b>{date}</b>, at <b>{time}:</b></><br /><br />
                                        {!row ? "You recharged your account with " + rowPurchase?.currency + " " + rowPurchase?.amount : (
                                            `You ${row.buy ? `spent ${Math.abs(row.value)} ${row.to}` :
                                                `sold 1 ${row.from}`}
                                        for ${row.buy ? '1' : Math.abs(row.value)} ${row.buy ? row.from : row.to}`
                                        )}
                                    </Typography>
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </>

    );
}

export const Activities: React.FC<Props> = ({ data, purchases }): JSX.Element => {

    return (
        <TableContainer component={Paper} style={{ marginTop: '2rem' }} data-testid="activity-table">
            <Table aria-label="collapsible table">
                <TableHead>
                    <TableRow style={{ backgroundColor: "#EEE" }}>
                        <TableCell />
                        <TableCell>Action</TableCell>
                        <TableCell align="right">Currency</TableCell>
                        <TableCell align="right">Amount</TableCell>
                        <TableCell align="right">Day</TableCell>
                        <TableCell align="right">At</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {[...(purchases ? purchases : []), ...(data ? data : [])].sort((a, b) => b.when - a.when).map((row: IMyTrade | IPurchase, i) => {
                        if (instanceOfPurchase(row)) return <Row key={i} rowPurchase={row as IPurchase} />
                        return <Row key={i} row={row as IMyTrade} />
                    })}
                </TableBody>
            </Table>
        </TableContainer>

    )
}