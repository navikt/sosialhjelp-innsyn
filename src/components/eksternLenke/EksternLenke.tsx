import React from "react";
import Lenke from "nav-frontend-lenker";
import ExternalLink from "../ikoner/ExternalLink";
import "./eksternLenke.less";

const EksternLenke: React.FC<{children: any; href: string}> = ({children, href}) => {
    return (
        <Lenke href={href} target="_blank" rel="noopener noreferrer" className="lenke_uten_ramme">
            {children}
            <ExternalLink className="ekstern_lenke" />
        </Lenke>
    );
};

export default EksternLenke;
