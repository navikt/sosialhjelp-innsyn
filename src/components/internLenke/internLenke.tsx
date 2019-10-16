import React from "react";
import {useDispatch} from "react-redux";
import Lenke from "nav-frontend-lenker";
import {push} from "connected-react-router";

export interface InternLenkeProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    /**
     * -
     */
    href: string;
    /**
     * -
     */
    target?: string;
    /**
     * -
     */
    ariaLabel?: string;
    /**
     * -
     */
    className?: string;
}

const InternLenke: React.FC<InternLenkeProps> = ({href, children}) => {
    const dispatch = useDispatch();
    return (
        <Lenke
            onClick={(event: any) => {
                dispatch(push(href));
                event.preventDefault();
            }}
            href="#"
        >
            {children}
        </Lenke>
    )
};

export default InternLenke;
