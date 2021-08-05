import React from "react";
import Lenke from "nav-frontend-lenker";
import ExternalLink from "../ikoner/ExternalLink";
import "./eksternLenke.less";

interface Props extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    href: string;
}

const EksternLenke: React.FC<Props> = ({children, href, target, onClick}) => {
    return (
        <Lenke href={href} target={target} className="lenke_uten_ramme" onClick={onClick}>
            {children}
            <ExternalLink className="ekstern_lenke" />
        </Lenke>
    );
};

export default EksternLenke;
