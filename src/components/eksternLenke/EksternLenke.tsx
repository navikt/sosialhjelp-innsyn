import React from "react";
import {Link} from "@navikt/ds-react";
import {useTranslation} from "react-i18next";

interface Props extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    href: string;
}

const EksternLenke: React.FC<Props> = ({children, href, onClick}) => {
    const {t} = useTranslation();
    return (
        <Link href={href} target="_blank" onClick={onClick} rel="noopener noreferrer">
            <span>
                {children} {t("ekstern_lenke")}
            </span>
        </Link>
    );
};

export default EksternLenke;
