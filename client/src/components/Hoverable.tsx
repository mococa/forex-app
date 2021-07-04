import { Popover, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React, { useState } from "react";
const useStyles = makeStyles((theme) => ({
    popover: { pointerEvents: 'none' },
    paper: {
        padding: theme.spacing(1),
    }
}))
interface Props {
    //children?: JSX.Element | JSX.Element[],
    text: string | number | JSX.Element |undefined,
    textHeader?: JSX.Element | string
    content?: JSX.Element | JSX.Element[],
    anchorOrigin?: {
        vertical: 'bottom' | 'center' | 'top' | number,
        horizontal: 'center' | 'left' | 'right' | number,
    },
    transformOrigin?: {
        vertical: 'bottom' | 'center' | 'top' | number,
        horizontal: 'center' | 'left' | 'right' | number,
    }
};

export const Hoverable: React.FC<Props> = ({ children, text, textHeader, content, anchorOrigin, transformOrigin }): JSX.Element => {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const handlePopoverOpen = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
        setAnchorEl(event.currentTarget);
    };

    const handlePopoverClose = () => {
        setAnchorEl(null);
    };
    const open = Boolean(anchorEl);
    const default_values: Props = {
        text,
        anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'left'
        },
        transformOrigin: {
            vertical: 'top',
            horizontal: 'left',
        }

    }
    return (
        <div onMouseEnter={handlePopoverOpen} onMouseLeave={handlePopoverClose}>
            {children}
            <Popover
                id="mouse-over-popover"
                className={classes.popover}
                classes={{
                    paper: classes.paper,
                }}
                open={open}
                anchorEl={anchorEl}
                anchorOrigin={anchorOrigin ? anchorOrigin : default_values.anchorOrigin}
                transformOrigin={transformOrigin ? transformOrigin : default_values.transformOrigin}
                onClose={handlePopoverClose}
                disableRestoreFocus>
                {textHeader && textHeader}
                <pre>
                    <Typography>{text}</Typography>
                </pre>
                {content && content}

            </Popover>
        </div>)

}