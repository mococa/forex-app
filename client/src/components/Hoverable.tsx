import { Popover, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";

import React, { useState } from "react";
const useStyles = makeStyles((theme) => ({
    popover: { pointerEvents: 'none' },
    paper: {
        padding: theme.spacing(1),
    }
}))
interface Props {
    text: string | number | JSX.Element | undefined,
    textHeader?: JSX.Element | string,
    href?: string,
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

export const Hoverable: React.FC<Props> = ({ children, text, textHeader, href, content, anchorOrigin, transformOrigin }): JSX.Element => {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const history = useHistory()
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
    const content_ = <>
        {children}
        <Popover
            id="mouse-over-popover"
            data-testid="popover"
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
    </>
    return href?<Link style={{textDecoration:'none', color:'unset'}} to={href} onMouseEnter={handlePopoverOpen}
    onMouseLeave={handlePopoverClose}>{content_}</Link>:<div onMouseEnter={handlePopoverOpen}
    onMouseLeave={handlePopoverClose}>{content_}</div>
}
