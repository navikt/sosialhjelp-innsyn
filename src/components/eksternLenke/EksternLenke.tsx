import React from "react";
import ExternalLink from "../ikoner/ExternalLink";
import "./eksternLenke.less";
import {Link} from "@navikt/ds-react";

interface Props extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    href: string;
}

const EksternLenke: React.FC<Props> = ({children, href, target, onClick}) => {
    return (
        <Link href={href} target={target} onClick={onClick}>
            {children}
            <ExternalLink className="ekstern_lenke" />
        </Link>
    );
};

export default EksternLenke;
