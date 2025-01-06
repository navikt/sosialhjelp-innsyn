import React, {PropsWithChildren} from "react";
import {Link} from "@navikt/ds-react";
import {useTranslation} from "next-i18next";

interface Props extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    href: string;
}

const EksternLenke = ({children, href, onClick}: PropsWithChildren<Props>) => {
    const {t} = useTranslation();
    return (
        <Link href={href} target="_blank" onClick={onClick} rel="noopener noreferrer">
            <span>
                <>
                    {children} {t("ekstern_lenke")}
                </>
            </span>
        </Link>
    );
};

export default EksternLenke;
