import React from "react";
import { Link } from "@navikt/ds-react";
import { useTranslations } from "next-intl";

interface Props extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    href: string;
}

const EksternLenke = ({ children, href, onClick }: Props) => {
    const t = useTranslations("common");
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
