import React from "react";
import {Link} from "@navikt/ds-react";

interface Props extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    href: string;
}

const EksternLenke: React.FC<Props> = ({children, href, onClick}) => {
    return (
        <Link href={href} target="_blank" onClick={onClick}>
            <span>{children} (åpnes i ny fane)</span>
        </Link>
    );
};

export default EksternLenke;
